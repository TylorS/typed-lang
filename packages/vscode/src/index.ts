import * as path from 'node:path';
import * as protocol from '@volar/language-server/protocol';
import {
	LabsInfo,
	activateAutoInsertion,
	activateFindFileReferences,
	activateReloadProjects,
	activateTsConfigStatusItem,
	activateTsVersionStatusItem,
	createLabsInfo,
	getTsdk,
} from '@volar/vscode';
import * as vscode from 'vscode';
import * as lsp from 'vscode-languageclient/node';

let client: lsp.BaseLanguageClient;

type InitOptions = {
	typescript: {
		tsdk: string;
	};
} & Record<string, unknown>;

export async function activate(context: vscode.ExtensionContext): Promise<LabsInfo> {
	const runtimeConfig = vscode.workspace.getConfiguration('typed.language-server');

	const { workspaceFolders } = vscode.workspace;
	const rootPath = workspaceFolders?.[0].uri.fsPath;

	let lsPath = await getConfiguredServerPath(context.workspaceState);
	if (typeof lsPath === 'string' && lsPath.trim() !== '' && typeof rootPath === 'string') {
		lsPath = path.isAbsolute(lsPath) ? lsPath : path.join(rootPath, lsPath);
		console.info(`Using language server at ${lsPath}`);
	} else {
		lsPath = undefined;
	}
	const serverModule = lsPath
		? require.resolve(lsPath)
		: path.join(context.extensionPath, 'dist/server.js');

	const runOptions = { execArgv: [] };
	const debugOptions = { execArgv: ['--nolazy', '--inspect=' + 6009] };

	const serverOptions: lsp.ServerOptions = {
		run: {
			module: serverModule,
			transport: lsp.TransportKind.ipc,
			options: runOptions,
		},
		debug: {
			module: serverModule,
			transport: lsp.TransportKind.ipc,
			options: debugOptions,
		},
	};

	const serverRuntime = runtimeConfig.get<string>('runtime');
	if (serverRuntime) {
		serverOptions.run.runtime = serverRuntime;
		serverOptions.debug.runtime = serverRuntime;
		console.info(`Using ${serverRuntime} as runtime`);
	}

	const initializationOptions = {
		typescript: {
			tsdk: (await getTsdk(context))!.tsdk,
		},
	} satisfies InitOptions;

	const clientOptions = {
		documentSelector: [{ language: 'typed' }],
		initializationOptions,
	} satisfies lsp.LanguageClientOptions;
	client = new lsp.LanguageClient('typed', 'Typed Language Server', serverOptions, clientOptions);
	await client.start();

	// support for auto close tag
	activateAutoInsertion('typed', client);
	activateFindFileReferences('typed.findFileReferences', client);
	activateReloadProjects('typed.reloadProjects', client);
	activateTsConfigStatusItem('typed', 'typed.openTsConfig', client);
	activateTsVersionStatusItem('typed', 'typed.selectTypescriptVersion', context, (text) => text);

	const volarLabs = createLabsInfo(protocol);
	volarLabs.addLanguageClient(client);

	return volarLabs.extensionExports;
}

export function deactivate(): PromiseLike<unknown> | undefined {
	return client?.stop();
}

async function getConfiguredServerPath(workspaceState: vscode.Memento) {
	const scope = 'typed.language-server';
	const detailedLSPath = vscode.workspace.getConfiguration(scope).inspect<string>('ls-path');

	const lsPath =
		detailedLSPath?.globalValue ||
		detailedLSPath?.defaultValue;

	const workspaceLSPath =
		detailedLSPath?.workspaceFolderValue ||
		detailedLSPath?.workspaceValue;

	const useLocalLanguageServerKey = `${scope}.useLocalLS`;
	let useWorkspaceServer = workspaceState.get<boolean>(useLocalLanguageServerKey);

	if (useWorkspaceServer === undefined && workspaceLSPath !== undefined) {
		const msg =
			'This workspace contains an Typed Language Server version. Would you like to use the workplace version?';
		const allowPrompt = 'Allow';
		const dismissPrompt = 'Dismiss';
		const neverPrompt = 'Never in This Workspace';

		const result = await vscode.window.showInformationMessage(
			msg,
			allowPrompt,
			dismissPrompt,
			neverPrompt
		);

		if (result === allowPrompt) {
			await workspaceState.update(useLocalLanguageServerKey, true);
			useWorkspaceServer = true;
		} else if (result === neverPrompt) {
			await workspaceState.update(useLocalLanguageServerKey, false);
		}
	}

	if (useWorkspaceServer === true) {
		return workspaceLSPath || lsPath;
	} else {
		return lsPath;
	}
}
