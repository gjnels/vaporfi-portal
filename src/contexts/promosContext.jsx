import { createContext, useContext } from "react";
import { useRealtime } from "../hooks/useRealtime";

const PromosContext = createContext();

export const usePromos = () => useContext(PromosContext);

const sortPromos = (a, b) => {
  if (a.priority.level < b.priority.level) {
    return 1;
  } else if (a.priority.level > b.priority.level) {
    return -1;
  } else if (a.updated_at < b.updated_at) {
    return 1;
  } else if (a.updated_at > b.updated_at) {
    return -1;
  } else {
    return 0;
  }
};

export const PromosProvider = ({ children }) => {
  const [promos, loading] = useRealtime({
    table: "promos",
    selection: "*",
    foreignKeySelection: "priority(level), mix(*)",
  });

  const value = {
    promos: [...promos].sort(sortPromos),
    loading,
  };

  return (
    <PromosContext.Provider value={value}>{children}</PromosContext.Provider>
  );
};
