export class ImportManager {
  imports = new Map<FileImport['specifier'], FileImport>();

  addNamespaceImport = (specifier: string, namespace: string): FileImport => { 
    return this.getOrUpdateImport(specifier, fileImport => fileImport.addNamespaceImport(namespace));
  }

  addNamedImport = (specifier: string, name: string, alias?: string): FileImport => { 
    return this.getOrUpdateImport(specifier, fileImport => fileImport.addNamedImport(name, alias));
  }

  identifer = (specifier: string, exportNameOrAlias: string): string => { 
    const fileImport = this.imports.get(specifier);
    return fileImport?.identifer(exportNameOrAlias) ?? exportNameOrAlias;
  }

  toCode = (): string => {
    return Array.from(this.imports.values(), i => i.toCode()).join('\n');
  }

  private getOrUpdateImport = (specifier: string, update: (fileImport: FileImport) => void): FileImport => { 
    let fileImport = this.imports.get(specifier);
    if (!fileImport) {
      fileImport = new FileImport(specifier, new NamedImports([]));
      this.imports.set(specifier, fileImport);
    }
    update(fileImport);
    return fileImport;
  }
}

export class FileImport { 
  constructor(readonly specifier: string, public imports: NamespaceImport | NamedImports) { }


  addNamedImport = (name: string, alias?: string) => { 
    if (this.imports._tag === 'NamedImports') {
      this.imports.imports.push(new NamedImport(name, alias));
    }  
  }

  addNamespaceImport = (namespace: string) => {
    if (this.imports._tag === 'NamedImports') {
      this.imports = new NamespaceImport(namespace);
    }
  }

  identifer = (exportNameOrAlias: string) => {
    if (this.imports._tag === 'NamedImports') {
      const namedImport = this.imports.imports.find((i) => i.name === exportNameOrAlias || i.alias === exportNameOrAlias);
      return namedImport?.alias ?? namedImport?.name;
    } else {
      return this.imports.namespace + '.' + exportNameOrAlias;
    }
  }

  toCode = () => { 
    if (this.imports._tag === 'NamedImports') {
      return `import { ${this.imports.imports.map(i => i.alias ? `${i.name} as ${i.alias}` : i.name).join(', ')} } from '${this.specifier}';`;
    } else {
      return `import * as ${this.imports.namespace} from '${this.specifier}';`;
    }
  }
}

export class NamespaceImport {
  readonly _tag = "NamespaceImport";
  constructor(readonly namespace: string) { }
}

export class NamedImports {
  readonly _tag = "NamedImports";
  constructor(readonly imports: NamedImport[]) { }
}

export class NamedImport {
  constructor(readonly name: string, readonly alias?: string) { }
}