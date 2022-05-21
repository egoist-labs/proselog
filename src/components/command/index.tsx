import { EditorView } from "@codemirror/view"
import { Bold } from "./Bold"
import { Code } from "./Code"
import { Heading } from "./Heading"
import { Italic } from "./Italic"
import { Link } from "./Link"
import { ListOrdered } from "./ListOrdered"
import { ListUnordered } from "./ListUnordered"
import { Quote } from "./Quote"

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

export const toolbars: ICommand[] = [
  Heading,
  Bold,
  Italic,
  Quote,
  Code,
  Link,
  ListUnordered,
  ListOrdered,
]
