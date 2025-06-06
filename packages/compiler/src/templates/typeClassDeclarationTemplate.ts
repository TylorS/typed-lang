import {
	type HigherKindedType,
	type TypeClassDeclaration,
	AccumulatingVisitor,
} from "@typed-lang/parser";
import { Params } from "@typed-lang/typedlib/HKT";
import { Array } from "hkt-ts";
import { type Interpolation, t } from "../Template.js";
import { typeParametersTemplate, typeParameterTemplate } from "./typeParametersTemplate.js";
import { typeTemplate, type TypeTemplateContext } from "./typeTemplate.js";
import { unwrapHkt } from "./unwrapHKT.js";

const PARAMS_RTL = [
	Params.A,
	Params.E,
	Params.R,
	Params.S,
	Params.U,
	Params.V,
	Params.W,
	Params.X,
	Params.Y,
	Params.Z,
]

export function typeClassDeclarationTemplate(
	decl: TypeClassDeclaration,
	hktsByName?: HktsByName
): Interpolation {
	// Find all HigherKindedType parameters (e.g., F<_>, G<_>)
	const hktParams = decl.typeParameters.filter(
		(p): p is HigherKindedType => p._tag === "HigherKindedType",
	);

	// Simple case, no higher-kinded type parameters
	if (hktParams.length === 0) {
		return t.span(decl.span)(
			decl.exported ? t`${t.span(decl.exported)("export")} ` : "",
			t`interface `,
			t.identifier(decl.name),
			typeParametersTemplate(decl.typeParameters.flatMap(t => unwrapHkt(t, hktsByName)), {
				parameterVariance: true,
				functionDefaultValue: false,
				constants: false,
			}),
			t` {`,
			t.newLine(),
			t.indent(
				t.intercolate(",\n")(
					...decl.fields.map(({ name, value }) =>
						value
							? t`${t.identifier(name)}: ${typeTemplate(value)}`
							: t.identifier(name),
					),
				),
			),
			t.newLine(),
			t`}`,
		);
	}

	const providedParams = findProvidedParams(hktParams, decl);
	const possibleParams = hktParams.map((hkt, i) => {
		const provided = providedParams[i];
		// Remove the provided params from the possible params
		const possibleParams = PARAMS_RTL

		const allPossibilities: string[][] = []

		for (let i = provided.length - 1; i < possibleParams.length; i++) {
			allPossibilities.push(possibleParams.slice(i).map((p) => hktParams.length > 1 ? `${hkt.name}${p}` : p))
		}

		return allPossibilities;
	});

	const combinations = Array.tuple(...possibleParams)

	const interpolations: Interpolation[] = []

	for (let i = combinations.length - 1; i > -1; i--) {
		const combo = combinations[i]
		const parametersByHkt = new Map(hktParams.map((hkt, i) => [hkt.name.text, ({ hkt, params: combo[i] } as const)]))
		interpolations.push(typeClassDeclarationWithParams(decl, parametersByHkt))
	}

	return t.span(decl.span)(
		t.intercolate("\n")(
			...interpolations.reverse()
		)
	)
}

type HktsByName = Map<string, { hkt: HigherKindedType, params: string[] }>

function typeClassDeclarationWithParams(decl: TypeClassDeclaration, hktsByName: HktsByName) {
	const hkts = globalThis.Array.from(hktsByName.values())
	const nameSuffix = t.intercolate('_')(
		hkts.map(({ hkt, params }) => t`${hkts.length <=1 ? '' : hkt.name.text}${params.length <= 1 ? "" : String(params.length)}`)
	)
	
	return t.span(decl.span)(
		decl.exported ? t`${t.span(decl.exported)("export")} ` : "",
		t`interface `,
		t.identifier(decl.name),
		nameSuffix,
		decl.typeParameters.length === 0 ? '' : t.many('<', t.intercolate(', ')(...decl.typeParameters.map((param) => {
			if (param._tag === "TypeParameter") {
				return typeParameterTemplate(param, {
					parameterVariance: true,
					constants: false,
					functionDefaultValue: false,
				})
			} else {
				const hkt = hktsByName.get(param.name.text)!
				const length = hkt.params.length
				const name = `HKT${length <= 1 ? "" : String(length)}`
				const HKT = t.import('@typed-lang/typedlib', name)

				return t.span(param.span)(
					HKT.asNamedImport(),
					t`${t.identifier(param.name)} extends ${HKT}`
				)
			}
		})), '>'),
		t.span(decl.openBrace)(t` {`),
		t.newLine(),
		t.indent(
			t.intercolate(",\n")(
				...decl.fields.map(({ name, value }) => {
					if (!value) return t.identifier(name)

					// Pass context to indicate this is a typeclass method
					const context: TypeTemplateContext = { inTypeclassProperty: true };
					return t.many(
						t.identifier(name),
						t`: ${typeTemplate(value, hktsByName, context)}`
					)
				})
			)
		),
		t.newLine(),
		t.span(decl.closeBrace)(t`}`)
	)
}

class HktVisitor extends AccumulatingVisitor<{
	hkt: HigherKindedType;
}> {
	private hktNames: Set<string>;

	constructor(hkts: HigherKindedType[]) {
		super();
		this.hktNames = new Set(hkts.map((hkt) => hkt.name.text));
	}

	visitHigherKindedType(hkt: HigherKindedType) {
		if (this.hktNames.has(hkt.name.text)) {
			this.accumulate({ hkt });
		}
		super.visitHigherKindedType(hkt);
	}
}

function findProvidedParams(hkts: HigherKindedType[], decl: TypeClassDeclaration): string[][] {
	const visitor = new HktVisitor(hkts);

	visitor.visitTypeClassDeclaration(decl)

	return visitor.getResults().map(({ hkt }) => PARAMS_RTL.slice(0, hkt.parameters.length));
}
