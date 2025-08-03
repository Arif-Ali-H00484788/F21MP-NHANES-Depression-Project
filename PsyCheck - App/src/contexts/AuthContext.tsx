
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
    setLoading(true);
    console.log("AuthContext: useEffect started, loading set to true.");

    const checkInitialSession = async () => {
      console.log("AuthContext: checkInitialSession called.");
      try {
        const { data: { session: initialSession }, error } = await supabase.auth.getSession();
        if (error) {
          console.error("AuthContext: Error getting initial session:", error.message);
          setSession(null);
          setUser(null);
        } else if (initialSession) {
          console.log("AuthContext: Initial session found.", { userId: initialSession.user?.id, email: initialSession.user?.email });
          setSession(initialSession);
          setUser(initialSession.user ?? null);
        } else {
          console.log("AuthContext: No initial session found.");
          setSession(null);
          setUser(null);
        }
      } catch (e: any) {
        console.error("AuthContext: Exception in checkInitialSession:", e.message);
        setSession(null);
        setUser(null);
      } finally {
        // Only set loading to false if onAuthStateChange hasn't already done so via INITIAL_SESSION
        // This ensures that if onAuthStateChange fires first with INITIAL_SESSION, we don't prematurely stop loading
        // then start it again, then stop it.
        // However, if onAuthStateChange doesn't fire or is slow, getSession() outcome should determine loading state.
        setLoading(false);
        console.log("AuthContext: checkInitialSession finished, setLoading(false) called.");
      }
    };

    checkInitialSession();

    const { data: authListener } = supabase.auth.onAuthStateChange(
      (event: AuthChangeEvent, sessionState: Session | null) => {
        console.log("AuthContext: onAuthStateChange event:", event, "session user ID:", sessionState?.user?.id, "session exists:", !!sessionState);
        setSession(sessionState);
        setUser(sessionState?.user ?? null);
        
        // This event can often be the definitive source of truth for the initial session state
        // or subsequent changes. Ensure loading becomes false once this determination is made.
        if (event === "INITIAL_SESSION" || event === "SIGNED_IN" || event === "SIGNED_OUT") {
          setLoading(currentLoadingState => {
            if (currentLoadingState) {
              console.log(`AuthContext: onAuthStateChange event '${event}' is setting loading to false.`);
              return false;
            }
            return currentLoadingState; // Already false, no change
          });
        }
      }
    );

    return () => {
      console.log("AuthContext: Unsubscribing auth listener.");
      authListener?.subscription.unsubscribe();
    };
  }, []); // Empty dependency array ensures this runs once on mount

  if (loading) {
    return <LoadingScreen />;
  }

  return (
    <AuthContext.Provider value={{ user, session, loading }}>
      {children}
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
