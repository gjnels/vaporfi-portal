import { createContext, useContext, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { showToast } from "../components/ui/Toast";
import { useLocalStorage } from "../hooks/useLocalStorage";
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
  const { get, set } = useLocalStorage("vf-nicotine-packet-preferences");
  const [preferences, setPreferences] = useState(get());

  useEffect(() => {
    if (!preferences.length && packets.length) {
      const initialPreferences = packets.map((packet) => ({
        id: packet.id,
        available: true,
      }));
      setPreferences(initialPreferences);
      set(initialPreferences);
    }
  }, [packets]);

  const togglePreference = (id, available) => {
    const newPreferences = preferences.map((preference) =>
      preference.id === id ? { ...preference, available } : preference
    );
    setPreferences(newPreferences);
  };

  const savePreferences = () => {
    set(preferences);
    showToast("Nicotine preferences saved");
  };

  const availablePackets = packets.map((packet) => ({
    ...packet,
    available:
      preferences.find((preference) => preference.id === packet.id)
        ?.available ?? false,
  }));

  return (
    <NicotineContext.Provider
      value={{
        packets: sortPackets(availablePackets),
        togglePreference,
        savePreferences,
        loading,
      }}
    >
      {children}
    </NicotineContext.Provider>
  );
};
