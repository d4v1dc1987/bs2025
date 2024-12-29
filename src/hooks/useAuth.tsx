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
    } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user ?? null);
      if (event === 'SIGNED_OUT') {
        setUser(null);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) {
        console.error("Error signing out:", error.message);
        // If we get a session not found error, we can still clear the local state
        if (error.message.includes("session_not_found")) {
          setUser(null);
          toast({
            title: "Déconnexion réussie",
            description: "Vous avez été déconnecté avec succès.",
          });
          return;
        }
        throw error;
      }
      toast({
        title: "Déconnexion réussie",
        description: "Vous avez été déconnecté avec succès.",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Erreur lors de la déconnexion",
        description: "Une erreur est survenue lors de la déconnexion. Veuillez réessayer.",
      });
    }
  };

  return {
    user,
    loading,
    signOut,
  };
};