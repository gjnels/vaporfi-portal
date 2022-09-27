import { createContext, useContext, useEffect, useState } from "react";
import supabase from "../lib/supabaseClient";

const SessionContext = createContext();

export function useSession() {
  return useContext(SessionContext);
}

export function SessionProvider({ children }) {
  const [user, setUser] = useState(supabase.auth.user());

  useEffect(() => {
    console.log("✅ subscribing to auth changes");
    const { data: authSubscription } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setUser(session?.user());
      }
    );

    return () => {
      console.log("🛑 unsubscribed from auth changes");
      authSubscription.unsubscribe();
    };
  }, []);

  return (
    <SessionContext.Provider value={user}>{children}</SessionContext.Provider>
  );
}
