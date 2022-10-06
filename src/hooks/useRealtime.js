import { useEffect, useState } from "react";
import supabase, {
  fetchTable,
  fetchNewValue,
  fetchRow,
} from "../lib/supabaseClient";

// custom hook for supabase realtime feature
// handles all realtime events (insert, update, and delete) as well as fetches foreign key values if necessary

export const useRealtime = ({
  table,
  selection,
  foreignKeySelection,
  singleRowColumn,
  singleRowValue,
  initialValue = [],
}) => {
  const [values, setValues] = useState(initialValue);
  const [loading, setLoading] = useState(true);

  const handleInsert = async (payload) => {
    if (import.meta.env.DEV) console.log(`🔔 new value inserted in ${table}`);
    setLoading(true);
    const newValue = await fetchNewValue(
      payload.new,
      table,
      foreignKeySelection
    );
    setValues((prevValues) => [...prevValues, newValue]);
    setLoading(false);
  };

  const handleUpdate = async (payload) => {
    if (import.meta.env.DEV) console.log(`📝 value updated in ${table}`);
    setLoading(true);
    const newValue = await fetchNewValue(
      payload.new,
      table,
      foreignKeySelection
    );
    setValues((prevValues) =>
      prevValues.map((prevValue) =>
        prevValue.id === payload.new.id ? newValue : prevValue
      )
    );
    setLoading(false);
  };

  const handleDelete = async (payload) => {
    if (import.meta.env.DEV) console.log(`⛔️ value deleted from ${table}`);
    setLoading(true);
    setValues((prevValues) =>
      prevValues.filter((prevValue) => prevValue !== payload.old.id)
    );
    setLoading(false);
  };

  useEffect(() => {
    const completeSelection = foreignKeySelection
      ? [selection, foreignKeySelection].join(", ")
      : selection;

    const fetchInitialData = async () => {
      setValues(
        singleRowColumn && singleRowValue
          ? await fetchRow(
              table,
              completeSelection,
              singleRowColumn,
              singleRowValue
            )
          : await fetchTable(table, completeSelection)
      );

      setLoading(false);
    };
    fetchInitialData();

    if (import.meta.env.DEV) console.log(`✅ subscribing to ${table}`);
    const subscription = supabase
      .from(table)
      .on("INSERT", handleInsert)
      .on("UPDATE", handleUpdate)
      .on("DELETE", handleDelete)
      .subscribe();

    const removeSubscription = async () => {
      if (import.meta.env.DEV) console.log(`🛑 unsubscribing from ${table}`);
      await supabase.removeSubscription(subscription);
    };

    return () => {
      removeSubscription();
    };
  }, []);

  return [values, loading];
};
