import { createContext, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import supabase from "../lib/supabaseClient";

const SessionContext = createContext();

export function useSessionContext() {
  return useContext(SessionContext);
}

export function SessionProvider({ children }) {
  const [session, setSession] = useState(supabase.auth.session());
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (import.meta.env.DEV) console.log("✅ subscribing to auth changes");
    const { data: authSubscription } = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (import.meta.env.DEV) console.log("auth state change:", event);
        setSession(session);
      }
    );

    return () => {
      if (import.meta.env.DEV) console.log("🛑 unsubscribed from auth changes");
      authSubscription.unsubscribe();
    };
  }, []);

  const signIn = async (credentials) => {
    try {
      setLoading(true);
      const { error } = await supabase.auth.signIn(credentials);
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
