import { EditorSelection } from "@codemirror/state"
import { ICommand } from "."

export const Link: ICommand = {
  name: "link",
  icon: (
    <svg height="16" viewBox="0 0 16 16" width="16">
      <path d="M7.775 3.275a.75.75 0 001.06 1.06l1.25-1.25a2 2 0 112.83 2.83l-2.5 2.5a2 2 0 01-2.83 0 .75.75 0 00-1.06 1.06 3.5 3.5 0 004.95 0l2.5-2.5a3.5 3.5 0 00-4.95-4.95l-1.25 1.25zm-4.69 9.64a2 2 0 010-2.83l2.5-2.5a2 2 0 012.83 0 .75.75 0 001.06-1.06 3.5 3.5 0 00-4.95 0l-2.5 2.5a3.5 3.5 0 004.95 4.95l1.25-1.25a.75.75 0 00-1.06-1.06l-1.25 1.25a2 2 0 01-2.83 0z"></path>
    </svg>
  ),
  execute: (view) => {
    view.dispatch(
      view.state.changeByRange((range) => ({
        changes: [
          { from: range.from, insert: "*" },
          { from: range.to, insert: "*" },
        ],
        range: EditorSelection.range(range.from, range.to + 2),
      }))
    )
  },
}
