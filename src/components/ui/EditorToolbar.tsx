import { EditorView } from "@codemirror/view"
import { FC } from "react"
import { ICommand } from "../command"

export interface EditorToolbarProps {
  view: EditorView | null
  toolbars: ICommand[]
}

export const EditorToolbar: FC<EditorToolbarProps> = ({ view, toolbars }) => {
  return (
    <div className="px-1 py-1 rounded-md bg-gray-100">
      {toolbars?.map(({ name, icon, execute }) => {
        return (
          <button
            key={name}
            className="px-1 py-1 mr-1 text-gray-700 stroke-gray-600 bg-gray-200 transition-colors rounded hover:bg-gray-300 hover:stroke-gray-900"
            onClick={() => {
              view && execute(view)
            }}
          >
            {icon}
          </button>
        )
      })}
    </div>
  )
}
