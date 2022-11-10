import { createContext, useContext, useEffect, useState } from "react";
import { showToast } from "../components/ui/Toast";
import supabase from "../lib/supabaseClient";

const SessionContext = createContext();

export function useSessionContext() {
  return useContext(SessionContext);
}

export function SessionProvider({ children }) {
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (import.meta.env.DEV) console.log("✅ subscribing to auth changes");
    (async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      setSession(session);
    })();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      if (import.meta.env.DEV) console.log("auth state change:", event);
      setSession(session);
    });

    return () => {
      if (import.meta.env.DEV) console.log("🛑 unsubscribed from auth changes");
      subscription.unsubscribe();
    };
  }, []);

  const signIn = async (credentials) => {
    try {
      setLoading(true);
      const { error } = await supabase.auth.signInWithPassword(credentials);
      if (error) throw error;
    } catch (error) {
      return error;
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    try {
      setLoading(true);
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      showToast("Successfully logged out.", {
        type: "success",
        duration: 2000,
      });
    } catch (error) {
      return error;
    } finally {
      setLoading(false);
    }
  };

  const value = {
    session,
    signIn,
    signOut,
    loading,
  };

  return (
    <SessionContext.Provider value={value}>{children}</SessionContext.Provider>
  );
}
