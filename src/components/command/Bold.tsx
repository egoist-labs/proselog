import { EditorSelection } from "@codemirror/state"
import { ICommand } from "."

export const Bold: ICommand = {
  name: "bold",
  icon: (
    <svg
      height="16"
      width="16"
      viewBox="0 0 16 16"
    >
      <path
        fillRule="evenodd"
        d="M4 2a1 1 0 00-1 1v10a1 1 0 001 1h5.5a3.5 3.5 0 001.852-6.47A3.5 3.5 0 008.5 2H4zm4.5 5a1.5 1.5 0 100-3H5v3h3.5zM5 9v3h4.5a1.5 1.5 0 000-3H5z"
      ></path>
    </svg>
  ),
  execute: (view) => {
    view.dispatch(
      view.state.changeByRange((range) => ({
        changes: [
          { from: range.from, insert: "**" },
          { from: range.to, insert: "**" },
        ],
        range: EditorSelection.range(range.from, range.to + 4),
      }))
    )
  },
}
