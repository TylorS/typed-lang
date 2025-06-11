import {
  ArrayLiteral,
  ArrayPattern,
  BinaryExpression,
  Block,
  BooleanLiteral,
  BreakStatement,
  ContinueStatement,
  ControlFlow,
  DataDeclaration,
  ElseBlock,
  ElseIfBlock,
  Expression,
  ForInStatement,
  ForOfStatement,
  FunctionCall,
  FunctionDeclaration,
  FunctionExpression,
  Identifier,
  IfBlock,
  IfStatement,
  ImportDeclaration,
  MatchCase,
  MatchExpression,
  MemberExpression,
  NullLiteral,
  NumberLiteral,
  ParenthesizedExpression,
  Pattern,
  RecordLiteral,
  ReturnStatement,
  SourceFile,
  Span,
  Statement,
  StringLiteral,
  TypeAliasDeclaration,
  UnaryExpression,
  UndefinedLiteral,
  VariableDeclaration,
  WhileStatement,
  BrandDeclaration,
  TypeClassDeclaration,
  InstanceDeclaration,
  Comment,
  Type,
  ArrayType,
  BooleanLiteralType,
  BrandedType,
  BuiltinType,
  FunctionType,
  HigherKindedType,
  MapType,
  NumericLiteralType,
  RecordType,
  SetType,
  StringLiteralType,
  RestType,
  TupleType,
  TypeReference,
  Field,
  NamedField,
  PositionalField,
  DataConstructor,
  VoidConstructor,
  TupleConstructor,
  RecordConstructor,
  NamespaceImport,
  NamedImports,
  InstanceField,
  TypeParameter,
  ImportSpecifier,
  PropertyAccess
} from "@typed-lang/parser";

/**
 * Base transformer class that can traverse and modify AST nodes while preserving source positions.
 * Extend this class and override the visit methods to implement specific transformations.
 */
export abstract class Transformer {
  protected sourceFile: SourceFile;

  constructor(sourceFile: SourceFile) {
    this.sourceFile = sourceFile;
  }

  /**
   * Main entry point to transform the AST
   */
  transform(): SourceFile {
    return this.visitSourceFile(this.sourceFile);
  }

  protected visitSourceFile(node: SourceFile): SourceFile {
    const statements = node.statements.map(stmt => this.visitStatement(stmt));
    return new SourceFile(
      node.fileName,
      node.source,
      statements,
      node.span
    );
  }

  protected visitStatement(node: Statement): Statement {
    if (node._tag === "FunctionDeclaration") {
      return this.visitFunctionDeclaration(node);
    } else if (node._tag === "VariableDeclaration") {
      return this.visitVariableDeclaration(node);
    } else if (node._tag === "Comment") {
      return this.visitComment(node);
    } else if (node._tag === "DataDeclaration") {
      return this.visitDataDeclaration(node);
    } else if (node._tag === "ImportDeclaration") {
      return this.visitImportDeclaration(node);
    } else if (node._tag === "TypeAliasDeclaration") {
      return this.visitTypeAliasDeclaration(node);
    } else if (node._tag === "BrandDeclaration") {
      return this.visitBrandDeclaration(node);
    } else if (node._tag === "TypeClassDeclaration") {
      return this.visitTypeClassDeclaration(node);
    } else if (node._tag === "InstanceDeclaration") {
      return this.visitInstanceDeclaration(node);
    } else if (this.isControlFlow(node)) {
      return this.visitControlFlow(node);
    }
    return node;
  }

  protected isControlFlow(node: Statement): node is ControlFlow {
    return (
      node._tag === "IfStatement" ||
      node._tag === "WhileStatement" ||
      node._tag === "ForOfStatement" ||
      node._tag === "ForInStatement" ||
      node._tag === "BreakStatement" ||
      node._tag === "ContinueStatement" ||
      node._tag === "ReturnStatement"
    );
  }

  protected visitControlFlow(node: ControlFlow): ControlFlow {
    switch (node._tag) {
      case "IfStatement":
        return this.visitIfStatement(node);
      case "ForInStatement":
        return this.visitForInStatement(node);
      case "ForOfStatement":
        return this.visitForOfStatement(node);
      case "WhileStatement":
        return this.visitWhileStatement(node);
      case "BreakStatement":
        return this.visitBreakStatement(node);
      case "ContinueStatement":
        return this.visitContinueStatement(node);
      case "ReturnStatement":
        return this.visitReturnStatement(node);
      default:
        return node;
    }
  }

