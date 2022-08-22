import { NextRequest, NextResponse } from "next/server"
import { DISCORD_LINK } from "~/lib/env"
import { AUTH_COOKIE_NAME } from "~/lib/env.server"
import { getTenant } from "~/lib/tenant.server"

export default function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl

  if (pathname === "/favicon.ico") {
    const url = req.nextUrl.clone()
    url.pathname = "/404"
    return NextResponse.rewrite(url)
  }

  // Redirect unauthenticated users to the home page
  if (pathname === "/dashboard" || pathname.startsWith("/dashboard/")) {
    if (!req.cookies.has(AUTH_COOKIE_NAME)) {
      const url = req.nextUrl.clone()
      url.pathname = "/"
      return NextResponse.redirect(url)
    }
  }

  if (pathname.startsWith("/_next/")) {
    return NextResponse.next()
  }

  console.log(`${req.method} ${req.nextUrl.pathname}${req.nextUrl.search}`)

  const tenant = getTenant(req, req.nextUrl.searchParams)

  console.log("tenant", tenant)
  if (pathname.startsWith("/api/") || pathname.startsWith("/dashboard")) {
    return NextResponse.next()
  }

  if (tenant) {
    const url = req.nextUrl.clone()
    url.pathname = `/_site/${tenant}${url.pathname}`
    return NextResponse.rewrite(url)
  }

  if (DISCORD_LINK && pathname === "/discord") {
    return NextResponse.redirect(DISCORD_LINK)
  }

  return NextResponse.next()
}
