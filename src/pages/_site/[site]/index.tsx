import { GetServerSideProps } from "next"
import { SiteHome } from "~/components/site/SiteHome"
import { SiteLayout } from "~/components/site/SiteLayout"
import { getAuthUser } from "~/lib/auth.server"
import { trpc } from "~/lib/trpc"
import { createProxySSGHelpers } from "@trpc/react-query/ssg"
import { appRouter } from "~/router"
import { getTRPCContext } from "~/lib/trpc.server"
import { Viewer } from "~/lib/types"
import { getViewer } from "~/lib/viewer"

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const user = await getAuthUser(ctx.req)
  const domainOrSubdomain = ctx.params!.site as string

  const viewer = getViewer(user)
  const trpcContext = await getTRPCContext(ctx)
  const ssg = createProxySSGHelpers({ router: appRouter, ctx: trpcContext })

  await Promise.all([
    ssg.site.site.fetch({ site: domainOrSubdomain }),
    ssg.site.pages.fetch({
      site: domainOrSubdomain,
      take: 1000,
      includeExcerpt: true,
    }),
    ssg.site.mySubscription.fetch({ site: domainOrSubdomain }),
  ])

  return {
    props: {
      viewer,
      domainOrSubdomain,
      trpcState: ssg.dehydrate(),
    },
  }
}

function SiteIndexPage({
  viewer,
  domainOrSubdomain,
}: {
  viewer: Viewer | null
  domainOrSubdomain: string
}) {
  const { data: site } = trpc.site.site.useQuery(
    { site: domainOrSubdomain },
    {},
  )
  const { data: subscription } = trpc.site.mySubscription.useQuery({
    site: domainOrSubdomain,
  })
  const { data: posts } = trpc.site.pages.useQuery({
    site: domainOrSubdomain,
    take: 1000,
    includeExcerpt: true,
  })

  return (
    <SiteLayout site={site!} viewer={viewer} subscription={subscription}>
      <SiteHome posts={posts} />
    </SiteLayout>
  )
}

export default SiteIndexPage
