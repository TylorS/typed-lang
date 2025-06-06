/* eslint-disable @typescript-eslint/no-unused-vars */
import { Comment } from "./AST/Comment.js";
import { SourceFile } from "./AST/SourceFile.js";
import { Statement } from "./AST/Statement.js";
import { 
  Declaration,
  BrandDeclaration,
  DataDeclaration,
  DataConstructor,
  VoidConstructor,
  TupleConstructor,
  RecordConstructor,
  FunctionDeclaration,
  ImportDeclaration,
  NamespaceImport,
  NamedImports,
  ImportSpecifier,
  InstanceDeclaration,
  InstanceField,
  TypeAliasDeclaration,
  TypeClassDeclaration,
  VariableDeclaration,
  Destructure,
  TupleDestructure,
  RecordDestructure
} from "./AST/Declaration.js";
import {
  Expression,
  UnaryExpression,
  BinaryExpression,
  FunctionCall,
  ParenthesizedExpression,
  MemberExpression,
  FunctionExpression,
  MatchExpression,
  MatchCase,
  Pattern,
  ArrayPattern
} from "./AST/Expression.js";
import {
  ControlFlow,
  IfStatement,
  IfBlock,
  ElseIfBlock,
  ElseBlock,
  WhileStatement,
  ForOfStatement,
  ForInStatement,
  BreakStatement,
  ContinueStatement,
  ReturnStatement
} from "./AST/ControlFlow.js";
import {
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
  TypeReference
} from "./AST/Type.js";
import {
  Block,
  Field,
  NamedField,
  PositionalField,
  Identifier,
  Literal,
  StringLiteral,
  NumberLiteral,
  BooleanLiteral,
  ArrayLiteral,
  RecordLiteral,
  RecordField,
  NullLiteral,
  UndefinedLiteral,
  Operator,
  PropertyAccess,
  TypeParameter
} from "./AST/index.js";

/**
 * Visitor interface for traversing AST nodes
 */
export interface Visitor<T = void> {
  // Entry point
  visitSourceFile(node: SourceFile): T;
  
  // Statements
  visitStatement(node: Statement): T;
  
  // Declarations  
  visitDeclaration(node: Declaration): T;
  visitBrandDeclaration(node: BrandDeclaration): T;
  visitDataDeclaration(node: DataDeclaration): T;
  visitVoidConstructor(node: VoidConstructor): T;
  visitTupleConstructor(node: TupleConstructor): T;
  visitRecordConstructor(node: RecordConstructor): T;
  visitFunctionDeclaration(node: FunctionDeclaration): T;
  visitImportDeclaration(node: ImportDeclaration): T;
  visitNamespaceImport(node: NamespaceImport): T;
  visitNamedImports(node: NamedImports): T;
  visitImportSpecifier(node: ImportSpecifier): T;
  visitInstanceDeclaration(node: InstanceDeclaration): T;
  visitInstanceField(node: InstanceField): T;
  visitTypeAliasDeclaration(node: TypeAliasDeclaration): T;
  visitTypeClassDeclaration(node: TypeClassDeclaration): T;
  visitVariableDeclaration(node: VariableDeclaration): T;
  visitTupleDestructure(node: TupleDestructure): T;
  visitRecordDestructure(node: RecordDestructure): T;

  // Expressions
  visitExpression(node: Expression): T;
  visitUnaryExpression(node: UnaryExpression): T;
  visitBinaryExpression(node: BinaryExpression): T;
  visitFunctionCall(node: FunctionCall): T;
  visitParenthesizedExpression(node: ParenthesizedExpression): T;
  visitMemberExpression(node: MemberExpression): T;
  visitFunctionExpression(node: FunctionExpression): T;
  visitMatchExpression(node: MatchExpression): T;
  visitMatchCase(node: MatchCase): T;
  visitArrayPattern(node: ArrayPattern): T;

  // Control Flow
  visitControlFlow(node: ControlFlow): T;
  visitIfStatement(node: IfStatement): T;
  visitIfBlock(node: IfBlock): T;
  visitElseIfBlock(node: ElseIfBlock): T;
  visitElseBlock(node: ElseBlock): T;
  visitWhileStatement(node: WhileStatement): T;
  visitForOfStatement(node: ForOfStatement): T;
  visitForInStatement(node: ForInStatement): T;
  visitBreakStatement(node: BreakStatement): T;
  visitContinueStatement(node: ContinueStatement): T;
  visitReturnStatement(node: ReturnStatement): T;

