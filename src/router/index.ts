import { t } from "~/lib/trpc.server"
import { authRouter } from "./auth"
import { membershipRouter } from "./membership"
import { pageRouter } from "./page"
import { siteRouter } from "./site"
import { userRouter } from "./user"

export const appRouter = t.router({
  auth: authRouter,
  site: siteRouter,
  user: userRouter,
  membership: membershipRouter,
  page: pageRouter,
})

// export type definition of API
export type AppRouter = typeof appRouter
