export type BusinessType = "coach" | "consultant" | "influencer" | "network_marketer" | "online_trainer" | "course_creator" | "freelancer" | "other";

export type BusinessProfile = {
  business_name: string | null;
  business_type: BusinessType | null;
  target_audience: string | null;
  main_product: string | null;
  product_description: string | null;
  price_range: string | null;
  unique_value: string | null;
  goals: string | null;
  challenges: string | null;
  ai_summary: string | null;
};