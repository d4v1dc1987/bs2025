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
    // Clear all Supabase related items from storage
    localStorage.removeItem('sb-jxqeoenhiqdtzzqbjwqz-auth-token');
    sessionStorage.removeItem('sb-jxqeoenhiqdtzzqbjwqz-auth-token');
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
      await supabase.auth.signOut();
    } catch (error: any) {
      console.error("Logout error:", error);
    } finally {
      // Always clear local state and redirect, even if the API call fails
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