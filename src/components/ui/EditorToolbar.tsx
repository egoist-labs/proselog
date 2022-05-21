import { EditorView } from "@codemirror/view"
import { FC } from "react"
import { ICommand } from "../command"

export interface EditorToolbarProps {
  view: EditorView | null
  toolbars: ICommand[]
}

export const EditorToolbar: FC<EditorToolbarProps> = ({ view, toolbars }) => {
  return (
    <div className="px-1 py-1 rounded bg-gray-100 border border-gray-600">
      {toolbars?.map(({ name, icon, execute }) => {
        return (
          <button
            key={name}
            className="px-1 py-1 mr-1 fill-gray-600 transition-colors hover:fill-blue-500"
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
