import * as trpc from "@trpc/server"
import { OpenApiMeta } from "trpc-openapi"
import { z, ZodError } from "zod"
import { isNotFoundError } from "~/lib/server-side-props"
import { TRPCContext } from "~/lib/trpc.server"
import { getSite } from "~/models/site.model"
import { authRouter } from "./auth"
import { membershipRouter } from "./membership"
import { pageRouter } from "./page"
import { siteRouter } from "./site"
import { userRouter } from "./user"

export const appRouter = trpc
  .router<TRPCContext, OpenApiMeta>()
  .merge("auth.", authRouter)
  .merge("site.", siteRouter)
  .merge("user.", userRouter)
  .merge("membership.", membershipRouter)
  .merge("page.", pageRouter)
  .formatError(({ error, shape }) => {
    const isZodError = error.cause instanceof ZodError
    return {
      ...shape,
      message: isZodError
        ? error.cause.issues.map((i) => i.message).join(", ")
        : error.message,
      data: {
        ...shape.data,
        notFound: isNotFoundError(error.cause),
      },
    }
  })

// export type definition of API
export type AppRouter = typeof appRouter
