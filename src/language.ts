// //@ts-ignore
import { parser } from "./proof-grammar/fatproof.grammar";
import { LanguageSupport } from "@codemirror/language";
import { closeBrackets, completeFromList } from "@codemirror/autocomplete";
import { styleTags, tags as t } from "@lezer/highlight";
import { LRLanguage } from "@codemirror/language";

let parserWithMetadata = parser.configure({
  props: [
    styleTags({
      Atom: t.atom,
      Bin_op: t.logicOperator,
      Negation: t.logicOperator,
      Comment: t.lineComment,
      Rulename: t.className,
      Var: t.variableName,
    }),
  ],
});

console.log(parser);

export const fatLang = LRLanguage.define({
  parser: parserWithMetadata,
  languageData: {
    commentTokens: { line: "#" },
    closeBrackets: "(",
  },
});

export const exampleCompletion = fatLang.data.of({
  autocomplete: completeFromList([
    { label: "QED", type: "keyword" },
    { label: "Ax", type: "namespace", detail: "Axiom", apply: "Ax | " },
    {
      label: "An",
      type: "namespace",
      detail: "Annahmeneinführung",
      apply: "An | ",
    },
    {
      label: "Ass",
      type: "namespace",
      detail: "Assumption introduction",
      apply: "An | ",
    },
    { label: "->", type: "constant", detail: "Material Implication" },
    { label: "<->", type: "constant", detail: "Equivalence" },
    { label: ">-<", type: "constant", detail: "Contravalence" },
    { label: "¬", type: "constant", detail: "Negation" },
    { label: "∨", type: "constant", detail: "Disjunction" },
    {
      label: "\\vee",
      type: "constant",
      detail: "Disjunction",
      displayLabel: "∨",
      apply: "v",
    },
    {
      label: "or",
      type: "constant",
      detail: "Disjunction",
      displayLabel: "∨",
      apply: "v",
    },
    {
      label: "\\wedge",
      type: "constant",
      detail: "Conjunction",
      displayLabel: "∧",
      apply: "∧",
    },
    {
      label: "and",
      type: "constant",
      detail: "Conjunction",
      displayLabel: "∧",
      apply: "∧",
    },
    { label: "^", type: "constant", detail: "Conjunction" },
    {
      label: "\\top",
      type: "constant",
      detail: "Verum / Top",
      displayLabel: "⊤",
      apply: "⊤",
      boost: -2,
    },
    {
      label: "\\bot",
      type: "constant",
      detail: "Falsum / Bottom",
      displayLabel: "⊥",
      apply: "⊥",
      boost: -2,
    },
  ]),
});

export function fatproof() {
  return new LanguageSupport(fatLang, [exampleCompletion]);
}
