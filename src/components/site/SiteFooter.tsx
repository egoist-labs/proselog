import { APP_NAME, OUR_DOMAIN } from "~/lib/env"
import { UniLink } from "../ui/UniLink"

export const SiteFooter: React.FC<{ site: { name: string } }> = ({ site }) => {
  return (
    <footer className="text-zinc-400 border-t">
      <div className="max-w-screen-md mx-auto px-5 py-16">
        <span className="">
          &copy;{" "}
          <UniLink href="/" className="hover:text-indigo-500">
            {site.name}
          </UniLink>{" "}
          <span className="mx-2">·</span> Published on{" "}
          <UniLink
            href={`https://${OUR_DOMAIN}`}
            className="hover:text-indigo-500"
          >
            {APP_NAME}
          </UniLink>
        </span>
      </div>
    </footer>
  )
}
