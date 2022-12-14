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

  useEffect(() => {
    session
      ? fetchRow(
          "profiles",
          "*, role(*), location(*)",
          "id",
          session.user.id,
          setProfile
        )
      : setProfile(null);
  }, [session]);

  useEffect(() => {
    fetchTable("profiles", "*, roles(*), locations(*)", setAllProfiles);
    fetchTable("promos", "*, priority(level), mix(*)", setPromos);
    fetchTable("flavors", "*, category(name)", setFlavors);
    fetchTable("flavor_categories", "*", setFlavorCategories);
    fetchTable("named_mixes", "*", setNamedMixes);
    fetchTable("nicotine_packets", "*", setNicotinePackets);
    fetchTable("roles", "*", setRoles);
    fetchTable("locations", "*", setLocations);

    if (import.meta.env.DEV) console.log("✅ subscribing to supabase tables");

    supabase
      .from("profiles")
      .on("INSERT", async (payload) => {
        setLoading(true);
        const newValue = await fetchNewValue(
          payload.new,
          "profiles",
          "role(*), location(*)"
        );
        setAllProfiles((prev) => [...prev, newValue]);
        if (session && session.user.id === newValue.id) {
          setProfile(newValue);
        }
        setLoading(false);
      })
      .on("UPDATE", async (payload) => {
        setLoading(true);
        const newValue = await fetchNewValue(
          payload.new,
          "profiles",
          "role(*), location(*)"
        );
        setAllProfiles((prev) =>
          prev.map((value) => (value.id === newValue.id ? newValue : value))
        );
        if (session && session.user.id === newValue.id) {
          setProfile(newValue);
        }
        setLoading(false);
      })
      .on("DELETE", (payload) => {
        setAllProfiles((prev) =>
          prev.filter((value) => value.id !== payload.old.id)
        );
        if (session && session.user.id === payload.old.id) {
          setProfile(null);
        }
      })
      .subscribe();

    // createListener("profiles", setAllProfiles, "roles(*), locations(*)");

    createListener("promos", setPromos, "priority(level), mix(*)");

    createListener("flavors", setFlavors, "category(name)");

    createListener("flavor_categories", setFlavorCategories);

    createListener("named_mixes", setNamedMixes);

    createListener("nicotine_packets", setNicotinePackets);

    createListener("roles", setRoles);

    createListener("locations", setLocations);

    setLoading(false);

    return async () => {
      if (import.meta.env.DEV) console.log("⛔️ unsubscribing from all tables");
      await supabase.removeAllSubscriptions();
    };
  }, []);

  const createListener = useCallback((table, setState, foreignKeys) =>
    supabase
      .from(table)
      .on("INSERT", async (payload) => {
        setLoading(true);
        const newValue = foreignKeys
          ? await fetchNewValue(payload.new, table, foreignKeys)
          : payload.new;
        setState((prev) => [...prev, newValue]);
        setLoading(false);
      })
      .on("UPDATE", async (payload) => {
        setLoading(true);
        const newValue = foreignKeys
          ? await fetchNewValue(payload.new, table, foreignKeys)
          : payload.new;
        setState((prev) =>
          prev.map((value) => (value.id === newValue.id ? newValue : value))
        );
        setLoading(false);
      })
      .on("DELETE", (payload) => {
        setState((prev) => prev.filter((value) => value.id !== payload.old.id));
      })
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

  const updateRow = async (table, value) => {
    try {
      const { error } = await supabase
        .from(table)
        .update(value)
        .eq("id", value.id);
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
