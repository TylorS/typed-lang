import { createLanguageServicePlugin } from '@volar/typescript/lib/quickstart/createLanguageServicePlugin.js';
import { TsCompiler } from '@typed-lang/compiler';
import { getLanguagePlugin } from './plugin.js'

export = createLanguageServicePlugin(() => ({
	languagePlugins: [getLanguagePlugin(new TsCompiler({ outputMode: "single" }))],
	isAssociatedFileOnly: (_scriptId: string, languageId: string) => {
		if (languageId === 'typed') {
			return true
		}

		return false
	}
}));
