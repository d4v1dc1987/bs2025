import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { User } from "@supabase/supabase-js";
import { toast } from "sonner";

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    // Listen for changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_OUT') {
        setUser(null);
      } else {
        setUser(session?.user ?? null);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) {
        // If we get a session not found error, that's actually okay
        // It means we're already logged out
        if (error.message.includes("session_not_found")) {
          setUser(null);
          toast.success("Déconnexion réussie");
          return;
        }
        
        // For other errors, we should handle them
        console.error("Error signing out:", error.message);
        throw error;
      }

      setUser(null);
      toast.success("Déconnexion réussie");
    } catch (error) {
      console.error("Logout error:", error);
      toast.error("Une erreur est survenue lors de la déconnexion. Veuillez réessayer.");
      // Even if there's an error, we should try to clear the local state
      setUser(null);
    }
  };

  return {
    user,
    loading,
    signOut,
  };
};