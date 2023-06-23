import { useForm } from "react-hook-form"
import toast from "react-hot-toast"
import { trpc } from "~/lib/trpc"
import { Button } from "../ui/Button"
import { Input } from "../ui/Input"
import { Modal } from "../ui/Modal"
import { useEmailPostModalOpened } from "~/lib/store"

export const EmailPostModal: React.FC<{
  pageId: string
}> = ({ pageId }) => {
  const [emailPostModalOpened, setEmailPostModalOpened] =
    useEmailPostModalOpened()

  const { handleSubmit, register } = useForm({
    defaultValues: {
      subject: "",
    },
  })
  const scheduleEmailForPost = trpc.site.scheduleEmailForPost.useMutation()

  const onSubmit = handleSubmit(async (values) => {
    await scheduleEmailForPost.mutateAsync({
      pageId,
      emailSubject: values.subject,
    })
    toast.success("Scheduled!")
    setEmailPostModalOpened(false)
  })

  return (
    <Modal
      title="Email Post"
      open={emailPostModalOpened}
      setOpen={setEmailPostModalOpened}
    >
      {
        <form onSubmit={onSubmit}>
          <div className="p-5">
            <Input
              label="Email subject"
              id="subject"
              help="Defaults to post title"
              isBlock
              {...register("subject")}
            />
          </div>
          <div className="p-5 border-t">
            <Button type="submit" isLoading={scheduleEmailForPost.isLoading}>
              <span className="i-mdi:email-send text-xl mr-1"></span>
              <span>Send Email</span>
            </Button>
          </div>
        </form>
      }
    </Modal>
  )
}
