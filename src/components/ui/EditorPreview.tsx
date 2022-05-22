import clsx from "clsx"
import {
  Dispatch,
  forwardRef,
  SetStateAction,
  useCallback,
  useEffect,
  useImperativeHandle,
  useState,
} from "react"
import { renderPageContent } from "~/markdown"

export interface EditorPreviewProps {
  content: string
  className?: string
}

export interface EditorPreviewRef {
  setVisible: Dispatch<SetStateAction<boolean>>
  visible: boolean
}

export const EditorPreview = forwardRef<EditorPreviewRef, EditorPreviewProps>(
  ({ className, content }, ref) => {
    const [html, setHtml] = useState("")
    const [visible, setVisible] = useState(true)
    const renderMarkdown = useCallback(async (doc: string) => {
      const pageContent = await renderPageContent(doc)
      setHtml(pageContent.contentHTML)
    }, [])
    useEffect(() => {
      renderMarkdown(content)
    }, [content, renderMarkdown])
    useImperativeHandle(ref, () => ({ setVisible, visible }), [visible])
    return (
      <div
        className={clsx(
          "prose border-l border-gray-100 overflow-auto",
          className,
          { hidden: !visible },
        )}
        dangerouslySetInnerHTML={{ __html: html ?? "" }}
      ></div>
    )
  },
)

EditorPreview.displayName = "EditorPreview"
