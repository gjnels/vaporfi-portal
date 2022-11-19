/*
  update a user's data
  service role key will be required

  what can we update?
  - email
  - password
  - user_metadata
    - newUser: true if resetting password, otherwise null
*/

const { createClient } = require("@supabase/supabase-js");

const supabase = createClient(
  process.env.VITE_SUPABASE_API_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

export default handler = async function (event) {
  const eventBody = JSON.parse(event.body);
  const { id, email, password, newUser } = eventBody;

  const updates = {};
  if (email) {
    updates.email = email;
  }
  if (password) {
    updates.password = password;
  }
  if (newUser) {
    updates.user_metadata = { newUser };
  }

  try {
    const { data, error } = await supabase.auth.admin.updateUserById(
      id,
      updates
    );

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
