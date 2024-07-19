export * from "./CodeGenerator.js";
export * from "./CompilerService.js";
export * from "./ImportManager.js";
export * from "./snapshots.js";

import * as DTS_GEN from "./generators/dts/index.js";

export const DTS = [DTS_GEN.DataDeclarationDTSGenerator] as const;

import * as TS_GEN from "./generators/ts/index.js";

export const TS = [TS_GEN.DataDeclarationTSGenerator] as const;
