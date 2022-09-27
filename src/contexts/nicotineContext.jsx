import { createContext, useContext, useState } from "react";
import { useRealtime } from "../hooks/useRealtime";

const NicotineContext = createContext();

export const useNicotine = () => useContext(NicotineContext);

const sortPackets = (packets) => {
  return [...packets].sort((a, b) => {
    if (a.salt && !b.salt) {
      return 1;
    } else if (!a.salt && b.salt) {
      return -1;
    } else if (a.nic_level < b.nic_level) {
      return -1;
    } else if (a.nic_level > b.nic_level) {
      return 1;
    } else {
      return 0;
    }
  });
};

export const NicotineProvider = ({ children }) => {
  const [packets, loading] = useRealtime("nic_packets", "*");
  console.log(packets, loading);
  const [preferences, setPreferences] = useState([]);

  return (
    <NicotineContext.Provider
      value={{ packets: sortPackets(packets), preferences, loading }}
    >
      {children}
    </NicotineContext.Provider>
  );
};
