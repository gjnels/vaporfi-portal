import { useContext } from "react";
import { createContext } from "react";
import { useSupabaseRealtime } from "../hooks/useSupabaseRealtime";
import { useSupabaseTable } from "../hooks/useSupabaseTable";

const SupabaseContext = createContext();

export function useSupabaseContext() {
  return useContext(SupabaseContext);
}

export function SupabaseProvider({ children }) {
  const promos = useSupabaseRealtime("promos", ["mix", "priority"]);
  const profiles = useSupabaseRealtime("profiles", ["role", "location"]);
  const nicotinePackets = useSupabaseRealtime("nicotine_packets");
  const namedMixes = useSupabaseRealtime("named_mixes");
  const flavors = useSupabaseRealtime("flavors", ["category"]);
  const flavorCategories = useSupabaseRealtime("flavor_categories");
  const roles = useSupabaseTable("roles");
  const locations = useSupabaseTable("locations");
  const promoPriorities = useSupabaseRealtime("promo_priority_levels");

  const value = {
    promos,
    profiles,
    nicotinePackets,
    namedMixes,
    flavors,
    flavorCategories,
    roles,
    locations,
    promoPriorities,
  };

  return (
    <SupabaseContext.Provider value={value}>
      {children}
    </SupabaseContext.Provider>
  );
}
