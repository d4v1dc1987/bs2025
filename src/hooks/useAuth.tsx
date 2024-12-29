import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { User } from "@supabase/supabase-js";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

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
        setUser(null);
        navigate("/auth?mode=login");
      } else if (event === "SIGNED_IN") {
        setUser(session?.user ?? null);
        navigate("/");
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  const signOut = async () => {
    try {
      // First check if we have a session
      const { data: { session } } = await supabase.auth.getSession();
      
      // If no session, just update local state and redirect
      if (!session) {
        setUser(null);
        navigate("/auth?mode=login");
        toast.success("Déconnexion réussie");
        return;
      }

      // If we have a session, try to sign out
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        // Handle session_not_found gracefully
        if (error.message.includes("session_not_found")) {
          setUser(null);
          navigate("/auth?mode=login");
          toast.success("Déconnexion réussie");
          return;
        }
        
        // For other errors, show error toast
        console.error("Logout error:", error);
        toast.error("Une erreur est survenue lors de la déconnexion");
        return;
      }

      // Successful logout
      setUser(null);
      navigate("/auth?mode=login");
      toast.success("Déconnexion réussie");
    } catch (error) {
      console.error("Logout error:", error);
      toast.error("Une erreur est survenue lors de la déconnexion");
      
      // Even if there's an error, we should clear the local state
      setUser(null);
      navigate("/auth?mode=login");
    }
  };

  return {
    user,
    loading,
    signOut,
  };
};