  protected visitExpression(node: Expression): Expression {
    switch (node._tag) {
      case "ArrayLiteral":
        return this.visitArrayLiteral(node);
      case "BinaryExpression":
        return this.visitBinaryExpression(node);
      case "BooleanLiteral":
        return this.visitBooleanLiteral(node);
      case "FunctionCall":
        return this.visitFunctionCall(node);
      case "FunctionExpression":
        return this.visitFunctionExpression(node);
      case "Identifier":
        return this.visitIdentifier(node);
      case "MatchExpression":
        return this.visitMatchExpression(node);
      case "MemberExpression":
        return this.visitMemberExpression(node);
      case "NullLiteral":
        return this.visitNullLiteral(node);
      case "NumberLiteral":
        return this.visitNumberLiteral(node);
      case "ParenthesizedExpression":
        return this.visitParenthesizedExpression(node);
      case "RecordLiteral":
        return this.visitRecordLiteral(node);
      case "StringLiteral":
        return this.visitStringLiteral(node);
      case "UnaryExpression":
        return this.visitUnaryExpression(node);
      case "UndefinedLiteral":
        return this.visitUndefinedLiteral(node);
      default:
        return node;
    }
  }

  // Declaration visitors
  protected visitBrandDeclaration(node: BrandDeclaration): BrandDeclaration {
    const name = this.visitIdentifier(node.name);
    const type = this.visitType(node.type);
    if (name === node.name && type === node.type) return node;
    return new BrandDeclaration(
      name,
      node.equals,
      type,
      node.span,
      node.exported
    );
  }

  protected visitDataDeclaration(node: DataDeclaration): DataDeclaration {
    const name = this.visitIdentifier(node.name);
    const typeParameters = node.typeParameters.map(tp => this.visitTypeParameter(tp));
    const constructors = node.constructors.map(c => this.visitDataConstructor(c));
    if (
      name === node.name &&
      typeParameters.every((tp, i) => tp === node.typeParameters[i]) &&
      constructors.every((c, i) => c === node.constructors[i])
    ) {
      return node;
    }
    return new DataDeclaration(
      name,
      typeParameters,
      node.equals,
      constructors,
      node.span,
      node.exported
    );
  }

  protected visitFunctionDeclaration(node: FunctionDeclaration): FunctionDeclaration {
    const name = this.visitIdentifier(node.name);
    const typeParameters = node.typeParameters.map(tp => 
      tp._tag === "TypeParameter" ? this.visitTypeParameter(tp) : this.visitHigherKindedType(tp)
    );
    const parameters = node.parameters.map(p => this.visitNamedField(p));
    const returnType = node.returnType ? this.visitType(node.returnType) : undefined;
    const block = this.visitBlock(node.block);
    if (
      name === node.name &&
      typeParameters.every((tp, i) => tp === node.typeParameters[i]) &&
      parameters.every((p, i) => p === node.parameters[i]) &&
      returnType === node.returnType &&
      block === node.block
    ) {
      return node;
    }
    return new FunctionDeclaration(
      name,
      typeParameters,
      parameters,
      returnType,
      block,
      node.span,
      node.exported
    );
  }

  protected visitImportDeclaration(node: ImportDeclaration): ImportDeclaration {
    const imports = node.imports._tag === "NamedImports" 
      ? this.visitNamedImports(node.imports)
      : this.visitNamespaceImport(node.imports);
    const moduleSpecifier = this.visitStringLiteral(node.moduleSpecifier);
    if (imports === node.imports && moduleSpecifier === node.moduleSpecifier) {
      return node;
    }
    return new ImportDeclaration(imports, moduleSpecifier, node.span);
  }

  protected visitNamespaceImport(node: NamespaceImport): NamespaceImport {
    const name = this.visitIdentifier(node.name);
    if (name === node.name) return node;
    return new NamespaceImport(name, node.span);
  }

  protected visitInstanceDeclaration(node: InstanceDeclaration): InstanceDeclaration {
    const name = this.visitIdentifier(node.name);
    const typeParameters = node.typeParameters.map(tp => 
      tp._tag === "TypeParameter" ? this.visitTypeParameter(tp) : this.visitHigherKindedType(tp)
    );
    const fields = node.fields.map(f => this.visitInstanceField(f));
    if (
      name === node.name &&
      typeParameters.every((tp, i) => tp === node.typeParameters[i]) &&
      fields.every((f, i) => f === node.fields[i])
    ) {
      return node;
    }
    return new InstanceDeclaration(
      name,
      typeParameters,
      node.openBrace,
      fields,
      node.closeBrace,
      node.span,
      node.exported
    );
  }