  // Types
  visitType(node: Type): T;
  visitArrayType(node: ArrayType): T;
  visitBooleanLiteralType(node: BooleanLiteralType): T;
  visitBrandedType(node: BrandedType): T;
  visitFunctionType(node: FunctionType): T;
  visitHigherKindedType(node: HigherKindedType): T;
  visitMapType(node: MapType): T;
  visitNumericLiteralType(node: NumericLiteralType): T;
  visitRecordType(node: RecordType): T;
  visitSetType(node: SetType): T;
  visitStringLiteralType(node: StringLiteralType): T;
  visitRestType(node: RestType): T;
  visitTupleType(node: TupleType): T;
  visitTypeReference(node: TypeReference): T;

  // Common nodes
  visitComment(node: Comment): T;
  visitBlock(node: Block): T;
  visitNamedField(node: NamedField): T;
  visitPositionalField(node: PositionalField): T;
  visitIdentifier(node: Identifier): T;
  visitLiteral(node: Literal): T;
  visitStringLiteral(node: StringLiteral): T;
  visitNumberLiteral(node: NumberLiteral): T;
  visitBooleanLiteral(node: BooleanLiteral): T;
  visitArrayLiteral(node: ArrayLiteral): T;
  visitRecordLiteral(node: RecordLiteral): T;
  visitRecordField(node: RecordField): T;
  visitNullLiteral(node: NullLiteral): T;
  visitUndefinedLiteral(node: UndefinedLiteral): T;
  visitOperator(node: Operator): T;
  visitPropertyAccess(node: PropertyAccess): T;
  visitTypeParameter(node: TypeParameter): T;
  visitBuiltinType(node: BuiltinType): T;
}

/**
 * Base visitor implementation that provides default traversal behavior
 */
export abstract class BaseVisitor<T = void> implements Visitor<T> {
  
  visitSourceFile(node: SourceFile): T {
    for (const statement of node.statements) {
      this.visitStatement(statement);
    }
    return this.defaultResult();
  }

  visitStatement(node: Statement): T {
    switch (node._tag) {
      case "FunctionDeclaration":
        return this.visitFunctionDeclaration(node);
      case "VariableDeclaration":
        return this.visitVariableDeclaration(node);
      case "Comment":
        return this.visitComment(node);
      case "BrandDeclaration":
        return this.visitBrandDeclaration(node);
      case "DataDeclaration":
        return this.visitDataDeclaration(node);
      case "ImportDeclaration":
        return this.visitImportDeclaration(node);
      case "InstanceDeclaration":
        return this.visitInstanceDeclaration(node);
      case "TypeAliasDeclaration":
        return this.visitTypeAliasDeclaration(node);
      case "TypeClassDeclaration":
        return this.visitTypeClassDeclaration(node);
      case "IfStatement":
        return this.visitIfStatement(node);
      case "WhileStatement":
        return this.visitWhileStatement(node);
      case "ForOfStatement":
        return this.visitForOfStatement(node);
      case "ForInStatement":
        return this.visitForInStatement(node);
      case "BreakStatement":
        return this.visitBreakStatement(node);
      case "ContinueStatement":
        return this.visitContinueStatement(node);
      case "ReturnStatement":
        return this.visitReturnStatement(node);
      default:
        return this.defaultResult();
    }
  }

  visitDeclaration(node: Declaration): T {
    return this.visitStatement(node);
  }

  visitBrandDeclaration(node: BrandDeclaration): T {
    this.visitIdentifier(node.name);
    this.visitType(node.type);
    return this.defaultResult();
  }

  visitDataDeclaration(node: DataDeclaration): T {
    this.visitIdentifier(node.name);
    for (const typeParam of node.typeParameters) {
      this.visitTypeParameter(typeParam);
    }
    for (const constructor of node.constructors) {
      this.visitDataConstructor(constructor);
    }
    return this.defaultResult();
  }

