// //@ts-ignore
import init, { parse_and_validate_proof, render_proof_as_latex } from "fat";
// // Don't worry if vscode told you can't find my-crate
// // It's because you're using a local crate
// // after yarn dev, wasm-pack plugin will install my-crate for you
import { fatproof } from "./language";
import { essler, frege } from "./rules";

const result_field = document.getElementById("messages")! as HTMLDivElement;

await init();

function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function validate(
  proof: string,
  rules: string,
  result_field: HTMLElement,
) {
  try {
    parse_and_validate_proof(proof, rules);
    result_field.innerText = "Valid!";
    result_field.classList.remove("invalid");
  } catch (err: any) {
    result_field.innerText = err as string;
    result_field.classList.add("invalid");
  }
}
async function render(proof: string) {
  try {
    let latex = render_proof_as_latex(proof);
    console.log(latex);

    let tree_display = document.getElementById("prooftree")!;
    // @ts-ignore
    // let options = MathJax.getMetricsFor(tree_display, true);
    // @ts-ignore
    let result = MathJax.tex2svg(latex);
    tree_display.firstChild?.remove();
    tree_display.appendChild(result);
  } catch (e) {
    // TODO: Fix gross hack, but MathJax has a horrible loading system...
    delay(1000).then(async () => await render(proof));
    console.log(e);
  }
}

import { EditorView, lineNumbers } from "@codemirror/view";
import { EditorState, Facet, Transaction } from "@codemirror/state";
import { tags } from "@lezer/highlight";
import { HighlightStyle, syntaxHighlighting } from "@codemirror/language";
import { basicSetup } from "codemirror";

const myHighlightStyle = HighlightStyle.define([
  { tag: tags.className, color: "#ff0000" },
  { tag: tags.comment, color: "#0f0ff0", fontStyle: "italic" },
  { tag: tags.atom, color: "green" },
  { tag: tags.logicOperator, color: "purple" },
  { tag: tags.variableName, fontStyle: "italic" },
  { tag: tags.paren, color: "purple" },
]);

const fixedHeightEditor = EditorView.theme({
  "&": { height: "75dvh" },
  ".cm-scroller": { overflow: "auto" },
});

let proof_validate = Facet.define<void>();
let proof_render = Facet.define<void>();
let language_data = fatproof();
let state = EditorState.create({
  doc: `An   | (A^B) -> C     |
An   | A              |
AA   | C -> (¬B v C)  | 2
An   | ¬C             | 2
WL.1 | ¬(A^B)         | 1,4
DL.5.b | A -> ¬B      | 5
->B  | ¬B             | 6, 2
vE   | ¬BvC           | 7
->E  | ¬C -> (¬B v C) | 4,8
KD   | ¬B v C         | 3, 9 QED
  `,
  extensions: [
    basicSetup,
    fixedHeightEditor,
    language_data,
    proof_validate.compute(["doc"], async (state) => {
      let selection = document.querySelector(
        "#checking-options input:checked",
      )! as HTMLInputElement;

      let rules = await (await fetch(`/${selection.value}.yaml`)).text();
      await validate(state.doc.toString(), rules, result_field);
    }),
    proof_render.compute(
      ["doc"],
      async (state) => await render(state.doc.toString()),
    ),
    syntaxHighlighting(myHighlightStyle),
  ],
});

const view = new EditorView({
  state: state,
  parent: document.getElementById("proof-editor")!,
});

import { insertTextAtCursor } from "./interface";

for (let Button of document.querySelectorAll("#editor_buttons button")!) {
  let symbol = (Button as HTMLButtonElement).innerText;
  (Button as HTMLButtonElement).onclick = () => {
    insertTextAtCursor(view, symbol);
  };
}

import { fatLang } from "./language";
import { autocompletion, completeFromList } from "@codemirror/autocomplete";
