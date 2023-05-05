import type { DatabaseRow } from './supabaseHelpers.types'

export type CurrentUserProfile = DatabaseRow<'profiles'> & {
  locations: Pick<DatabaseRow<'locations'>, 'id' | 'name'>[] | null
}
