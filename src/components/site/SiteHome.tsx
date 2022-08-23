import Link from "next/link"
import { formatDate } from "~/lib/date"
import { Paginated, type PostOnSiteHome } from "~/lib/types"
import { EmptyState } from "../ui/EmptyState"

export const SiteHome: React.FC<{
  posts?: Paginated<PostOnSiteHome>
}> = ({ posts }) => {
  if (!posts) return null

  return (
    <div className="">
      {posts.total === 0 && <EmptyState />}
      {posts.total > 0 && (
        <div className="space-y-10">
          {posts.nodes.map((post) => {
            const excerpt = post.excerpt || post.autoExcerpt
            return (
              <Link key={post.id} href={`/${post.slug}`}>
                <a className="block group">
                  <h3 className="text-2xl font-bold hover:text-indigo-500">
                    {post.title}
                  </h3>
                  <div className="text-sm text-zinc-400 mt-1">
                    {formatDate(post.publishedAt)}
                  </div>
                  <div className="mt-3 text-lg text-zinc-500">
                    {excerpt}
                    {excerpt && (
                      <span>
                        ...{" "}
                        <span className="text-indigo-400 hover:text-indigo-500">
                          Read more
                        </span>
                      </span>
                    )}
                  </div>
                </a>
              </Link>
            )
          })}
        </div>
      )}
    </div>
  )
}
