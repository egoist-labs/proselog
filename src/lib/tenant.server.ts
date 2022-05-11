import { OUR_DOMAIN } from "./env"

export const getTenant = (request: Request, searchParams: URLSearchParams) => {
  const host = request.headers.get("host")

  const tenant = searchParams.get("tenant")
  if (tenant) {
    return tenant
  }

  if (!OUR_DOMAIN) {
    throw new Error("missing OUR_DOMAIN env")
  }

  const OUR_DOMAIN_SUFFIX = `.${OUR_DOMAIN}`
  if (host) {
    if (host.endsWith(OUR_DOMAIN_SUFFIX)) {
      const subdomain = host.replace(OUR_DOMAIN_SUFFIX, "")
      return subdomain
    }
    if (host !== OUR_DOMAIN) {
      return host
    }
  }
  return
}
