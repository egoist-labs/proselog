import { EditorSelection } from "@codemirror/state"
import { ICommand } from "."

export const Italic: ICommand = {
  name: "italic",
  icon: (
    <svg width="24" height="24" viewBox="0 0 48 48">
      <path
        d="M20 6H36"
        strokeWidth="4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M12 42H28"
        strokeWidth="4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M29 5.95239L19 42"
        strokeWidth="4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
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
