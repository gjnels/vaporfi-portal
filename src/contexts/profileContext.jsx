import { createContext, useContext } from "react";
import { useRealtime } from "../hooks/useRealtime";
import { useSession } from "./sessionContext";

const ProfileContext = createContext();

export function useProfile() {
  return useContext(ProfileContext);
}

export function ProfileProvider({ children }) {
  const user = useSession();
  const [profile, loading] = useRealtime(
    "profiles",
    "*",
    "location(*), role(*)"
  );

  return (
    <ProfileContext.Provider value={{ profile, loading }}>
      {children}
    </ProfileContext.Provider>
  );
}
