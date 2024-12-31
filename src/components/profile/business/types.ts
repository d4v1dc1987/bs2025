export type BusinessType = "coach" | "consultant" | "influencer" | "network_marketer" | "online_trainer" | "course_creator" | "freelancer" | "other";

export type BusinessProfile = {
  business_name: string | null;
  business_type: BusinessType | null;
  industry: string | null;
  main_product: string | null;
  target_audience: string | null;
  problem_solved: string | null;
  goals: string | null;
  client_results: string | null;
  company_age: string | null;
  company_story: string | null;
  company_values: string | null;
  ai_summary: string | null;
};