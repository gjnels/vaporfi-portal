import { useEffect, useState } from "react";
import supabase from "../lib/supabaseClient";

export function useSupabaseRealtime(table, foreignKeys = []) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const selection = ["*", ...foreignKeys.map((key) => key + "(*)")].join(", ");

  useEffect(() => {
    supabase
      .from(table)
      .select(selection)
      .then(({ data }) => {
        setData(data);
      })
      .catch((error) => {
        setError(error.message);
      })
      .finally(() => {
        setLoading(false);
      });

    const subscription = supabase
      .channel(table)
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: table },
        (payload) => {
          const newValue =
            foreignKeys.length > 0
              ? fetchRow(payload.new.id).then(({ data }) => {
                  return data;
                })
              : payload.new;
          setData((current) => [...current, newValue]);
        }
      )
      .on(
        "postgres_changes",
        { event: "UPDATE", schema: "public", table: table },
        (payload) => {
          const newValue =
            foreignKeys.length > 0
              ? fetchRow(payload.new.id).then(({ data }) => {
                  return data;
                })
              : payload.new;
          setData((current) =>
            current.map((row) => (row.id === payload.new.id ? newValue : row))
          );
        }
      )
      .on(
        "postgres_changes",
        { event: "DELETE", schema: "public", table: table },
        (payload) => {
          setData((current) =>
            current.filter((row) => row.id !== payload.old.id)
          );
        }
      );

    subscription.subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  // Fetch a row from the database after an update
  // This is necessary to include foreign key values if they exist
  function fetchRow(id) {
    return supabase.from(table).select(selection).eq("id", id).single();
  }

  // Get a value from the already fetched data
  function getRow(id) {
    return data.find((row) => row.id == id);
  }

  function insert(data) {
    return supabase.from(table).insert(data);
  }

  function update(data) {
    const { id, ...updates } = data;
    return supabase.from(table).update(updates).eq("id", id);
  }

  // delete is a reserved keyword, so this is the delete function
  function remove(id) {
    return supabase.from(table).delete().eq("id", id);
  }
  return { data, loading, error, insert, update, remove, getRow };
}
