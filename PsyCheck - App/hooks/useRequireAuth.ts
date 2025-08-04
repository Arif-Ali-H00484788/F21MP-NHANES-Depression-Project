
"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { ROUTES } from "@/lib/constants";

// No direct change needed for Supabase client here,
// as it relies on useAuth which has been updated.
// The User type from useAuth will now be Supabase's User type.
export function useRequireAuth(redirectUrl: string = ROUTES.LOGIN) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push(redirectUrl);
    }
  }, [user, loading, router, redirectUrl]);

  return { user, loading };
}
