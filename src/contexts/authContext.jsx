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
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  // Used to redirect logged in user to set password page if they are marked as a new user
  const newUser = useMemo(() => {
    if (session == null) return false;
    return session.user.user_metadata?.newUser != null;
  }, [session]);

  useEffect(() => {
    // Get session on app load
    (async () => {
      try {
        const {
          data: { session },
          error,
        } = await supabase.auth.getSession();
        if (error) throw error;
        if (session) {
          setSession(session);
          await fetchProfile(session);
        }
      } catch (error) {
        if (import.meta.env.DEV) console.log(error);
      } finally {
        setLoading(false);
      }
    })();

    // Listen for auth changes
    if (import.meta.env.DEV) console.log("✅ subscribing to auth changes");
    const {
      data: { subscription: authSubscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (import.meta.env.DEV)
        console.log("auth state change:", event, session);
      if (session) {
        setSession(session);
        await fetchProfile(session);
      } else {
        setSession(null);
        setProfile(null);
      }
    });

    return () => {
      if (import.meta.env.DEV) console.log("🛑 unsubscribed from auth changes");
      authSubscription.unsubscribe();
    };
  }, []);

  useEffect(() => {
    // Set up listener for profile changes
    // const profileSubscription
  }, [session]);

  async function fetchProfile(session) {
    // Prevent unecessary refreshes when changing focus back to the browser fires a SIGNED_IN event
    if (profile && session.user.id === profile.id) {
      return;
    }

    await supabase
      .from("profiles")
      .select("*, role(*), location(*)")
      .eq("id", session.user.id)
      .single()
      .then(({ data, error }) => {
        if (error) throw error;
        if (!data) throw new Error("User deleted");
        setProfile(data);
      })
      .catch((error) => {
        if (import.meta.env.DEV) console.log(error);
        // There is a session but no profile, meaning the user account has been deleted
        // Cannot call logout as it will result in an error
        // Remove the session from localStorage
        // This is a temporary fix for when a logged in user no longer has an account
        // USER_DELETED event is not yet triggered in onAuthStateChange, waiting for bug fix
        for (let i = 0; i < localStorage.length; i++) {
          const key = localStorage.key(i);
          if (key.startsWith("sb-") && key.endsWith("-auth-token")) {
            localStorage.removeItem(key);
            setSession(null);
            setProfile(null);
            return;
          }
        }
      });
  }

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

  async function updateProfile({ id, role, location, name }) {
    try {
      const { data, error } = await supabase
        .from("profiles")
        .update({ role, location, name })
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
    if (!session || !profile) return false;

    if (typeof access === "number") {
      return profile.role.access_level >= access;
    } else {
      return profile.role.name === access;
    }
  }

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
