import { useMemo } from "react";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import supabase, {
  fetchNewValue,
  fetchRow,
  fetchTable,
} from "../lib/supabaseClient";
import { useSessionContext } from "./sessionContext";

const SupabaseContext = createContext();

export const useSupabaseContext = () => useContext(SupabaseContext);

export const SupabaseProvider = ({ children }) => {
  const { session } = useSessionContext();

  const [loading, setLoading] = useState(true);

  const [profile, setProfile] = useState(null);
  const [allProfiles, setAllProfiles] = useState([]);
  const [promos, setPromos] = useState([]);
  const [flavors, setFlavors] = useState([]);
  const [flavorCategories, setFlavorCategories] = useState([]);
  const [namedMixes, setNamedMixes] = useState([]);
  const [nicotinePackets, setNicotinePackets] = useState([]);
  const [roles, setRoles] = useState([]);
  const [locations, setLocations] = useState([]);
  const [priorities, setPriorities] = useState([]);

  useEffect(() => {
    fetchTable("profiles", "*, role(*), location(*)", setAllProfiles);
    fetchTable("promos", "*, priority(*), mix(*)", setPromos);
    fetchTable("flavors", "*, category(name)", setFlavors);
    fetchTable("flavor_categories", "*", setFlavorCategories);
    fetchTable("named_mixes", "*", setNamedMixes);
    fetchTable("nicotine_packets", "*", setNicotinePackets);
    fetchTable("roles", "*", setRoles);
    fetchTable("locations", "*", setLocations);
    fetchTable("promo_priority_levels", "*", setPriorities);

    if (import.meta.env.DEV) console.log("✅ subscribing to supabase tables");

    createListener("profiles", setAllProfiles, "role(*), location(*)");

    createListener("promos", setPromos, "priority(*), mix(*)");

    createListener("flavors", setFlavors, "category(name)");

    createListener("flavor_categories", setFlavorCategories);

    createListener("named_mixes", setNamedMixes);

    createListener("nicotine_packets", setNicotinePackets);

    console.log(supabase.getChannels());
    setLoading(false);

    return async () => {
      if (import.meta.env.DEV) console.log("⛔️ unsubscribing from all tables");
      await supabase.removeAllChannels();
    };
  }, []);

  useEffect(() => {
    setProfile(
      allProfiles.find((profile) => profile.id === session?.user?.id) ?? null
    );
  }, [session, allProfiles]);

  const createListener = useCallback((table, setState, foreignKeys) =>
    supabase
      .channel("public:" + table)
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: table },
        async (payload) => {
          setLoading(true);
          const newValue = foreignKeys
            ? await fetchNewValue(payload.new, table, foreignKeys)
            : payload.new;
          setState((prev) => [...prev, newValue]);
          setLoading(false);
        }
      )
      .on(
        "postgres_changes",
        { event: "UPDATE", schema: "public", table: table },
        async (payload) => {
          setLoading(true);
          const newValue = foreignKeys
            ? await fetchNewValue(payload.new, table, foreignKeys)
            : payload.new;
          setState((prev) =>
            prev.map((value) => (value.id === newValue.id ? newValue : value))
          );
          setLoading(false);
        }
      )
      .on(
        "postgres_changes",
        { event: "DELETE", schema: "public", table: table },
        (payload) => {
          setState((prev) =>
            prev.filter((value) => value.id !== payload.old.id)
          );
        }
      )
      .subscribe()
  );

  const insertRow = async (table, value) => {
    try {
      const { error } = await supabase.from(table).insert(value);
      throw error;
    } catch (error) {
      return error;
    }
  };

  const updateRow = async (table, value, id) => {
    try {
      const { error } = await supabase.from(table).update(value).eq("id", id);
      throw error;
    } catch (error) {
      return error;
    }
  };

  const deleteRow = async (table, id) => {
    try {
      const { error } = await supabase.from(table).delete().eq("id", id);
      throw error;
    } catch (error) {
      return error;
    }
  };

  const value = {
    loading,
    profile,
    allProfiles,
    promos,
    flavors,
    flavorCategories,
    namedMixes,
    nicotinePackets,
    roles,
    locations,
    priorities,
    insertRow,
    updateRow,
    deleteRow,
  };

  return (
    <SupabaseContext.Provider value={value}>
      {children}
    </SupabaseContext.Provider>
  );
};