  visitDataConstructor(node: DataConstructor): T {
    switch (node._tag) {
      case "VoidConstructor":
        return this.visitVoidConstructor(node);
      case "TupleConstructor":
        return this.visitTupleConstructor(node);
      case "RecordConstructor":
        return this.visitRecordConstructor(node);
    }
  }

  visitVoidConstructor(node: VoidConstructor): T {
    this.visitIdentifier(node.name);
    return this.defaultResult();
  }

  visitTupleConstructor(node: TupleConstructor): T {
    this.visitIdentifier(node.name);
    for (const field of node.fields) {
      this.visitField(field);
    }
    return this.defaultResult();
  }

  visitRecordConstructor(node: RecordConstructor): T {
    this.visitIdentifier(node.name);
    for (const field of node.fields) {
      this.visitNamedField(field);
    }
    return this.defaultResult();
  }

  visitFunctionDeclaration(node: FunctionDeclaration): T {
    this.visitIdentifier(node.name);
    for (const typeParam of node.typeParameters) {
      if (typeParam._tag === "TypeParameter") {
        this.visitTypeParameter(typeParam);
      } else {
        this.visitHigherKindedType(typeParam);
      }
    }
    for (const param of node.parameters) {
      this.visitNamedField(param);
    }
    if (node.returnType) {
      this.visitType(node.returnType);
    }
    this.visitBlock(node.block);
    return this.defaultResult();
  }

  visitImportDeclaration(node: ImportDeclaration): T {
    if (node.imports._tag === "NamespaceImport") {
      this.visitNamespaceImport(node.imports);
    } else {
      this.visitNamedImports(node.imports);
    }
    this.visitStringLiteral(node.moduleSpecifier);
    return this.defaultResult();
  }

  visitNamespaceImport(node: NamespaceImport): T {
    this.visitIdentifier(node.name);
    return this.defaultResult();
  }

  visitNamedImports(node: NamedImports): T {
    for (const importSpec of node.imports) {
      this.visitImportSpecifier(importSpec);
    }
    return this.defaultResult();
  }

  visitImportSpecifier(node: ImportSpecifier): T {
    this.visitIdentifier(node.name);
    if (node.alias) {
      this.visitIdentifier(node.alias);
    }
    return this.defaultResult();
  }

  visitInstanceDeclaration(node: InstanceDeclaration): T {
    this.visitIdentifier(node.name);
    for (const typeParam of node.typeParameters) {
      if (typeParam._tag === "TypeParameter") {
        this.visitTypeParameter(typeParam);
      } else {
        this.visitHigherKindedType(typeParam);
      }
    }
    for (const field of node.fields) {
      this.visitInstanceField(field);
    }
    return this.defaultResult();
  }

  visitInstanceField(node: InstanceField): T {
    this.visitIdentifier(node.name);
    this.visitExpression(node.expression);
    return this.defaultResult();
  }

  visitTypeAliasDeclaration(node: TypeAliasDeclaration): T {
    this.visitIdentifier(node.name);
    for (const typeParam of node.typeParameters) {
      this.visitTypeParameter(typeParam);
    }
    this.visitType(node.type);
    return this.defaultResult();
  }

  visitTypeClassDeclaration(node: TypeClassDeclaration): T {
    this.visitIdentifier(node.name);
    for (const typeParam of node.typeParameters) {
      if (typeParam._tag === "TypeParameter") {
        this.visitTypeParameter(typeParam);
      } else {
        this.visitHigherKindedType(typeParam);
      }
    }
    for (const field of node.fields) {
      this.visitNamedField(field);
    }
    return this.defaultResult();
  }

  visitVariableDeclaration(node: VariableDeclaration): T {
    if (node.name._tag === "Identifier") {
      this.visitIdentifier(node.name);
    } else {
      this.visitDestructure(node.name);
    }
    if (node.typeAnnotation) {
      this.visitType(node.typeAnnotation);
    }
    this.visitExpression(node.expression);
    return this.defaultResult();
  }

  visitDestructure(node: Destructure): T {
    switch (node._tag) {
      case "TupleDestructure":
        return this.visitTupleDestructure(node);
      case "RecordDestructure":
        return this.visitRecordDestructure(node);
    }
  }

  visitTupleDestructure(node: TupleDestructure): T {
    for (const field of node.fields) {
      this.visitIdentifier(field);
    }
    return this.defaultResult();
  }

