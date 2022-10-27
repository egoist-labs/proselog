import { z } from "zod"
import { t } from "~/lib/trpc.server"
import { createOrUpdatePage, deletePage } from "~/models/page.model"

export const pageRouter = t.router({
  createOrUpdate: t.procedure
    .input(
      z.object({
        siteId: z.string(),
        pageId: z.string().optional(),
        title: z.string().optional(),
        content: z.string().optional(),
        published: z.boolean().optional(),
        publishedAt: z.string().optional(),
        excerpt: z.string().optional(),
        isPost: z.boolean().optional(),
        slug: z.string().optional(),
        emailSubject: z.string().optional(),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      const { page } = await createOrUpdatePage(ctx.gate, input)
      return page
    }),

  delete: t.procedure
    .input(
      z.object({
        pageId: z.string(),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      await deletePage(ctx.gate, { id: input.pageId })
    }),
})
