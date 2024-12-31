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
    if (!userId) return;

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
      if (data) {
        setFormData({
          business_name: data.business_name || "",
          business_type: data.business_type,
          business_ownership: data.business_ownership,
          industry: data.industry || "",
          main_product: data.main_product || "",
          target_audience: data.target_audience || "",
          problem_solved: data.problem_solved || "",
          goals: data.goals || "",
          client_results: data.client_results || "",
          company_age: data.company_age || "",
          company_story: data.company_story || "",
          company_values: data.company_values || "",
          ai_summary: data.ai_summary,
        });
      }
    } catch (error) {
      console.error("Error fetching business profile:", error);
      toast.error("Erreur lors du chargement du profil business");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (userId) {
      fetchBusinessProfile();
    }
  }, [userId]);

  return {
    isLoading,
    formData,
    setFormData,
    fetchBusinessProfile
  };
};