  protected visitTypeAliasDeclaration(node: TypeAliasDeclaration): TypeAliasDeclaration {
    const name = this.visitIdentifier(node.name);
    const typeParameters = node.typeParameters.map(tp => this.visitTypeParameter(tp));
    const type = this.visitType(node.type);
    if (
      name === node.name &&
      typeParameters.every((tp, i) => tp === node.typeParameters[i]) &&
      type === node.type
    ) {
      return node;
    }
    return new TypeAliasDeclaration(
      name,
      typeParameters,
      type,
      node.span,
      node.exported
    );
  }

  protected visitTypeClassDeclaration(node: TypeClassDeclaration): TypeClassDeclaration {
    const name = this.visitIdentifier(node.name);
    const typeParameters = node.typeParameters.map(tp => 
      tp._tag === "TypeParameter" ? this.visitTypeParameter(tp) : this.visitHigherKindedType(tp)
    );
    const fields = node.fields.map(f => this.visitNamedField(f));
    if (
      name === node.name &&
      typeParameters.every((tp, i) => tp === node.typeParameters[i]) &&
      fields.every((f, i) => f === node.fields[i])
    ) {
      return node;
    }
    return new TypeClassDeclaration(
      name,
      typeParameters,
      node.openBrace,
      fields,
      node.closeBrace,
      node.span,
      node.exported
    );
  }

  protected visitVariableDeclaration(node: VariableDeclaration): VariableDeclaration {
    const name = node.name;
    const typeAnnotation = node.typeAnnotation ? this.visitType(node.typeAnnotation) : undefined;
    const expression = this.visitExpression(node.expression);
    if (
      name === node.name &&
      typeAnnotation === node.typeAnnotation &&
      expression === node.expression
    ) {
      return node;
    }
    return new VariableDeclaration(
      node.keyword,
      name,
      typeAnnotation,
      node.equals,
      expression,
      node.span,
      node.exported
    );
  }

  // Statement visitors
  protected visitBlock(node: Block): Block {
    const statements = node.statements.map(stmt => this.visitStatement(stmt));
    if (statements.every((stmt, i) => stmt === node.statements[i])) {
      return node;
    }
    return new Block(statements, node.span);
  }

  protected visitBreakStatement(node: BreakStatement): BreakStatement {
    return node;
  }

  protected visitContinueStatement(node: ContinueStatement): ContinueStatement {
    return node;
  }

  protected visitForInStatement(node: ForInStatement): ForInStatement {
    const object = this.visitExpression(node.object);
    const block = this.visitBlock(node.block);
    if (object === node.object && block === node.block) return node;
    return new ForInStatement(
      node.keyword,
      node.variable,
      node.name,
      object,
      block,
      node.span
    );
  }

  protected visitForOfStatement(node: ForOfStatement): ForOfStatement {
    const iterable = this.visitExpression(node.iterable);
    const block = this.visitBlock(node.block);
    if (iterable === node.iterable && block === node.block) return node;
    return new ForOfStatement(
      node.keyword,
      node.variable,
      node.name,
      iterable,
      block,
      node.span
    );
  }

  protected visitIfStatement(node: IfStatement): IfStatement {
    const ifBlock = this.visitIfBlock(node.ifBlock);
    const elseIfBlocks = node.elseIfBlocks.map(block => this.visitElseIfBlock(block));
    const elseBlock = node.elseBlock ? this.visitElseBlock(node.elseBlock) : undefined;
    if (
      ifBlock === node.ifBlock &&
      elseIfBlocks.every((block, i) => block === node.elseIfBlocks[i]) &&
      elseBlock === node.elseBlock
    ) {
      return node;
    }
    return new IfStatement(ifBlock, elseIfBlocks, elseBlock, node.span);
  }

  protected visitIfBlock(node: IfBlock): IfBlock {
    const condition = this.visitExpression(node.condition);
    const block = this.visitBlock(node.block);
    if (condition === node.condition && block === node.block) return node;
    return new IfBlock(node.keyword, condition, block, node.span);
  }

