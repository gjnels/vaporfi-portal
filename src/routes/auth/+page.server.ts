import { redirect } from '@sveltejs/kit'

export const load = async () => {
  throw redirect(303, '/')
}

export const actions = {
  signout: async ({ locals: { supabase } }) => {
    await supabase.auth.signOut()
  }
}
