import { z } from "zod"
import { createRouter } from "~/lib/trpc.server"
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

export const siteRouter = createRouter()
  .query("site", {
    meta: {
      openapi: {
        enabled: true,
        method: "GET",
        path: "/site/{site}",
        description: `Get a single site`,
      },
    },
    input: z.object({
      site: z.string({
        description: `Subdomain or UUID`,
      }),
    }),
    output: z.object({
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
    async resolve({ input }) {
      const site = await getSite(input.site)
      return site
    },
  })
  .query("my-subscription", {
    meta: {
      openapi: {
        enabled: true,
        path: `/site/{site}/my-subscription`,
        method: "GET",
        description: `Get the subscription for current viewer`,
      },
    },
    input: z.object({
      site: z.string({
        description: `Site UUID or subdomain`,
      }),
    }),
    output: z
      .object({
        email: z.boolean().optional(),
      })
      .nullable(),
    async resolve({ input, ctx }) {
      const user = ctx.gate.getUser()
      if (!user) return null
      const site = await getSite(input.site)
      const subscription = await getSubscription({
        siteId: site.id,
        userId: user.id,
      })
      return subscription ? subscription.config : null
    },
  })
  .query("pages", {
    meta: {
      openapi: {
        enabled: true,
        path: `/site/{site}/pages`,
        method: "GET",
        description: `Get pages for a site`,
      },
    },
    input: z.object({
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
    output: z.object({
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
    async resolve({ input, ctx }) {
      const result = await getPagesBySite(ctx.gate, input)
      return result
    },
  })
  .query("page", {
    meta: {
      openapi: {
        enabled: true,
        path: `/site/{site}/page/{page}`,
        method: "GET",
        description: `Get a single page from a site`,
      },
    },
    input: z.object({
      site: z.string(),
      page: z.string(),
      render: preprocess(z.boolean()),
      includeAuthors: preprocess(z.boolean()).optional(),
    }),
    output: z.object({
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
    async resolve({ input, ctx }) {
      const page = await getPage(ctx.gate, input)
      return page
    },
  })
  .mutation("update", {
    meta: {
      openapi: {
        enabled: true,
        path: `/site/{site}`,
        method: "PATCH",
        description: `Update a site`,
      },
    },
    input: z.object({
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
    output: z.object({
      site: z.object({
        id: z.string(),
        name: z.string(),
        subdomain: z.string(),
      }),
      subdomainUpdated: z.boolean(),
    }),
    async resolve({ ctx, input }) {
      const { site, subdomainUpdated } = await updateSite(ctx.gate, input)
      return {
        site,
        subdomainUpdated,
      }
    },
  })
  .mutation("create", {
    meta: {
      openapi: {
        enabled: true,
        path: `/site`,
        method: "POST",
        description: `Create a site`,
      },
    },
    input: z.object({
      name: z.string(),
      subdomain: z.string().min(3).max(26),
    }),
    output: z.object({
      id: z.string(),
      subdomain: z.string(),
    }),
    async resolve({ input, ctx }) {
      const { site } = await createSite(ctx.gate, input)
      return site
    },
  })
  .mutation("subscribe", {
    meta: {
      openapi: {
        enabled: true,
        path: `/site/{siteId}/subscribe`,
        method: "POST",
        description: `Subscribe to a site`,
      },
    },
    input: z.object({
      email: z.boolean().optional(),
      siteId: z.string(),
      newUser: z
        .object({
          email: z.string(),
          url: z.string(),
        })
        .optional(),
    }),
    output: z.void(),
    async resolve({ input, ctx }) {
      await subscribeToSite(ctx.gate, input)
    },
  })
  .mutation("unsubscribe", {
    meta: {
      openapi: {
        enabled: true,
        path: `/site/{siteId}/unsubscribe`,
        method: "POST",
        description: `Unsubscribe to a site`,
      },
    },
    input: z.object({
      siteId: z.string(),
    }),
    output: z.void(),
    async resolve({ input, ctx }) {
      await unsubscribeFromSite(ctx.gate, input)
    },
  })
  .mutation("scheduleEmailForPost", {
    input: z.object({
      pageId: z.string(),
      emailSubject: z.string().optional(),
    }),
    async resolve({ ctx, input }) {
      await scheduleEmailForPost(ctx.gate, {
        pageId: input.pageId,
        emailSubject: input.emailSubject,
      })
    },
  })
