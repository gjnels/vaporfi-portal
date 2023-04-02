import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_API_URL,
  import.meta.env.VITE_SUPABASE_API_KEY
)
export default supabase

// fetch a table from supabase
export const fetchTable = async (table, selection, callback) => {
  try {
    const { data } = await supabase.from(table).select(selection)
    if (callback == null) return data // return the data if there is no callback function to be called
    callback(data)
  } catch (error) {
    console.error(error)
  }
}

// fetch a single row from a supabase table
// export const fetchRow = async (table, selection, column, value, callback) => {
//   try {
//     const { data } = await supabase
//       .from(table)
//       .select(selection)
//       .eq(column, value)
//       .single();
//     if (callback == null) return data; // return the data if there is no callback function to be called
//     callback(data);
//   } catch (error) {
//     console.error(error);
//   }
// };

// for use with realtime contexts relying on foreign keys
// foreign key values are not returned in supabase subscriptions
export const fetchForeignKeyData = async (table, selection, id, callback) => {
  try {
    const { data } = await supabase
      .from(table)
      .select(selection)
      .eq('id', id)
      .single()
    if (callback == null) return data // return the data if there is no callback function to be called
    callback(data)
  } catch (error) {
    console.error(error)
  }
}

// fetches foreign keys to attach to the new payload on a realtime update
export const fetchNewValue = async (newValue, table, selection) => {
  const foreignValues = selection
    ? await fetchForeignKeyData(table, selection, newValue.id)
    : {}
  return { ...newValue, ...foreignValues }
}
