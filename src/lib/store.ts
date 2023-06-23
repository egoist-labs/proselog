import { atom, useAtom } from "jotai"

export type Store = {
  loginModalOpened: boolean
  setLoginModalOpened: (open: boolean) => void

  subscribeModalOpened: boolean
  setSubscribeModalOpened: (open: boolean) => void

  emailPostModalOpened: boolean
  setEmailPostModalOpened: (open: boolean) => void
}

const loginModalOpenedAtom = atom(false)
const subscribeModalOpenedAtom = atom(false)
const emailPostModalOpenedAtom = atom(false)

export const useLoginModalOpened = () => useAtom(loginModalOpenedAtom)
export const useSubscribeModalOpened = () => useAtom(subscribeModalOpenedAtom)
export const useEmailPostModalOpened = () => useAtom(emailPostModalOpenedAtom)
