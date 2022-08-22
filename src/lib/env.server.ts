export const R2_API_TOKEN = process.env.R2_API_TOKEN
export const MAILGUN_APIKEY = process.env.MAILGUN_APIKEY
export const MAILGUN_DOMAIN_TRANSANCTION =
  process.env.MAILGUN_DOMAIN_TRANSANCTION
export const MAILGUN_DOMAIN_NEWSLETTER = process.env.MAILGUN_DOMAIN_NEWSLETTER
export const ENCRYPT_SECRET = process.env.BUILD_STEP
  ? // This won't be used in actual runtime
    "random_string_to_make_next_build_happy"
  : process.env.ENCRYPT_SECRET

export const AUTH_COOKIE_NAME = process.env.AUTH_COOKIE_NAME
export const UMAMI_TOKEN = process.env.UMAMI_TOKEN
export const UMAMI_ENDPOINT = process.env.UMAMI_ENDPOINT
