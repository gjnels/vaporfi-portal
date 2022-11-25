/*
  create a new user
  requires service role key

  what will we need to send?
  - email
  - password (default password)
  - user_metadata:
    - newUser: true (this will be used to force the user to change their password when first logging in)
*/

const { createClient } = require("@supabase/supabase-js");

const supabase = createClient(
  process.env.VITE_SUPABASE_API_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

export async function handler(event) {
  const eventBody = JSON.parse(event.body);
  const { email } = eventBody;

  try {
    const { data, error } = await supabase.auth.admin.inviteUserByEmail(email);

    if (error) throw error;

    return {
      statusCode: 200,
      body: JSON.stringify({ data }),
    };
  } catch (error) {
    console.log(error);
    if (error.status) {
      return {
        statusCode: error.status,
        body: JSON.stringify({ error }),
      };
    } else {
      return {
        statusCode: 500,
        body: JSON.stringify({ error }),
      };
    }
  }
}