  protected visitElseIfBlock(node: ElseIfBlock): ElseIfBlock {
    const condition = this.visitExpression(node.condition);
    const block = this.visitBlock(node.block);
    if (condition === node.condition && block === node.block) return node;
    return new ElseIfBlock(
      node.elseKeyword,
      node.ifKeyword,
      condition,
      block,
      node.span
    );
  }

  protected visitElseBlock(node: ElseBlock): ElseBlock {
    const block = this.visitBlock(node.block);
    if (block === node.block) return node;
    return new ElseBlock(node.keyword, block, node.span);
  }

  protected visitWhileStatement(node: WhileStatement): WhileStatement {
    const condition = this.visitExpression(node.condition);
    const block = this.visitBlock(node.block);
    if (condition === node.condition && block === node.block) return node;
    return new WhileStatement(node.keyword, condition, block, node.span);
  }

  protected visitReturnStatement(node: ReturnStatement): ReturnStatement {
    const expression = this.visitExpression(node.expression);
    if (expression === node.expression) return node;
    return new ReturnStatement(node.keyword, expression, node.span);
  }

  // Expression visitors
  protected visitArrayLiteral(node: ArrayLiteral): ArrayLiteral {
    const values = node.values.map(value => this.visitExpression(value));
    if (values.every((value, i) => value === node.values[i])) return node;
    return new ArrayLiteral(values, node.span);
  }

  protected visitBinaryExpression(node: BinaryExpression): BinaryExpression {
    const left = this.visitExpression(node.left);
    const right = this.visitExpression(node.right);
    if (left === node.left && right === node.right) return node;
    return new BinaryExpression(node.operator, left, right, node.span);
  }

  protected visitBooleanLiteral(node: BooleanLiteral): BooleanLiteral {
    return node;
  }

  protected visitFunctionCall(node: FunctionCall): FunctionCall {
    const callee = this.visitExpression(node.callee);
    const parameters = node.parameters.map(param => this.visitExpression(param));
    if (callee === node.callee && parameters.every((param, i) => param === node.parameters[i])) {
      return node;
    }
    return new FunctionCall(callee, node.typeArguments, parameters, node.span);
  }

  protected visitFunctionExpression(node: FunctionExpression): FunctionExpression {
    const block = this.visitBlock(node.block as Block);
    if (block === node.block) return node;
    return new FunctionExpression(
      node.name,
      node.typeParameters,
      node.parameters,
      node.returnType,
      block,
      node.span
    );
  }

  protected visitIdentifier(node: Identifier): Identifier {
    return node;
  }

  protected visitMatchExpression(node: MatchExpression): MatchExpression {
    const matching = this.visitExpression(node.matching);
    const cases = node.cases.map(c => this.visitMatchCase(c));
    if (
      matching === node.matching &&
      cases.every((c, i) => c === node.cases[i])
    ) {
      return node;
    }
    return new MatchExpression(matching, cases, node.span);
  }

  protected visitMatchCase(node: MatchCase): MatchCase {
    const pattern = this.visitPattern(node.pattern);
    const body = node.body instanceof Block ? this.visitBlock(node.body) : this.visitExpression(node.body);
    if (pattern === node.pattern && body === node.body) return node;
    return new MatchCase(pattern, body, node.span);
  }

  protected visitPattern(node: Pattern): Pattern {
    if (node._tag === "ArrayPattern") {
      const elements = node.elements.map(elem => this.visitPattern(elem));
      if (elements.every((elem, i) => elem === node.elements[i])) return node;
      return new ArrayPattern(elements, node.span);
    }
    return node;
  }

  protected visitMemberExpression(node: MemberExpression): MemberExpression {
    const object = this.visitExpression(node.object);
    if (object === node.object) return node;
    return new MemberExpression(object, node.questionMark, node.dot, node.property, node.span);
  }

  protected visitNullLiteral(node: NullLiteral): NullLiteral {
    return node;
  }

  protected visitNumberLiteral(node: NumberLiteral): NumberLiteral {
    return node;
  }

  protected visitParenthesizedExpression(node: ParenthesizedExpression): ParenthesizedExpression {
    const expression = this.visitExpression(node.expression);
    if (expression === node.expression) return node;
    return new ParenthesizedExpression(node.openParen, expression, node.closeParen, node.span);
  }

  protected visitRecordLiteral(node: RecordLiteral): RecordLiteral {
    const fields = node.fields.map(field => ({
      ...field,
      value: this.visitExpression(field.value)
    }));
    if (fields.every((field, i) => field.value === node.fields[i].value)) {
      return node;
    }
    return new RecordLiteral(fields, node.span);
  }

