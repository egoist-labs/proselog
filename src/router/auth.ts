import { z } from "zod"
import { sendLoginEmail } from "~/lib/mailgun.server"
import { t } from "~/lib/trpc.server"
import { getViewer } from "~/lib/viewer"

export const authRouter = t.router({
  viewer: t.procedure
    .output(
      z
        .object({
          id: z.string(),
          email: z.string(),
          name: z.string(),
          username: z.string(),
          avatar: z.string().nullish(),
          bio: z.string().nullish(),
        })
        .nullable(),
    )
    .query(async ({ ctx }) => {
      return getViewer(ctx.user)
    }),

  requestLoginLink: t.procedure
    .input(
      z.object({
        email: z.string().min(1, "email is required"),
        url: z.string(),
      }),
    )
    .mutation(async ({ input }) => {
      await sendLoginEmail({
        url: input.url,
        email: input.email,
      }).catch(console.error)

      return true
    }),
})