  visitRecordDestructure(node: RecordDestructure): T {
    for (const field of node.fields) {
      this.visitIdentifier(field);
    }
    return this.defaultResult();
  }

  visitExpression(node: Expression): T {
    switch (node._tag) {
      case "UnaryExpression":
        return this.visitUnaryExpression(node);
      case "BinaryExpression":
        return this.visitBinaryExpression(node);
      case "FunctionCall":
        return this.visitFunctionCall(node);
      case "Identifier":
        return this.visitIdentifier(node);
      case "StringLiteral":
      case "NumberLiteral":
      case "BooleanLiteral":
      case "ArrayLiteral":
      case "RecordLiteral":
      case "NullLiteral":
      case "UndefinedLiteral":
        return this.visitLiteral(node);
      case "ParenthesizedExpression":
        return this.visitParenthesizedExpression(node);
      case "MemberExpression":
        return this.visitMemberExpression(node);
      case "FunctionExpression":
        return this.visitFunctionExpression(node);
      case "MatchExpression":
        return this.visitMatchExpression(node);
      default:
        return this.defaultResult();
    }
  }

  visitUnaryExpression(node: UnaryExpression): T {
    this.visitOperator(node.operator);
    this.visitExpression(node.argument);
    return this.defaultResult();
  }

  visitBinaryExpression(node: BinaryExpression): T {
    this.visitExpression(node.left);
    this.visitOperator(node.operator);
    this.visitExpression(node.right);
    return this.defaultResult();
  }

  visitFunctionCall(node: FunctionCall): T {
    this.visitExpression(node.callee);
    for (const typeArg of node.typeArguments) {
      this.visitType(typeArg);
    }
    for (const param of node.parameters) {
      this.visitExpression(param);
    }
    return this.defaultResult();
  }

  visitParenthesizedExpression(node: ParenthesizedExpression): T {
    this.visitExpression(node.expression);
    return this.defaultResult();
  }

  visitMemberExpression(node: MemberExpression): T {
    this.visitExpression(node.object);
    this.visitIdentifier(node.property);
    return this.defaultResult();
  }

  visitFunctionExpression(node: FunctionExpression): T {
    if (node.name) {
      this.visitIdentifier(node.name);
    }
    for (const typeParam of node.typeParameters) {
      if (typeParam._tag === "TypeParameter") {
        this.visitTypeParameter(typeParam);
      } else {
        this.visitHigherKindedType(typeParam);
      }
    }
    for (const param of node.parameters) {
      this.visitNamedField(param);
    }
    if (node.returnType) {
      this.visitType(node.returnType);
    }
    if (node.block._tag === "Block") {
      this.visitBlock(node.block);
    } else {
      this.visitExpression(node.block);
    }
    return this.defaultResult();
  }

  visitMatchExpression(node: MatchExpression): T {
    this.visitExpression(node.matching);
    for (const matchCase of node.cases) {
      this.visitMatchCase(matchCase);
    }
    return this.defaultResult();
  }

  visitMatchCase(node: MatchCase): T {
    this.visitPattern(node.pattern);
    if (node.body._tag === "Block") {
      this.visitBlock(node.body);
    } else {
      this.visitExpression(node.body);
    }
    return this.defaultResult();
  }

  visitPattern(node: Pattern): T {
    switch (node._tag) {
      case "Identifier":
        return this.visitIdentifier(node);
      case "ArrayPattern":
        return this.visitArrayPattern(node);
      case "StringLiteral":
      case "NumberLiteral":
      case "BooleanLiteral":
      case "ArrayLiteral":
      case "RecordLiteral":
      case "NullLiteral":
      case "UndefinedLiteral":
        return this.visitLiteral(node);
      default:
        return this.defaultResult();
    }
  }

  visitArrayPattern(node: ArrayPattern): T {
    for (const element of node.elements) {
      this.visitPattern(element);
    }
    return this.defaultResult();
  }

  visitControlFlow(node: ControlFlow): T {
    return this.visitStatement(node);
  }

  visitIfStatement(node: IfStatement): T {
    this.visitIfBlock(node.ifBlock);
    for (const elseIfBlock of node.elseIfBlocks) {
      this.visitElseIfBlock(elseIfBlock);
    }
    if (node.elseBlock) {
      this.visitElseBlock(node.elseBlock);
    }
    return this.defaultResult();
  }