  protected visitStringLiteral(node: StringLiteral): StringLiteral {
    return node;
  }

  protected visitUnaryExpression(node: UnaryExpression): UnaryExpression {
    const argument = this.visitExpression(node.argument);
    if (argument === node.argument) return node;
    return new UnaryExpression(node.operator, argument, node.span);
  }

  protected visitUndefinedLiteral(node: UndefinedLiteral): UndefinedLiteral {
    return node;
  }

  // Type visitors
  protected visitType(node: Type): Type {
    switch (node._tag) {
      case "ArrayType":
        return this.visitArrayType(node);
      case "BooleanLiteralType":
        return this.visitBooleanLiteralType(node);
      case "BrandedType":
        return this.visitBrandedType(node);
      case "AnyType":
      case "BigIntType":
      case "BooleanType":
      case "DateType":
      case "FunctionKeywordType":
      case "NeverType":
      case "NullType":
      case "NumberType":
      case "ObjectType":
      case "StringType":
      case "SymbolType":
      case "UndefinedType":
      case "UnknownType":
      case "VoidType":
        return this.visitBuiltinType(node);
      case "FunctionType":
        return this.visitFunctionType(node);
      case "HigherKindedType":
        return this.visitHigherKindedType(node);
      case "MapType":
        return this.visitMapType(node);
      case "NumericLiteralType":
        return this.visitNumericLiteralType(node);
      case "RecordType":
        return this.visitRecordType(node);
      case "SetType":
        return this.visitSetType(node);
      case "StringLiteralType":
        return this.visitStringLiteralType(node);
      case "RestType":
        return this.visitRestType(node);
      case "TupleType":
        return this.visitTupleType(node);
      case "TypeReference":
        return this.visitTypeReference(node);
      default:
        return node;
    }
  }

  protected visitArrayType(node: ArrayType): ArrayType {
    const element = this.visitType(node.element);
    if (element === node.element) return node;
    return new ArrayType(element, node.span);
  }

  protected visitBooleanLiteralType(node: BooleanLiteralType): BooleanLiteralType {
    return node;
  }

  protected visitBrandedType(node: BrandedType): BrandedType {
    const name = this.visitIdentifier(node.name);
    const brands = node.brands.map(b => this.visitIdentifier(b));
    if (name === node.name && brands.every((b, i) => b === node.brands[i])) return node;
    return new BrandedType(name, brands, node.span);
  }

  protected visitBuiltinType(node: BuiltinType): BuiltinType {
    return node;
  }

  protected visitFunctionType(node: FunctionType): FunctionType {
    const typeParameters = node.typeParameters.map(tp => 
      tp._tag === "TypeParameter" ? this.visitTypeParameter(tp) : this.visitHigherKindedType(tp)
    );
    const parameters = node.parameters.map(p => this.visitField(p));
    const returnType = this.visitType(node.returnType);
    if (
      typeParameters.every((tp, i) => tp === node.typeParameters[i]) &&
      parameters.every((p, i) => p === node.parameters[i]) &&
      returnType === node.returnType
    ) {
      return node;
    }
    return new FunctionType(typeParameters, parameters, returnType, node.span);
  }

  protected visitHigherKindedType(node: HigherKindedType): HigherKindedType {
    const name = this.visitIdentifier(node.name);
    const parameters = node.parameters.map(tp => 
      tp._tag === "TypeParameter" ? this.visitTypeParameter(tp) : this.visitHigherKindedType(tp)
    );
    const constraint = node.constraint ? this.visitType(node.constraint) : undefined;
    if (
      name === node.name &&
      parameters.every((tp, i) => tp === node.parameters[i]) &&
      constraint === node.constraint
    ) {
      return node;
    }
    return new HigherKindedType(name, parameters, constraint, node.span);
  }

  protected visitMapType(node: MapType): MapType {
    const key = this.visitType(node.key);
    const value = this.visitType(node.value);
    if (key === node.key && value === node.value) return node;
    return new MapType(key, value, node.span);
  }

  protected visitNumericLiteralType(node: NumericLiteralType): NumericLiteralType {
    return node;
  }

  protected visitRecordType(node: RecordType): RecordType {
    const fields = node.fields.map(f => this.visitNamedField(f));
    if (fields.every((f, i) => f === node.fields[i])) return node;
    return new RecordType(fields, node.span);
  }

