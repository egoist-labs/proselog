import { GetServerSideProps } from "next"
import { SiteLayout } from "~/components/site/SiteLayout"
import { getAuthUser } from "~/lib/auth.server"
import { trpc } from "~/lib/trpc"
import { createServerSideHelpers } from "@trpc/react-query/server"
import { appRouter } from "~/router"
import { getTRPCContext } from "~/lib/trpc.server"
import { SitePage } from "~/components/site/SitePage"
import { serverSidePropsHandler } from "~/lib/server-side-props"
import { getViewer } from "~/lib/viewer"
import { Viewer } from "~/lib/types"

export const getServerSideProps: GetServerSideProps = serverSidePropsHandler(
  async (ctx) => {
    const user = await getAuthUser(ctx.req)
    const viewer = getViewer(user)
    const domainOrSubdomain = ctx.params!.site as string
    const pageSlug = ctx.params!.page as string

    const ssg = createServerSideHelpers({
      router: appRouter,
      ctx: await getTRPCContext(ctx),
    })

    await Promise.all([
      ssg.site.site.fetch({ site: domainOrSubdomain }),
      ssg.site.page.fetch({
        site: domainOrSubdomain,
        page: pageSlug,
        render: true,
        includeAuthors: true,
      }),
      ssg.site.mySubscription.fetch({ site: domainOrSubdomain }),
    ])

    const trpcState = ssg.dehydrate()

    return {
      props: {
        viewer,
        domainOrSubdomain,
        pageSlug,
        trpcState,
      },
    }
  },
)

function SitePagePage({
  viewer,
  domainOrSubdomain,
  pageSlug,
}: {
  viewer: Viewer | null
  domainOrSubdomain: string
  pageSlug: string
}) {
  const { data: site } = trpc.site.site.useQuery(
    { site: domainOrSubdomain },
    {},
  )
  const { data: subscription } = trpc.site.mySubscription.useQuery({
    site: domainOrSubdomain,
  })
  const { data: page } = trpc.site.page.useQuery({
    site: domainOrSubdomain,
    page: pageSlug,
    render: true,
    includeAuthors: true,
  })

  const ogDescription = page?.excerpt || page?.rendered?.excerpt

  return (
    <SiteLayout
      site={site!}
      title={page!.title}
      viewer={viewer}
      subscription={subscription}
      ogDescription={ogDescription}
    >
      <SitePage page={page!} />
    </SiteLayout>
  )
}

export default SitePagePage