  visitIfBlock(node: IfBlock): T {
    this.visitExpression(node.condition);
    this.visitBlock(node.block);
    return this.defaultResult();
  }

  visitElseIfBlock(node: ElseIfBlock): T {
    this.visitExpression(node.condition);
    this.visitBlock(node.block);
    return this.defaultResult();
  }

  visitElseBlock(node: ElseBlock): T {
    this.visitBlock(node.block);
    return this.defaultResult();
  }

  visitWhileStatement(node: WhileStatement): T {
    this.visitExpression(node.condition);
    this.visitBlock(node.block);
    return this.defaultResult();
  }

  visitForOfStatement(node: ForOfStatement): T {
    if (node.name._tag === "Identifier") {
      this.visitIdentifier(node.name);
    } else {
      this.visitDestructure(node.name);
    }
    this.visitExpression(node.iterable);
    this.visitBlock(node.block);
    return this.defaultResult();
  }

  visitForInStatement(node: ForInStatement): T {
    if (node.name._tag === "Identifier") {
      this.visitIdentifier(node.name);
    } else {
      this.visitDestructure(node.name);
    }
    this.visitExpression(node.object);
    this.visitBlock(node.block);
    return this.defaultResult();
  }

  visitBreakStatement(_node: BreakStatement): T {
    return this.defaultResult();
  }

  visitContinueStatement(_node: ContinueStatement): T {
    return this.defaultResult();
  }

  visitReturnStatement(node: ReturnStatement): T {
    this.visitExpression(node.expression);
    return this.defaultResult();
  }

  visitType(node: Type): T {
    switch (node._tag) {
      case "ArrayType":
        return this.visitArrayType(node);
      case "BooleanLiteralType":
        return this.visitBooleanLiteralType(node);
      case "BrandedType":
        return this.visitBrandedType(node);
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
      // Handle builtin types
      case "StringType":
      case "NumberType":
      case "BooleanType":
      case "NullType":
      case "UndefinedType":
      case "VoidType":
      case "AnyType":
      case "NeverType":
      case "UnknownType":
      case "SymbolType":
      case "BigIntType":
      case "ObjectType":
      case "FunctionKeywordType":
      case "DateType":
        return this.visitBuiltinType(node);
      default:
        return this.defaultResult();
    }
  }

  visitArrayType(node: ArrayType): T {
    this.visitType(node.element);
    return this.defaultResult();
  }

  visitBooleanLiteralType(_node: BooleanLiteralType): T {
    return this.defaultResult();
  }

  visitBrandedType(node: BrandedType): T {
    this.visitIdentifier(node.name);
    for (const brand of node.brands) {
      this.visitIdentifier(brand);
    }
    return this.defaultResult();
  }

  visitFunctionType(node: FunctionType): T {
    for (const typeParam of node.typeParameters) {
      if (typeParam._tag === "TypeParameter") {
        this.visitTypeParameter(typeParam);
      } else {
        this.visitHigherKindedType(typeParam);
      }
    }
    for (const param of node.parameters) {
      this.visitField(param);
    }
    this.visitType(node.returnType);
    return this.defaultResult();
  }

  visitHigherKindedType(node: HigherKindedType): T {
    this.visitIdentifier(node.name);
    for (const param of node.parameters) {
      if (param._tag === "TypeParameter") {
        this.visitTypeParameter(param);
      } else {
        this.visitHigherKindedType(param);
      }
    }
    if (node.constraint) {
      this.visitType(node.constraint);
    }
    return this.defaultResult();
  }

  visitMapType(node: MapType): T {
    this.visitType(node.key);
    this.visitType(node.value);
    return this.defaultResult();
  }

  visitNumericLiteralType(_node: NumericLiteralType): T {
    return this.defaultResult();
  }

  visitRecordType(node: RecordType): T {
    for (const field of node.fields) {
      this.visitNamedField(field);
    }
    return this.defaultResult();
  }

  visitSetType(node: SetType): T {
    this.visitType(node.value);
    return this.defaultResult();
  }

  visitStringLiteralType(_node: StringLiteralType): T {
    return this.defaultResult();
  }

