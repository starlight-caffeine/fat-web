import { EditorView } from "codemirror";

export function insertTextAtCursor(view: EditorView, text: string) {
  const cursor = view.state.selection.main.head;
  const transaction = view.state.update({
    changes: {
      from: cursor,
      insert: text,
    },
    // the next 2 lines will set the appropriate cursor position after inserting the new text.
    selection: { anchor: cursor + 1 },
    scrollIntoView: true,
  });

  if (transaction) {
    view.dispatch(transaction);
  }
}
