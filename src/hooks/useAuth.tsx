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
      // First check if we have a session
      const { data: { session } } = await supabase.auth.getSession();
      
      // If no session, just update local state
      if (!session) {
        setUser(null);
        toast.success("Déconnexion réussie");
        return;
      }

      // If we have a session, try to sign out
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        // Handle session_not_found gracefully
        if (error.message.includes("session_not_found")) {
          setUser(null);
          toast.success("Déconnexion réussie");
          return;
        }
        
        // For other errors, throw them
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