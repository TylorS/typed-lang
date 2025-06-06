import {
  BrandedType,
  FunctionType,
  HigherKindedType,
  RecordType,
  RestType,
  TupleType,
  Type,
  TypeReference,
} from "@typed-lang/parser";
import { Interpolation, t } from "../Template.js";
import { identiferOrPropertyAccess } from "./identifierOrPropertyAccessTemplate.js";
import { typeParametersTemplate, typeParameterTemplate } from "./typeParametersTemplate.js";
import { unwrapHkt } from "./unwrapHKT.js";

export type HktsByName = Map<string, { hkt: HigherKindedType, params: string[] }>

// Add a context flag to indicate if we're in a typeclass method context
export type TypeTemplateContext = {
  inTypeclassProperty?: boolean;
}

export function typeTemplate(type: Type, hktsByName?: HktsByName, context?: TypeTemplateContext): Interpolation {
  switch (type._tag) {
    case "AnyType":
      return t.span(type.span)(`any`);
    case "ArrayType":
      return t.span(type.span)(t`ReadonlyArray<${typeTemplate(type.element, hktsByName, context)}>`);
    case "BooleanType":
      return t.span(type.span)(t`boolean`);
    case "BigIntType":
      return t.span(type.span)(t`bigint`);
    case "BooleanLiteralType":
      return t.span(type.span)(t`${String(type.value)}`);
    case "DateType":
      return t.span(type.span)(t`Date`);
    case "FunctionKeywordType":
      return t.span(type.span)(t`Function`);
    case "MapType":
      return t.span(type.span)(
        t`ReadonlyMap<${typeTemplate(type.key, hktsByName, context)}, ${typeTemplate(type.value, hktsByName, context)}>`
      );
    case "NeverType":
      return t.span(type.span)(t`never`);
    case "NullType":
      return t.span(type.span)(t`null`);
    case "NumberType":
      return t.span(type.span)(t`number`);
    case "NumericLiteralType":
      return t.span(type.span)(t`${String(type.value)}`);
    case "ObjectType":
      return t.span(type.span)(t`object`);
    case "SetType":
      return t.span(type.span)(t`ReadonlySet<${typeTemplate(type.value, hktsByName, context)}>`);
    case "StringType":
      return t.span(type.span)(t`string`);
    case "StringLiteralType":
      return t.span(type.span)(t`${JSON.stringify(type.text)}`);
    case "SymbolType":
      return t.span(type.span)(t`symbol`);
    case "TypeReference":
      return typeReferenceTemplate(type, hktsByName, context);
    case "UndefinedType":
      return t.span(type.span)(t`undefined`);
    case "UnknownType":
      return t.span(type.span)(t`unknown`);
    case "VoidType":
      return t.span(type.span)(t`void`);
    case "BrandedType":
      return brandedTypeTemplate(type, hktsByName, context);
    case "FunctionType":
      return functionTypeTemplate(type, hktsByName, context);
    case "HigherKindedType":
      return higherKindedTypeTemplate(type, hktsByName);
    case "RecordType":
      return recordTypeTemplate(type, hktsByName, context);
    case "RestType":
      return restTypeTemplate(type, hktsByName, context);
    case "TupleType":
      return tupleTypeTemplate(type, hktsByName, context);
    default:
      throw new Error(`Unhandled type: ${JSON.stringify(type, null, 2)}`);
  }
}

