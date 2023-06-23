import "~/css/main.css"
import "~/generated/uno.css"
import { Toaster } from "react-hot-toast"
import LoginModal from "~/components/common/LoginModal"
import { TooltipProvider } from "~/components/ui/Tooltip"
import { trpc } from "~/lib/trpc"

function MyApp({ Component, pageProps }: any) {
  return (
    <>
      <TooltipProvider delayDuration={0}>
        <Component {...pageProps} />
      </TooltipProvider>
      <LoginModal />
      <Toaster />
    </>
  )
}

// Only uncomment this method if you have blocking data requirements for
// every single page in your application. This disables the ability to
// perform automatic static optimization, causing every page in your app to
// be server-side rendered.
//
// MyApp.getInitialProps = async (appContext) => {
//   // calls page's `getInitialProps` and fills `appProps.pageProps`
//   const appProps = await App.getInitialProps(appContext);
//
//   return { ...appProps }
// }

export default trpc.withTRPC(MyApp)
