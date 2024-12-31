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
      
      // First, ensure the business profile exists
      const { data: existingProfile, error: checkError } = await supabase
        .from("business_profiles")
        .select("*")
        .eq("id", userId)
        .maybeSingle();

      if (checkError) {
        throw checkError;
      }

      // If no profile exists, create one
      if (!existingProfile) {
        console.log('No business profile found, creating one...');
        const { error: insertError } = await supabase
          .from("business_profiles")
          .insert([{ id: userId }]);

        if (insertError) {
          throw insertError;
        }

        // Set default values after creating profile
        setFormData(defaultBusinessProfile);
      } else {
        console.log('Found existing business profile:', existingProfile);
        // Merge existing data with defaults to ensure all fields are defined
        setFormData({
          ...defaultBusinessProfile,
          ...existingProfile,
        });
      }
    } catch (error) {
      console.error("Error fetching/creating business profile:", error);
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