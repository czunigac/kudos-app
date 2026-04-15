"use client";

import { useAuth } from "@/hooks/useAuth";
import { createClient } from "@/lib/supabase/client";
import { useEffect, type ReactNode } from "react";

export function SessionProvider({ children }: { children: ReactNode }) {
  const { loadProfile } = useAuth();

  useEffect(() => {
    void loadProfile();

    const supabase = createClient();
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event) => {
      if (event === "SIGNED_IN") {
        void loadProfile();
      }
    });

    return () => subscription.unsubscribe();
  }, [loadProfile]);

  return <>{children}</>;
}