function typeReferenceTemplate(type: TypeReference, hktsByName?: HktsByName, context?: TypeTemplateContext): Interpolation {
  // Check if this is a higher-kinded type reference
  if (hktsByName && type.name._tag === "Identifier" && hktsByName.has(type.name.text)) {
    const hktInfo = hktsByName.get(type.name.text)!;

    // Use the same parameter logic as in function type parameters
    const hktLevel = hktInfo.params.length;
    const additionalParamsCount = hktLevel - 1;
    const startPosition = 10 - hktLevel;
    const allPossibleParams = ['Z', 'Y', 'X', 'W', 'V', 'U', 'S', 'R', 'E'];
    const hktParams = allPossibleParams.slice(startPosition, startPosition + additionalParamsCount);


    // Build the Kind type: Kind<F, ...hktParams, A>
    const allParams = [
      identiferOrPropertyAccess(type.name),
      ...hktParams.map(param => param),
      ...type.typeArguments.map(arg => typeTemplate(arg, hktsByName, context))
    ];

    const arity = allParams.length - 1

    const Kind = t.import(`@typed-lang/typedlib`, `Kind${arity === 1 ? '' : arity}`);


    return t.span(type.span)(
      Kind.asNamedImport(),
      t`${Kind}<${t.intercolate(', ')(...allParams)}>`
    );
  }

  return t.span(type.span)(
    t`${identiferOrPropertyAccess(type.name)}${typeArgumentsTemplate(
      type.typeArguments,
      hktsByName,
      context
    )}`
  );
}

// TODO: FInish
// eslint-disable-next-line @typescript-eslint/no-unused-vars
function brandedTypeTemplate(type: BrandedType, _hktsByName?: HktsByName, _context?: TypeTemplateContext): Interpolation {
  const Branded = t.import(`@typed-lang/typedlib`, `Branded`)
  const Brand = t.import(`@typed-lang/typedlib`, `Brand`)

  const BRAND_NAME = type.name.text.toUpperCase()

  return t.span(type.span)(
    Branded.asNamespaceImport('TypedLib'),
    Brand.asNamespaceImport('TypedLib'),
    t`export type `,
    t.span(type.name.span)(BRAND_NAME),
    t` = ${t.intercolate(' & ')(...type.brands.map((brand) => t`${Brand}<'${t.identifier(brand)}'>`))}`,
    t.newLine(),
    t``
  );
}

function functionTypeTemplate(type: FunctionType, hktsByName?: HktsByName, context?: TypeTemplateContext): Interpolation {
  // Only apply HKT expansion if we're in a typeclass property context
  if (context?.inTypeclassProperty && hktsByName) {
    // Collect original type parameters
    const originalTypeParams: string[] = [];
    type.typeParameters.forEach(param => {
      if (param._tag === "TypeParameter") {
        originalTypeParams.push(param.name.text);
      }
    });

    // Collect HKT parameters
    const hktParams: string[] = [];
    for (const hktInfo of hktsByName.values()) {
      // For HKTn, we need n-1 parameters starting from position (10-n)
      const hktLevel = hktInfo.params.length;
      const additionalParamsCount = hktLevel - 1;
      const startPosition = 10 - hktLevel;

      // Get the correct parameters: for HKT10 start at 0 (Z), for HKT9 start at 1 (Y), etc.
      const allPossibleParams = ['Z', 'Y', 'X', 'W', 'V', 'U', 'S', 'R', 'E'];
      const levelHktParams = allPossibleParams.slice(startPosition, startPosition + additionalParamsCount);
      hktParams.push(...levelHktParams);
    }

    // Find where HKT types first appear in the function signature
    let firstHktParamIndex = -1;
    for (let i = 0; i < type.parameters.length; i++) {
      const param = type.parameters[i];
      if (param.value && containsHktType(param.value, hktsByName)) {
        firstHktParamIndex = i;
        break;
      }
    }

    // Determine type parameter order based on where HKT types first appear
    let allTypeParams: string[];
    if (firstHktParamIndex === 0) {
      // HKT type appears in first parameter, put HKT params first
      allTypeParams = [...hktParams, ...originalTypeParams];
    } else {
      // HKT type appears later or not at all, put original params first
      allTypeParams = [...originalTypeParams, ...hktParams];
    }

    const typeParamsStr = allTypeParams.length > 0 ? `<${allTypeParams.join(', ')}>` : '';

    return t.span(type.span)(
      t`${typeParamsStr}(${t.intercolate(`, `)(
        ...type.parameters.map((param) => {
          if (param._tag === "PositionalField") {
            // Pass context but not inTypeclassProperty to avoid nested HKT expansion
            return t`arg${String(param.index)}: ${typeTemplate(param.value, hktsByName, {})}`;
          }

          if (param.value) {
            // Pass context but not inTypeclassProperty to avoid nested HKT expansion  
            return t`${t.identifier(param.name)}: ${typeTemplate(param.value, hktsByName, {})}`;
          }

          const lowerCaseName = param.name.text.toLowerCase();
          return t`${lowerCaseName}: ${t.identifier(param.name)}`;
        })
      )}) => ${typeTemplate(type.returnType, hktsByName, {})}`
    );
  } else {
    // Regular function type without HKT expansion
    return t.span(type.span)(
      t`${typeParametersTemplate(type.typeParameters.flatMap(t => unwrapHkt(t, hktsByName)), {
        parameterVariance: true,
        functionDefaultValue: false,
        constants: false,
      })}(${t.intercolate(`, `)(
        ...type.parameters.map((param) => {
          if (param._tag === "PositionalField") {
            return t`arg${String(param.index)}: ${typeTemplate(param.value, hktsByName, context)}`;
          }

          if (param.value) {
            return t`${t.identifier(param.name)}: ${typeTemplate(param.value, hktsByName, context)}`;
          }

          const lowerCaseName = param.name.text.toLowerCase();
          return t`${lowerCaseName}: ${t.identifier(param.name)}`;
        })
      )}) => ${typeTemplate(type.returnType, hktsByName, context)}`
    );
  }
}

