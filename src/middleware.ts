import { NextRequest, NextResponse } from "next/server"
import { IS_PROD } from "~/lib/constants"
import { DISCORD_LINK } from "~/lib/env"
import {
  AUTH_COOKIE_NAME,
  FLY_REGION,
  IS_PRIMARY_REGION,
  PRIMARY_REGION,
} from "~/lib/env.server"
import { getTenant } from "~/lib/tenant.server"

const METHODS_TO_NOT_REPLAY = ["GET", "HEAD", "OPTIONS"]

const ALWAYS_REPLAY_ROUTES = [
  "/api/login",
  "/api/login-complete",
  "/api/logout",
]

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

  if (
    IS_PROD &&
    !IS_PRIMARY_REGION &&
    (!METHODS_TO_NOT_REPLAY.includes(req.method) ||
      ALWAYS_REPLAY_ROUTES.includes(pathname))
  ) {
    console.log("replayed", {
      PRIMARY_REGION,
      FLY_REGION,
      url: req.url,
    })
    const url = req.nextUrl.clone()
    url.pathname = "/_empty.html"
    return NextResponse.rewrite(url, {
      headers: {
        "fly-replay": `region=${PRIMARY_REGION}`,
      },
    })
  }

  const tenant = getTenant(req, req.nextUrl.searchParams)

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
