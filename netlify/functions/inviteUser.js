"use strict";
const { createClient } = require("@supabase/supabase-js");

const supabase = createClient(
  process.env.VITE_SUPABASE_API_URL,
  process.env.VITE_SUPABASE_SERVICE_ROLE_KEY
);

exports.handler = async (event, context) => {
  const payload = JSON.parse(event.body);
  const email = payload.email;

  try {
    const { data: user, error } = await supabase.auth.api.inviteUserByEmail(
      email
    );

    if (error) {
      throw error;
    }
    return {
      statusCode: 200,
      body: JSON.stringify({
        ...user,
      }),
    };
  } catch (error) {
    console.error("Something has gone wrong inviting user:", error);

    if (error.status) {
      return {
        statusCode: error.status,
        body: JSON.stringify({ error: error }),
      };
    } else {
      return {
        statusCode: 500,
        body: JSON.stringify({ error: error }),
      };
    }
  }
};
