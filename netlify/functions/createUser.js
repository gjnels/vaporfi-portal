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

export default handler = async function (event) {
  const eventBody = JSON.parse(event.body);
  const { email, password } = eventBody;

  try {
    const { data, error } = await supabase.auth.admin.createUser({
      email,
      password,
      user_metadata: {
        newUser: true,
      },
      email_confirm: true,
    });

    if (error) throw error;

    return {
      statusCode: 200,
      body: JSON.stringify({ data }),
    };
  } catch (error) {
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
};