// Helper function to check if a type contains HKT types
function containsHktType(type: Type, hktsByName: HktsByName): boolean {
  if (type._tag === "TypeReference" && type.name._tag === "Identifier" && hktsByName.has(type.name.text)) {
    return true;
  }

  // Check recursively in type arguments, function parameters, etc.
  switch (type._tag) {
    case "ArrayType":
      return containsHktType(type.element, hktsByName);
    case "MapType":
      return containsHktType(type.key, hktsByName) || containsHktType(type.value, hktsByName);
    case "SetType":
      return containsHktType(type.value, hktsByName);
    case "TypeReference":
      return type.typeArguments.some(arg => containsHktType(arg, hktsByName));
    case "FunctionType":
      return type.parameters.some(param => param.value && containsHktType(param.value, hktsByName)) ||
        containsHktType(type.returnType, hktsByName);
    case "TupleType":
      return type.members.some(member => containsHktType(member, hktsByName));
    case "RestType":
      return containsHktType(type.element, hktsByName);
    default:
      return false;
  }
}

function higherKindedTypeTemplate(type: HigherKindedType, hktsByName?: HktsByName): Interpolation {
  return t.many(...unwrapHkt(type, hktsByName).map(t => typeParameterTemplate(t, {
    parameterVariance: false,
    functionDefaultValue: false,
    constants: false,
  })))
}

function recordTypeTemplate(type: RecordType, hktsByName?: HktsByName, context?: TypeTemplateContext): Interpolation {
  return t.span(type.span)(
    t`{${t.intercolate(', ')(...type.fields.map(field =>
      t`${t.identifier(field.name)}: ${field.value ? typeTemplate(field.value, hktsByName, context) : t.identifier(field.name)}`
    ))}}`
  );
}

function restTypeTemplate(type: RestType, hktsByName?: HktsByName, context?: TypeTemplateContext): Interpolation {
  return t.span(type.span)(t`...${typeTemplate(type.element, hktsByName, context)}`);
}

function tupleTypeTemplate(type: TupleType, hktsByName?: HktsByName, context?: TypeTemplateContext): Interpolation {
  return t.span(type.span)(t`[${t.intercolate(', ')(...type.members.map(type => typeTemplate(type, hktsByName, context)))}]`);
}

export function typeArgumentsTemplate(
  typeArguments: ReadonlyArray<Type>,
  hktsByName?: HktsByName,
  context?: TypeTemplateContext
): Interpolation {
  if (typeArguments.length === 0) {
    return "";
  }
  return t`<${t.intercolate(', ')(...typeArguments.map((type) => typeTemplate(type, hktsByName, context)))}>`;
}
