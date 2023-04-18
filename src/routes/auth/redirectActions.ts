export const redirects = {
  'password-reset': {
    redirectTo: '/auth/password/change'
  },
  'email-change': {
    redirectTo: '/account/security'
  },
  'accept-invite': {
    redirectTo: '/auth/password/change'
  }
} as const

export type RedirectAction = keyof typeof redirects

export const isRedirectAction = (value: unknown): value is RedirectAction =>
  (value as RedirectAction) in redirects