  visitRestType(node: RestType): T {
    this.visitType(node.element);
    return this.defaultResult();
  }

  visitTupleType(node: TupleType): T {
    for (const member of node.members) {
      this.visitType(member);
    }
    return this.defaultResult();
  }

  visitTypeReference(node: TypeReference): T {
    if (node.name._tag === "Identifier") {
      this.visitIdentifier(node.name);
    } else {
      this.visitPropertyAccess(node.name);
    }
    for (const typeArg of node.typeArguments) {
      this.visitType(typeArg);
    }
    return this.defaultResult();
  }

  visitComment(_node: Comment): T {
    return this.defaultResult();
  }

  visitBlock(node: Block): T {
    for (const statement of node.statements) {
      this.visitStatement(statement);
    }
    return this.defaultResult();
  }

  visitField(node: Field): T {
    switch (node._tag) {
      case "NamedField":
        return this.visitNamedField(node);
      case "PositionalField":
        return this.visitPositionalField(node);
    }
  }

  visitNamedField(node: NamedField): T {
    this.visitIdentifier(node.name);
    if (node.value) {
      this.visitType(node.value);
    }
    return this.defaultResult();
  }

  visitPositionalField(node: PositionalField): T {
    this.visitType(node.value);
    return this.defaultResult();
  }

  visitIdentifier(node: Identifier): T {
    return this.defaultResult();
  }

  visitLiteral(node: Literal): T {
    switch (node._tag) {
      case "StringLiteral":
        return this.visitStringLiteral(node);
      case "NumberLiteral":
        return this.visitNumberLiteral(node);
      case "BooleanLiteral":
        return this.visitBooleanLiteral(node);
      case "ArrayLiteral":
        return this.visitArrayLiteral(node);
      case "RecordLiteral":
        return this.visitRecordLiteral(node);
      case "NullLiteral":
        return this.visitNullLiteral(node);
      case "UndefinedLiteral":
        return this.visitUndefinedLiteral(node);
    }
  }

  visitStringLiteral(node: StringLiteral): T {
    return this.defaultResult();
  }

  visitNumberLiteral(node: NumberLiteral): T {
    return this.defaultResult();
  }

  visitBooleanLiteral(node: BooleanLiteral): T {
    return this.defaultResult();
  }

  visitArrayLiteral(node: ArrayLiteral): T {
    for (const value of node.values) {
      this.visitExpression(value);
    }
    return this.defaultResult();
  }

  visitRecordLiteral(node: RecordLiteral): T {
    for (const field of node.fields) {
      this.visitRecordField(field);
    }
    return this.defaultResult();
  }

  visitRecordField(node: RecordField): T {
    this.visitIdentifier(node.name);
    this.visitExpression(node.value);
    return this.defaultResult();
  }

  visitNullLiteral(node: NullLiteral): T {
    return this.defaultResult();
  }

  visitUndefinedLiteral(node: UndefinedLiteral): T {
    return this.defaultResult();
  }

  visitOperator(node: Operator): T {
    return this.defaultResult();
  }

  visitPropertyAccess(node: PropertyAccess): T {
    this.visitIdentifier(node.left);
    if (node.right._tag === "Identifier") {
      this.visitIdentifier(node.right);
    } else {
      this.visitPropertyAccess(node.right);
    }
    return this.defaultResult();
  }

  visitTypeParameter(node: TypeParameter): T {
    this.visitIdentifier(node.name);
    if (node.constraint) {
      this.visitType(node.constraint);
    }
    return this.defaultResult();
  }

  visitBuiltinType(node: BuiltinType): T {
    return this.defaultResult();
  }

  /**
   * Override this method to provide a default return value for all visit methods
   */
  protected abstract defaultResult(): T;
}

/**
 * Simple visitor that doesn't return any value
 */
export abstract class SimpleVisitor extends BaseVisitor<void> {
  protected defaultResult(): void {
    return;
  }
}

/**
 * Visitor that can accumulate results
 */
export abstract class AccumulatingVisitor<T> extends SimpleVisitor {
  protected results: T[] = [];

  protected accumulate(result: T): void {
    this.results.push(result);
  }

  public getResults(): readonly T[] {
    return this.results;
  }

  protected clearResults(): void {
    this.results = [];
  }
}
