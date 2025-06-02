import { TsCompiler } from '../TsCompiler';
import { Service } from './typescript/Service';
import { findTsConfig } from './typescript/findConfigFile';
import * as path from 'node:path';

export type TypedProjectParams = {
  readonly directory: string
  readonly tsConfigFileName?: string
  readonly outDir?: string
  readonly outputMode?: 'single' | 'multiple'
}

export function makeProject({ directory, tsConfigFileName = 'tsconfig.json', outputMode = 'single', outDir = 'dist' }: TypedProjectParams) {
  const compiler = new TsCompiler({ outputMode });
  const service = new Service(compiler, { write: console.log });
  const cmdLine = findTsConfig(directory, tsConfigFileName)
  return service.openProject(cmdLine, { outDir: path.resolve(directory, outDir) })
}

export function compileProject(params: TypedProjectParams) {
  return makeProject(params).emit()
}