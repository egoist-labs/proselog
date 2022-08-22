import { createOpenApiNextHandler } from "trpc-openapi"
import { getTRPCContext } from "~/lib/trpc.server"
import { appRouter } from "~/router"

export default createOpenApiNextHandler({
  router: appRouter,
  createContext: getTRPCContext,
})
