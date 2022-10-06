import { createContext, useContext, useEffect } from "react";
import { useRealtime } from "../hooks/useRealtime";
import supabase from "../lib/supabaseClient";

const FlavorsContext = createContext();

export const useFlavors = () => useContext(FlavorsContext);

export const FlavorsProvider = ({ children }) => {
  const [flavors, flavorsLoading] = useRealtime({
    table: "flavors",
    selection: "*",
    foreignKeySelection: "category(name)",
  });
  const [categories, categoriesLoading] = useRealtime({
    table: "flavor_categories",
    selection: "*",
  });
  const [namedBlends, namedBlendsLoading] = useRealtime({
    table: "named_blends",
    selection: "*",
  });

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
