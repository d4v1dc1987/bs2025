import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import type { BusinessProfile } from "@/components/profile/business/types";

const defaultBusinessProfile: BusinessProfile = {
  business_name: "",
  business_type: null,
  business_ownership: null,
  industry: "",
  main_product: "",
  target_audience: "",
  problem_solved: "",
  goals: "",
  client_results: "",
  company_age: "",
  company_story: "",
  company_values: "",
  ai_summary: null,
};

export const useBusinessProfile = (userId: string | undefined) => {
  const [isLoading, setIsLoading] = useState(true);
  const [formData, setFormData] = useState<BusinessProfile>(defaultBusinessProfile);

  const fetchBusinessProfile = async () => {
    if (!userId) {
      setIsLoading(false);
      return;
    }

    try {
      console.log('Fetching business profile for user:', userId);
      const { data, error } = await supabase
        .from("business_profiles")
        .select("*")
        .eq("id", userId)
        .maybeSingle();

      if (error) {
        console.error("Error fetching business profile:", error);
        throw error;
      }

      console.log('Fetched business profile:', data);
      
      // Merge the fetched data with default values to ensure all fields are defined
      setFormData({
        ...defaultBusinessProfile,
        ...data,
      });
    } catch (error) {
      console.error("Error fetching business profile:", error);
      toast.error("Erreur lors du chargement du profil business");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchBusinessProfile();
  }, [userId]);

  return {
    isLoading,
    formData,
    setFormData,
    fetchBusinessProfile
  };
};