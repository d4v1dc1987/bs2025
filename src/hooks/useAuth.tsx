import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { User } from "@supabase/supabase-js";
import { useToast } from "@/components/ui/use-toast";

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

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
      if (event === 'SIGNED_OUT' || event === 'USER_DELETED') {
        setUser(null);
        // Clear any local session data
        await supabase.auth.clearSession();
      } else {
        setUser(session?.user ?? null);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const signOut = async () => {
    try {
      // First try to clear the session locally
      await supabase.auth.clearSession();
      
      const { error } = await supabase.auth.signOut();
      if (error) {
        // If we get a session not found error, that's actually okay
        // It means we're already logged out
        if (error.message.includes("session_not_found")) {
          setUser(null);
          toast({
            title: "Déconnexion réussie",
            description: "Vous avez été déconnecté avec succès.",
          });
          return;
        }
        
        // For other errors, we should handle them
        console.error("Error signing out:", error.message);
        throw error;
      }

      setUser(null);
      toast({
        title: "Déconnexion réussie",
        description: "Vous avez été déconnecté avec succès.",
      });
    } catch (error) {
      console.error("Logout error:", error);
      toast({
        variant: "destructive",
        title: "Erreur lors de la déconnexion",
        description: "Une erreur est survenue lors de la déconnexion. Veuillez réessayer.",
      });
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