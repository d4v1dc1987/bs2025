import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { User } from "@supabase/supabase-js";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Function to force clear all Supabase auth data
  const forceClearAuth = () => {
    // Clear all Supabase related items from storage
    localStorage.removeItem("sb-jxqeoenhiqdtzzqbjwqz-auth-token");
    sessionStorage.removeItem("sb-jxqeoenhiqdtzzqbjwqz-auth-token");
    
    // Clear session state
    setUser(null);
    
    // Redirect to auth page
    navigate("/auth?mode=login");
  };

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session }, error }) => {
      if (error) {
        console.error("Session error:", error);
        forceClearAuth();
        return;
      }
      setUser(session?.user ?? null);
      setLoading(false);
    });

    // Listen for changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log("Auth state changed:", event, session);
      if (event === "SIGNED_OUT" || event === "TOKEN_REFRESHED" && !session) {
        forceClearAuth();
      } else if (event === "SIGNED_IN") {
        setUser(session?.user ?? null);
        navigate("/dashboard");
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) {
        // If we get a 403 or user_not_found error, force clear the auth state
        if (error.status === 403 || error.message.includes("user_not_found")) {
          console.log("Forcing auth clear due to deleted user");
          forceClearAuth();
          toast.success("Session terminée");
          return;
        }
        throw error;
      }
      
      toast.success("Déconnexion réussie");
    } catch (error: any) {
      console.error("Logout error:", error);
      // Even if there's an error, force clear the auth state
      forceClearAuth();
      toast.success("Session terminée");
    }
  };

  return {
    user,
    loading,
    signOut,
  };
};