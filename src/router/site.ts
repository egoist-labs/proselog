import { z } from "zod"
import { t } from "~/lib/trpc.server"
import { PageVisibilityEnum } from "~/lib/types"
import {
  getSite,
  getSubscription,
  updateSite,
  createSite,
  subscribeToSite,
  unsubscribeFromSite,
} from "~/models/site.model"
import {
  getPage,
  getPagesBySite,
  scheduleEmailForPost,
} from "~/models/page.model"
import { preprocess } from "~/lib/preprocess"

export const siteRouter = t.router({
  site: t.procedure
    .meta({
      openapi: {
        enabled: true,
        method: "GET",
        path: "/site/{site}",
        summary: `Get a single site`,
      },
    })
    .input(
      z.object({
        site: z.string({
          description: `Subdomain or UUID`,
        }),
      }),
    )
    .output(
      z.object({
        id: z.string(),
        name: z.string(),
        description: z.string().nullable(),
        icon: z.string().nullable(),
        subdomain: z.string(),
        navigation: z
          .array(
            z.object({
              id: z.string(),
              label: z.string(),
              url: z.string(),
            }),
          )
          .nullable(),
      }),
    )
    .query(async ({ input }) => {
      const site = await getSite(input.site)
      return site
    }),

  mySubscription: t.procedure
    .meta({
      openapi: {
        enabled: true,
        path: `/site/{site}/my-subscription`,
        method: "GET",
        summary: `Get the subscription for current viewer`,
      },
    })
    .input(
      z.object({
        site: z.string({
          description: `Site UUID or subdomain`,
        }),
      }),
    )
    .output(
      z
        .object({
          email: z.boolean().optional(),
        })
        .nullable(),
    )
    .query(async ({ ctx, input }) => {
      const user = ctx.gate.getUser()
      if (!user) return null
      const site = await getSite(input.site)
      const subscription = await getSubscription({
        siteId: site.id,
        userId: user.id,
      })
      return subscription ? subscription.config : null
    }),

  pages: t.procedure
    .meta({
      openapi: {
        enabled: true,
        path: `/site/{site}/pages`,
        method: "GET",
        summary: `Get pages for a site`,
      },
    })
    .input(
      z.object({
        site: z.string(),
        type: z.enum(["post", "page"]).default("post"),
        visibility: z
          .enum([
            PageVisibilityEnum.All,
            PageVisibilityEnum.Draft,
            PageVisibilityEnum.Published,
            PageVisibilityEnum.Scheduled,
          ])
          .optional(),
        take: preprocess(z.number().int()).optional(),
        cursor: z.string().optional(),
        includeContent: preprocess(z.boolean()).optional(),
        includeExcerpt: preprocess(z.boolean()).optional(),
      }),
    )
    .output(
      z.object({
        nodes: z.array(
          z.object({
            id: z.string(),
            title: z.string(),
            contentHTML: z.string().optional(),
            publishedAt: z.date().transform((v) => v.toISOString()),
            published: z.boolean(),
            slug: z.string(),
            excerpt: z.string().nullable(),
            autoExcerpt: z.string().optional(),
          }),
        ),
        total: z.number(),
        hasMore: z.boolean(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const result = await getPagesBySite(ctx.gate, input)
      return result
    }),

  page: t.procedure
    .meta({
      openapi: {
        enabled: true,
        path: `/site/{site}/page/{page}`,
        method: "GET",
        summary: `Get a single page from a site`,
      },
    })
    .input(
      z.object({
        site: z.string(),
        page: z.string(),
        render: preprocess(z.boolean()),
        includeAuthors: preprocess(z.boolean()).optional(),
      }),
    )
    .output(
      z.object({
        id: z.string(),
        title: z.string(),
        content: z.string(),
        excerpt: z.string().nullable(),
        published: z.boolean(),
        publishedAt: z.date().transform((v) => v.toISOString()),
        slug: z.string(),
        type: z.enum(["PAGE", "POST"]),
        rendered: z
          .object({
            excerpt: z.string(),
            contentHTML: z.string(),
          })
          .nullable(),
        authors: z
          .array(
            z.object({
              id: z.string(),
              name: z.string(),
              avatar: z.string().nullable(),
            }),
          )
          .optional(),
        emailSubject: z.string().nullish(),
        emailStatus: z.string().nullish(),
        siteId: z.string(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const page = await getPage(ctx.gate, input)
      return page
    }),

  update: t.procedure
    .meta({
      openapi: {
        enabled: true,
        path: `/site/{site}`,
        method: "PATCH",
        summary: `Update a site`,
        protect: true,
      },
    })
    .input(
      z.object({
        site: z.string(),
        name: z.string().optional(),
        description: z.string().optional(),
        icon: z.string().nullish(),
        subdomain: z.string().optional(),
        navigation: z
          .array(
            z.object({
              id: z.string(),
              label: z.string(),
              url: z
                .string()
                .regex(
                  /^(https?:\/\/|\/)/,
                  "URL must start with / or http:// or https://",
                ),
            }),
          )
          .optional(),
      }),
    )
    .output(
      z.object({
        site: z.object({
          id: z.string(),
          name: z.string(),
          subdomain: z.string(),
        }),
        subdomainUpdated: z.boolean(),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      const { site, subdomainUpdated } = await updateSite(ctx.gate, input)
      return {
        site,
        subdomainUpdated,
      }
    }),

  create: t.procedure
    .meta({
      openapi: {
        enabled: true,
        path: `/site`,
        method: "POST",
        summary: `Create a site`,
        protect: true,
      },
    })
    .input(
      z.object({
        name: z.string(),
        subdomain: z.string().min(3).max(26),
      }),
    )
    .output(
      z.object({
        id: z.string(),
        subdomain: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { site } = await createSite(ctx.gate, input)
      return site
    }),

  subscribe: t.procedure
    .meta({
      openapi: {
        enabled: true,
        path: `/site/{siteId}/subscribe`,
        method: "POST",
        summary: `Subscribe to a site`,
      },
    })
    .input(
      z.object({
        email: z.boolean().optional(),
        siteId: z.string(),
        newUser: z
          .object({
            email: z.string(),
            url: z.string(),
          })
          .optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      await subscribeToSite(ctx.gate, input)
    }),

  unsubscribe: t.procedure
    .meta({
      openapi: {
        enabled: true,
        path: `/site/{siteId}/unsubscribe`,
        method: "POST",
        summary: `Unsubscribe to a site`,
        protect: true,
      },
    })
    .input(
      z.object({
        siteId: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      await unsubscribeFromSite(ctx.gate, input)
    }),

  scheduleEmailForPost: t.procedure
    .input(
      z.object({
        pageId: z.string(),
        emailSubject: z.string().optional(),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      await scheduleEmailForPost(ctx.gate, {
        pageId: input.pageId,
        emailSubject: input.emailSubject,
      })
    }),
})
