import { initTRPC } from "@trpc/server"
import { IncomingMessage } from "http"
import { ZodError } from "zod"
import { OpenApiMeta } from "trpc-openapi"
import { AuthUser, getAuthUser } from "./auth.server"
import { createGate, Gate } from "./gate.server"
import { isNotFoundError } from "./server-side-props"

export type TRPCContext = { user: AuthUser | null | undefined; gate: Gate }

export const getTRPCContext = async ({
  req,
}: {
  req: IncomingMessage
}): Promise<TRPCContext> => {
  const user = await getAuthUser(req)
  const gate = createGate({ user })
  return {
    user,
    gate,
  }
}

export const t = initTRPC
  .meta<OpenApiMeta>()
  .context<TRPCContext>()
  .create({
    errorFormatter({ error, shape }) {
      const isZodError = error.cause instanceof ZodError

      return {
        ...shape,
        message: isZodError
          ? error.cause.issues
              .map((i) => `${i.path.join(".")}: ${i.message}`)
              .join(", ")
          : error.message,
        data: {
          ...shape.data,
          notFound: isNotFoundError(error.cause),
        },
      }
    },
  })