  protected visitSetType(node: SetType): SetType {
    const value = this.visitType(node.value);
    if (value === node.value) return node;
    return new SetType(value, node.span);
  }

  protected visitStringLiteralType(node: StringLiteralType): StringLiteralType {
    return node;
  }

  protected visitRestType(node: RestType): RestType {
    const element = this.visitType(node.element);
    if (element === node.element) return node;
    return new RestType(element, node.span);
  }

  protected visitTupleType(node: TupleType): TupleType {
    const members = node.members.map(m => 
      m._tag === "RestType" ? this.visitRestType(m) : this.visitType(m)
    );
    if (members.every((m, i) => m === node.members[i])) return node;
    return new TupleType(members, node.span);
  }

  protected visitTypeReference(node: TypeReference): TypeReference {
    const name = node.name._tag === "Identifier" 
      ? this.visitIdentifier(node.name)
      : this.visitPropertyAccess(node.name);
    const typeArguments = node.typeArguments.map(ta => this.visitType(ta));
    if (
      name === node.name &&
      typeArguments.every((ta, i) => ta === node.typeArguments[i])
    ) {
      return node;
    }
    return new TypeReference(name, typeArguments, node.span);
  }

  protected visitPropertyAccess(node: PropertyAccess): PropertyAccess {
    const left = this.visitIdentifier(node.left);
    const right = node.right._tag === "Identifier" 
      ? this.visitIdentifier(node.right)
      : this.visitPropertyAccess(node.right);
    if (left === node.left && right === node.right) return node;
    return new PropertyAccess(left, node.dot, right, node.span);
  }

  // Field visitors
  protected visitField(node: Field): Field {
    switch (node._tag) {
      case "NamedField":
        return this.visitNamedField(node);
      case "PositionalField":
        return this.visitPositionalField(node);
    }
  }

  protected visitNamedField(node: NamedField): NamedField {
    const name = this.visitIdentifier(node.name);
    const value = node.value ? this.visitType(node.value) : undefined;
    if (name === node.name && value === node.value) return node;
    return new NamedField(name, value, node.span);
  }

  protected visitPositionalField(node: PositionalField): PositionalField {
    const value = this.visitType(node.value);
    if (value === node.value) return node;
    return new PositionalField(node.index, value, node.span);
  }

  protected visitInstanceField(node: InstanceField): InstanceField {
    const name = this.visitIdentifier(node.name);
    const expression = this.visitExpression(node.expression);
    if (name === node.name && expression === node.expression) return node;
    return new InstanceField(name, expression, node.span);
  }

  // Other visitors
  protected visitComment(node: Comment): Comment {
    return node;
  }

  protected visitDataConstructor(node: DataConstructor): DataConstructor {
    switch (node._tag) {
      case "VoidConstructor":
        return new VoidConstructor(
          this.visitIdentifier(node.name),
          node.span
        );
      case "TupleConstructor":
        return new TupleConstructor(
          this.visitIdentifier(node.name),
          node.fields.map(f => this.visitField(f)),
          node.span
        );
      case "RecordConstructor":
        return new RecordConstructor(
          this.visitIdentifier(node.name),
          node.fields.map(f => this.visitNamedField(f)),
          node.span
        );
    }
  }

  protected visitImportSpecifier(node: ImportSpecifier): ImportSpecifier {
    const name = this.visitIdentifier(node.name);
    const alias = node.alias ? this.visitIdentifier(node.alias) : null;
    if (name === node.name && alias === node.alias) return node;
    return new ImportSpecifier(name, alias, node.span);
  }

  protected visitNamedImports(node: NamedImports): NamedImports {
    const imports = node.imports.map(i => this.visitImportSpecifier(i));
    if (imports.every((i, idx) => i === node.imports[idx])) return node;
    return new NamedImports(imports, node.span);
  }

  protected visitTypeParameter(node: TypeParameter): TypeParameter {
    const name = this.visitIdentifier(node.name);
    const constraint = node.constraint ? this.visitType(node.constraint) : undefined;
    if (name === node.name && constraint === node.constraint) return node;
    return new TypeParameter(name, constraint, node.span);
  }

  /**
   * Helper method to create a new node with an updated span
   */
  protected withSpan<T extends { span: Span }>(node: T, span: Span): T {
    return { ...node, span };
  }
}
