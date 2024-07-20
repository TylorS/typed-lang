import {
  createConnection,
  createServer,
  createTypeScriptProject,
  loadTsdkByPath,
} from "@volar/language-server/node";

import { getLanguagePlugin } from "./typed-plugin.js";
import { create as createTypeScriptServices } from 'volar-service-typescript';

const connection = createConnection();
const server = createServer(connection);

connection.listen();

connection.onInitialize((params) => {
  const tsdk = params.initializationOptions?.typescript?.tsdk;

  if (!tsdk) {
    throw new Error(
      "The `typescript.tsdk` init option is required. It should point to a directory containing a `typescript.js` or `tsserverlibrary.js` file, such as `node_modules/typescript/lib`."
    );
  }

  const { typescript, diagnosticMessages } = loadTsdkByPath(
    tsdk,
    params.locale
  );

  return server.initialize(
    params,
    createTypeScriptProject(
      typescript,
      diagnosticMessages,
      () => [getLanguagePlugin()],
    ),
    [
      ...createTypeScriptServices(typescript),
      /* TODO: ADD LANGUAGE SERVICE PLUGINS */
    ],
    { pullModelDiagnostics: params.initializationOptions?.pullModelDiagnostics }
  );
});

connection.onInitialized(() => {
  server.initialized();
  server.watchFiles([
    `**/*.{${[
      "js",
      "cjs",
      "mjs",
      "ts",
      "cts",
      "mts",
      "jsx",
      "tsx",
      "json",
      "typed",
    ].join(",")}}`,
  ]);
});
