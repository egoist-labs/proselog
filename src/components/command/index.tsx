import { EditorView } from "@codemirror/view"
import { Bold } from "./Bold"
import { Heading } from "./Heading"
import { Italic } from "./Italic"

export type ICommand = {
  icon: React.ReactElement
  name: string
  execute: (
    view: EditorView,
    opts?: {
      preview?: HTMLDivElement | null
      container?: HTMLDivElement | null
    }
  ) => void
}

export const toolbars: ICommand[] = [Bold, Italic, Heading]
