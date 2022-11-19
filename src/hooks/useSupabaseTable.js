import { useEffect, useState } from "react";
import supabase from "../lib/supabaseClient";

export function useSupabaseTable(table) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  function getData() {
    supabase
      .from(table)
      .select("*")
      .then(({ data }) => {
        setError("");
        setData(data);
      })
      .catch((error) => {
        setData([]);
        setError(error.message);
      })
      .finally(() => {
        setLoading(false);
      });
  }

  function getRow(id) {
    return supabase.from(table).select("*").eq("id", id).single();
  }

  useEffect(() => {
    getData();
  }, []);

  return { data, loading, error, getData, getRow };
}
