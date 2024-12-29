import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { User } from "@supabase/supabase-js";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Function to clear local state and redirect
  const clearStateAndRedirect = () => {
    setUser(null);
    navigate("/auth?mode=login");
  };

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
      console.log("Auth state changed:", event, session);
      if (event === "SIGNED_OUT") {
        clearStateAndRedirect();
      } else if (event === "SIGNED_IN") {
        setUser(session?.user ?? null);
        navigate("/");
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  const signOut = async () => {
    try {
      // Force clear the session from Supabase
      await supabase.auth.signOut({ scope: 'local' });
      
      // Clear browser storage
      localStorage.removeItem('supabase.auth.token');
      sessionStorage.removeItem('supabase.auth.token');
      
      // Clear local state and redirect
      clearStateAndRedirect();
      toast.success("Déconnexion réussie");
    } catch (error: any) {
      console.error("Logout error:", error);
      
      // Even if there's an error, we should clear the local state
      clearStateAndRedirect();
      toast.success("Déconnexion réussie");
    }
  };

  return {
    user,
    loading,
    signOut,
  };
};