import { NextRequest, NextResponse } from "next/server"
import { IS_PROD } from "~/lib/constants"
import { S3_BUCKET_NAME, S3_ENDPOINT } from "~/lib/env.server"
import { getTenant } from "~/lib/tenant.server"

export default function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl

  if (!IS_PROD && pathname.startsWith("/dev-s3-proxy")) {
    const filename = req.nextUrl.searchParams.get("filename")
    console.log(`https://${S3_BUCKET_NAME}.${S3_ENDPOINT}/${filename}`)
    return NextResponse.rewrite(
      `https://${S3_BUCKET_NAME}.${S3_ENDPOINT}/${filename}`
    )
  }

  const tenant = getTenant(req, req.nextUrl.searchParams)

  const COUNTRY_TO_FORWARD_TO_HK = ["HK", "CN", "JP", "SG", "KR"]

  console.log("visit from ", req.geo)

  if (
    process.env.IS_PRIMARY_REGION &&
    req.geo?.country &&
    ["GET", "OPTIONS", "HEAD"].includes(req.method) &&
    COUNTRY_TO_FORWARD_TO_HK.includes(req.geo.country)
  ) {
    const url = req.nextUrl.clone()
    url.hostname = "proselog-hk.vercel.app"
    if (tenant) {
      url.searchParams.set("tenant", tenant)
    }
    console.log("forward to hk", url.href)
    return NextResponse.rewrite(url)
  }

  if (pathname.startsWith("/api/") || pathname.startsWith("/dashboard")) {
    return NextResponse.next()
  }

  if (tenant) {
    const url = req.nextUrl.clone()
    url.pathname = `/_site/${tenant}${url.pathname}`
    return NextResponse.rewrite(url)
  }

  return NextResponse.next()
}
