
"use client";

import type { User } from "@/types";
import type { AuthChangeEvent, Session } from "@supabase/supabase-js";
import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { supabase } from "@/config/supabase";
import { LoadingScreen } from "@/components/common/LoadingScreen";

interface AuthContextType {
  user: User | null;
  loading: boolean;
  session: Session | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // onAuthStateChange is the most reliable way to get session data
    // as it handles both initial load and subsequent changes.
    const { data: authListener } = supabase.auth.onAuthStateChange(
      (_event: AuthChangeEvent, sessionState: Session | null) => {
        setSession(sessionState);
        setUser(sessionState?.user ?? null);
        // The loading state is set to false once the initial session is determined.
        setLoading(false);
      }
    );

    // Unsubscribe from the listener when the component unmounts.
    return () => {
      authListener?.subscription.unsubscribe();
    };
  }, []);

  const value = {
    user,
    session,
    loading,
  };

  // Render a loading screen while the initial session is being fetched.
  // The rest of the app will only render once loading is false.
  return (
    <AuthContext.Provider value={value}>
      {loading ? <LoadingScreen /> : children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
