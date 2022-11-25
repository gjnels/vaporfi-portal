const { createClient } = require("@supabase/supabase-js");

const supabase = createClient(
  process.env.VITE_SUPABASE_API_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

export async function handler(event) {
  const eventBody = JSON.parse(event.body);
  const { id } = eventBody;

  try {
    const { error } = await supabase.auth.admin.deleteUser(id);

    if (error) throw error;

    return {
      statusCode: 200,
      body: JSON.stringify({ success: true }),
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
}
