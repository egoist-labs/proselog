import { GetServerSideProps } from "next"
import { SiteLayout } from "~/components/site/SiteLayout"
import { getAuthUser } from "~/lib/auth.server"
import { trpc } from "~/lib/trpc"
import { createProxySSGHelpers } from "@trpc/react-query/ssg"
import { appRouter } from "~/router"
import { getTRPCContext } from "~/lib/trpc.server"
import { serverSidePropsHandler } from "~/lib/server-side-props"
import { SiteArchives } from "~/components/site/SiteArchives"
import { getViewer } from "~/lib/viewer"
import { Viewer } from "~/lib/types"

export const getServerSideProps: GetServerSideProps = serverSidePropsHandler(
  async (ctx) => {
    const user = await getAuthUser(ctx.req)
    const viewer = getViewer(user)
    const domainOrSubdomain = ctx.params!.site as string

    const trpcContext = await getTRPCContext(ctx)
    const ssg = createProxySSGHelpers({ router: appRouter, ctx: trpcContext })

    await Promise.all([
      ssg.site.site.fetch({ site: domainOrSubdomain }),
      ssg.site.pages.fetch({ site: domainOrSubdomain, take: 1000 }),
      ssg.site.mySubscription.fetch({ site: domainOrSubdomain }),
    ])

    return {
      props: {
        viewer,
        domainOrSubdomain,
        trpcState: ssg.dehydrate(),
      },
    }
  },
)

function SiteArchivesPage({
  viewer,
  domainOrSubdomain,
}: {
  viewer: Viewer | null
  domainOrSubdomain: string
}) {
  const siteResult = trpc.site.site.useQuery({ site: domainOrSubdomain }, {})
  const subscriptionResult = trpc.site.mySubscription.useQuery({
    site: domainOrSubdomain,
  })
  const postsResult = trpc.site.pages.useQuery({
    site: domainOrSubdomain,
    take: 1000,
  })

  const site = siteResult.data
  const subscription = subscriptionResult.data
  const posts = postsResult.data?.nodes

  return (
    <SiteLayout
      site={site!}
      title="Archives"
      viewer={viewer}
      subscription={subscription}
    >
      <SiteArchives posts={posts} />
    </SiteLayout>
  )
}

export default SiteArchivesPage
