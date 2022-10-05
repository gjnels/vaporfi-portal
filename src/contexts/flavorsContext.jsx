import { createContext, useContext } from "react";
import { useRealtime } from "../hooks/useRealtime";
import supabase from "../lib/supabaseClient";

const FlavorsContext = createContext();

export const useFlavors = () => useContext(FlavorsContext);

export const FlavorsProvider = ({ children }) => {
  const [flavors, flavorsLoading] = useRealtime(
    "flavors",
    "*",
    "category(name)"
  );
  const [categories, categoriesLoading] = useRealtime("flavor_categories", "*");
  const [namedBlends, namedBlendsLoading] = useRealtime("named_blends", "*");

  const updateNamedBlend = async (updatedBlend) => {
    try {
      const { error } = await supabase
        .from("named_blends")
        .update(updatedBlend);
      return error;
    } catch (error) {
      return error;
    }
  };

  const value = {
    flavors: [flavors, flavorsLoading],
    categories: [categories, categoriesLoading],
    namedBlends: { namedBlends, namedBlendsLoading, updateNamedBlend },
  };

  return (
    <FlavorsContext.Provider value={value}>{children}</FlavorsContext.Provider>
  );
};
