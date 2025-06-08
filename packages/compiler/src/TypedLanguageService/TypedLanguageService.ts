import { TsCompiler } from '../TsCompiler';
import { Service } from './typescript/Service';
import { findTsConfig } from './typescript/findConfigFile';
import * as path from 'node:path';
import * as fs from 'node:fs';
import { Project } from './typescript/Project';

export type TypedProjectParams = {
  readonly directory: string
  readonly tsConfigFileName?: string
  readonly rootDir?: string
  readonly outDir?: string
  readonly outputMode?: 'single' | 'multiple'
}

export function makeProject({ directory, tsConfigFileName = 'tsconfig.json', outputMode = 'single', outDir = 'dist', rootDir }: TypedProjectParams) {
  const compiler = new TsCompiler({ outputMode });
  const service = new Service(compiler, { write: console.log });
  const cmdLine = findTsConfig(directory, tsConfigFileName)
  return service.openProject(cmdLine, { rootDir: rootDir ?? directory, outDir: path.resolve(directory, outDir) })
}

export function compileProject(params: TypedProjectParams) {
  const project = makeProject(params)
  addDirectoryToProject(project, params.directory)
  return project.emit()
}

export function findAllFilesInDirectory(dir: string) {
  const files = fs.readdirSync(dir, { recursive: true, encoding: 'utf-8' });
  return files.map((p) => path.resolve(dir, p));
}

export function findAllTypedFilesInDirectory(dir: string) {
  const files = findAllFilesInDirectory(dir);
  return files.filter((f) => f.endsWith(".typed"));
}

export function addDirectoryToProject(project: Project, dir: string) {
  const files = findAllTypedFilesInDirectory(dir);
  for (const file of files) {
    project.addFile(file)
  }
}