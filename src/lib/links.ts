// Mavigation links

import type { Page } from '@sveltejs/kit'
import type { Role } from './types/supabaseHelpers.types'

export type MenuNavLink = {
  href: string
  label: string
  roles?: Role[] | 'authed'
  // Use to to highlight active route
  active: 'startsWith' | 'exact' | ((role: Role | null) => 'startsWith' | 'exact')
  notification?: boolean
}

export type MenuNavLinkList = {
  id: string
  title: string
  roles?: Role[] | 'authed'
  list: Array<MenuNavLink>
}

export const menuNavLinks = (pageData: Page['data']): Array<MenuNavLinkList> => [
  // Admin (shown first as these are more pertinent to Admin users)
  // Required role: Admin
  {
    id: 'admin',
    title: 'Administrators',
    roles: ['Admin'],
    list: [
      {
        href: '/promotions',
        label: 'Manage Promotions',
        active: 'startsWith'
      },
      {
        href: '/users',
        label: 'Manage Users',
        active: 'startsWith'
      },
      {
        href: '/missing-sku/manage',
        label: 'Manage Missing Skus',
        active: 'startsWith',
        notification: !!pageData.missingSkusCount && pageData.missingSkusCount > 0
      },
      {
        href: '/incorrect-sku/manage',
        label: 'Manage Incorrect Skus',
        active: 'startsWith',
        notification: !!pageData.incorrectSkusCount && pageData.incorrectSkusCount > 0
      }
    ]
  },

  // Custom Blends
  {
    id: 'blends',
    title: 'Custom Blends',
    list: [
      {
        href: '/flavor-picker',
        label: 'Flavor Picker',
        active: 'startsWith'
      },
      {
        href: '/custom-blends',
        label: 'Custom Blend List',
        active: (role: Role | null) => {
          if (role === 'Admin' || role === 'Manager') {
            return 'exact'
          }
          return 'startsWith'
        }
      },
      {
        href: '/custom-blends/new',
        label: 'Create A Blend',
        roles: ['Manager', 'Admin'],
        active: 'startsWith'
      }
    ]
  },

  // Nicotine
  {
    id: 'nicotine',
    title: 'Nicotine',
    list: [
      {
        href: '/nicotine-calculator/packets',
        label: 'Packet Caclulator',
        active: 'startsWith'
      },
      {
        href: '/nicotine-calculator/level',
        label: 'Level Calculator',
        active: 'startsWith'
      }
    ]
  },

  // Skus
  {
    id: 'skus',
    title: 'Item Skus',
    list: [
      {
        href: '/missing-sku',
        label: 'Missing Sku',
        active: 'exact'
      },
      {
        href: '/incorrect-sku',
        label: 'Incorrect Sku',
        active: 'exact'
      }
    ]
  }
]
