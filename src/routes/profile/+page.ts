import { redirect } from '@sveltejs/kit'

export const load = async ({ parent }) => {
  const { currentProfile } = await parent()
  if (!currentProfile) {
    throw redirect(307, '/login?redirectTo=/profile')
  }
}
