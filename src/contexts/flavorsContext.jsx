import { createContext, useContext } from "react";
import { useRealtime } from "../hooks/useRealtime";

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

  const value = {
    flavors: [flavors, flavorsLoading],
    categories: [categories, categoriesLoading],
    namedBlends: [namedBlends, namedBlendsLoading],
  };

  return (
    <FlavorsContext.Provider value={value}>{children}</FlavorsContext.Provider>
  );
};
