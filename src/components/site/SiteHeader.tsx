import clsx from "clsx"
import Link from "next/link"
import { useRouter } from "next/router"
import { logout } from "~/lib/auth.client"
import { IS_PROD } from "~/lib/constants"
import { OUR_DOMAIN } from "~/lib/env"
import { useStore } from "~/lib/store"
import { Viewer } from "~/lib/types"
import { getUserContentsUrl } from "~/lib/user-contents"
import { truthy } from "~/lib/utils"
import { DashboardIcon } from "../icons/DashboardIcon"
import { Avatar } from "../ui/Avatar"
import { UniLink } from "../ui/UniLink"

type HeaderLinkType =
  | {
      icon?: React.ReactNode
      label: string
      url?: string
      onClick?: () => void
    }
  | "sep"

export const SiteHeader: React.FC<{
  siteName: string | undefined
  description: string | undefined | null
  icon: string | null | undefined
  navigation?: HeaderLinkType[]
  subscribed?: boolean
  viewer: Viewer | null
}> = ({ siteName, description, icon, navigation, subscribed, viewer }) => {
  const setSubscribeModalOpened = useStore(
    (store) => store.setSubscribeModalOpened,
  )
  const setLoginModalOpened = useStore((store) => store.setLoginModalOpened)

  const handleClickSubscribe = () => {
    setSubscribeModalOpened(true)
  }

  const hasNavigation = navigation && navigation.length > 0
  const dropdownLinks: HeaderLinkType[] = [
    ...(navigation || []),
    ...(viewer
      ? [
          hasNavigation && ("sep" as const),
          {
            icon: <DashboardIcon />,
            label: "Writer dashboard",
            url: `${IS_PROD ? "https" : "http"}://${OUR_DOMAIN}/dashboard`,
          },
          {
            label: "Sign out",
            onClick() {
              logout()
            },
          },
        ]
      : [
          hasNavigation && ("sep" as const),
          {
            label: "Sign in",
            onClick() {
              setLoginModalOpened(true)
            },
          },
        ]),
  ].filter(truthy)

  return (
    <header className="border-b">
      <div className="px-5 max-w-screen-md mx-auto">
        <div className={clsx(``, `flex justify-between items-center h-20`)}>
          <div className={clsx(`flex items-center space-x-3`)}>
            {icon && (
              <Avatar
                images={[getUserContentsUrl(icon)]}
                size={36}
                name={siteName}
              />
            )}
            <div>
              <Link href="/" className={clsx(`hover:text-indigo-400 text-xl`, `font-bold`)}>

                {siteName}

              </Link>
            </div>
          </div>
          <div className="text-sm flex items-center space-x-2">
            <button
              type="button"
              onClick={handleClickSubscribe}
              className={clsx(
                `space-x-1 rounded-lg inline-flex items-center px-3 h-9 transition-colors bg-white ring-1`,
                subscribed
                  ? `ring-zinc-200 text-zinc-500 hover:bg-zinc-100`
                  : `ring-zinc-200 text-indigo-400 hover:bg-indigo-50 hover:ring-indigo-200`,
              )}
            >
              <span className="pl-1">
                {subscribed ? (
                  <svg className="w-4 h-4" viewBox="0 0 24 24">
                    <path
                      fill="currentColor"
                      d="m23.5 17l-5 5l-3.5-3.5l1.5-1.5l2 2l3.5-3.5l1.5 1.5M13 18H3V8l8 5l8-5v5h2V6c0-1.1-.9-2-2-2H3c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h10v-2m6-12l-8 5l-8-5h16Z"
                    ></path>
                  </svg>
                ) : (
                  <svg className="w-4 h-4" viewBox="0 0 24 24">
                    <path
                      fill="currentColor"
                      d="M19 15v3h-3v2h3v3h2v-3h3v-2h-3v-3h-2m-5 3H3V8l8 5l8-5v5h2V6c0-1.1-.9-2-2-2H3c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h11v-2m5-12l-8 5l-8-5h16Z"
                    ></path>
                  </svg>
                )}
              </span>
              <span className="pr-1">
                {subscribed ? "Subscribed" : "Subscribe"}
              </span>
            </button>
            <div className="relative group">
              <button
                type="button"
                className={clsx(
                  `space-x-1 rounded-lg inline-flex items-center px-3 h-9 transition-colors bg-white ring-1 ring-zinc-200 text-zinc-500`,
                )}
              >
                <span
                  className="i-mdi:dots-horizontal text-xl"
                  aria-label="More"
                ></span>
              </button>
              <div className="absolute hidden right-0 pt-2 z-20 group-hover:block">
                <div className="bg-white rounded-lg ring-1 ring-zinc-200 min-w-[140px] shadow-lg">
                  {viewer && (
                    <div className="text-xs text-zinc-400 p-4 border-b">
                      Logged in as {viewer.email}
                    </div>
                  )}
                  <div className="py-2">
                    {dropdownLinks.map((link, i) => {
                      if (link === "sep") {
                        return (
                          <div
                            key={i}
                            className="h-[1px] bg-zinc-100 my-2"
                          ></div>
                        )
                      }
                      return (
                        <UniLink
                          key={i}
                          href={link.url}
                          onClick={link.onClick}
                          className="px-4 h-8 flex items-center w-full whitespace-nowrap hover:bg-zinc-100"
                        >
                          {link.label}
                        </UniLink>
                      )
                    })}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
