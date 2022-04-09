import { GetServerSidePropsContext, GetServerSideProps } from "next"

class Redirect {
  constructor(public url: string) {}
}

class NotFound {}

export const redirect = (url: string) => new Redirect(url)

export const notFound = () => new NotFound()

export const serverSidePropsHandler = <TProps extends object>(
  fn: (
    ctx: GetServerSidePropsContext,
  ) => Promise<{ props: TProps } | Redirect | NotFound>,
): GetServerSideProps => {
  return async (ctx) => {
    try {
      const result = await fn(ctx)
      if (result instanceof Redirect) {
        return {
          redirect: {
            destination: result.url,
            permanent: false,
          },
        }
      }
      if (result instanceof NotFound) {
        return {
          notFound: true,
        }
      }
      return result
    } catch (error) {
      console.error(error)
      if (error instanceof Redirect) {
        return {
          redirect: {
            destination: error.url,
            permanent: false,
          },
        }
      }
      if (error instanceof NotFound) {
        return {
          notFound: true,
        }
      }
      return {
        props: {
          error: (error as any).message,
        },
      }
    }
  }
}