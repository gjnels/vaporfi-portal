export const redirectActions = ['password-reset', 'email-change'] as const
export type RedirectAction = (typeof redirectActions)[number]

type Redirects = {
  [Key in RedirectAction]: { redirectTo: string; action: Key }
}

export const redirects: Redirects = {
  'password-reset': {
    action: 'password-reset',
    redirectTo: '/auth/password/change'
  },
  'email-change': {
    action: 'email-change',
    redirectTo: '/account/security'
  }
}

export const isRedirectAction = (value: unknown): value is RedirectAction =>
  redirectActions.includes(value as RedirectAction)
