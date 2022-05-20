import { EditorSelection } from "@codemirror/state"
import { ICommand } from "."

export const Heading: ICommand = {
  name: "heading",
  icon: (
    <svg width="24" height="24" viewBox="0 0 48 48">
      <path
        d="M6 8V40"
        strokeWidth="4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M25 8V40"
        strokeWidth="4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M6 24H25"
        strokeWidth="4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M34.2261 24L39.0001 19.0166V40"
        strokeWidth="4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  ),
  execute: (view) => {
    view.dispatch(
      view.state.changeByRange((range) => ({
        changes: [{ from: range.from, insert: "# " }],
        range: EditorSelection.range(range.from, range.to + 2),
      }))
    )
  },
}
