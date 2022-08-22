/**
 * @see https://github.com/jlalmes/trpc-openapi/issues/44
 */

import { z } from "zod"

const toBoolean = (v: unknown) => {
  return typeof v === "boolean"
    ? v
    : v === "true"
    ? true
    : v === "false"
    ? false
    : Boolean(v)
}

const toNumber = (v: unknown) => {
  return typeof v === "number" ? v : Number(v)
}

export const preprocess = <T extends z.ZodTypeAny>(schema: T) => {
  if (schema instanceof z.ZodBoolean) {
    return z.preprocess(toBoolean, schema)
  }
  if (schema instanceof z.ZodNumber) {
    return z.preprocess(toNumber, schema)
  }
  throw new Error("not implemented")
}
