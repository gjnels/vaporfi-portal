import { useMemo } from "react";
import { createContext, useContext, useEffect, useState } from "react";
import { showToast } from "../components/ui/Toast";
import supabase from "../lib/supabaseClient";

const AuthContext = createContext();

export function useAuthContext() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    // Get session on app load
    (async () => {
      const {
        data: { session },
        error,
      } = await supabase.auth.getSession();
      if (error) {
        setSession(null);
      } else {
        setSession(session);
      }
      setLoading(false);
    })();

    // Listen for auth changes
    if (import.meta.env.DEV) console.log("✅ subscribing to auth changes");
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      if (import.meta.env.DEV)
        console.log("auth state change:", event, session);
      setSession(session);
    });

    return () => {
      if (import.meta.env.DEV) console.log("🛑 unsubscribed from auth changes");
      subscription.unsubscribe();
    };
  }, []);

  // Update profile on session change
  useEffect(() => {
    if (session == null) {
      setProfile(null);
      return;
    }

    setLoading(true);
    supabase
      .from("profiles")
      .select("*, role(*), location(*)")
      .eq("id", session.user.id)
      .single()
      .then(({ data, error }) => {
        if (error) throw error;
        setProfile(data);
      })
      .catch((error) => {
        if (import.meta.env.DEV) console.log("profile error:", error);
        setProfile(null);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [session]);

  const signIn = async (credentials) => {
    try {
      const { error } = await supabase.auth.signInWithPassword(credentials);
      if (error) throw error;
    } catch (error) {
      return error;
    }
  };

  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
    } catch (error) {
      return error;
    }
  };

  async function updateProfile({ id, email, role, location, ...rest }) {
    try {
      const { data, error } = await supabase
        .from("profiles")
        .update({ role: role.id, location: location.id, ...rest })
        .eq("id", id)
        .select("*, role(*), location(*)")
        .single();
      if (error) throw error;
      setProfile(data);
    } catch (error) {
      if (import.meta.env.DEV) console.log("profile update error:", error);
      return error;
    }
  }

  function canAccess(access = 1) {
    if (!profile) return false;

    if (typeof access === "number") {
      return profile.role.access_level >= access;
    } else {
      return profile.role.name === access;
    }
  }

  // Used to redirect logged in user to set password page if they are marked as a new user
  const newUser = useMemo(() => {
    if (session == null) return false;
    return session.user.user_metadata.newUser ?? false;
  }, [session]);

  const value = {
    session,
    profile,
    updateProfile,
    canAccess,
    signIn,
    signOut,
    loading,
    newUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
