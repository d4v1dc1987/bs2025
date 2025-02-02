export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      business_profiles: {
        Row: {
          ai_summary: string | null
          business_name: string | null
          business_ownership: string | null
          business_type: Database["public"]["Enums"]["business_type"] | null
          challenges: string | null
          client_results: string | null
          company_age: string | null
          company_story: string | null
          company_values: string | null
          created_at: string
          goals: string | null
          id: string
          industry: string | null
          main_product: string | null
          main_solution: string | null
          problem_solved: string | null
          social_links: Json | null
          target_audience: string | null
          updated_at: string
        }
        Insert: {
          ai_summary?: string | null
          business_name?: string | null
          business_ownership?: string | null
          business_type?: Database["public"]["Enums"]["business_type"] | null
          challenges?: string | null
          client_results?: string | null
          company_age?: string | null
          company_story?: string | null
          company_values?: string | null
          created_at?: string
          goals?: string | null
          id: string
          industry?: string | null
          main_product?: string | null
          main_solution?: string | null
          problem_solved?: string | null
          social_links?: Json | null
          target_audience?: string | null
          updated_at?: string
        }
        Update: {
          ai_summary?: string | null
          business_name?: string | null
          business_ownership?: string | null
          business_type?: Database["public"]["Enums"]["business_type"] | null
          challenges?: string | null
          client_results?: string | null
          company_age?: string | null
          company_story?: string | null
          company_values?: string | null
          created_at?: string
          goals?: string | null
          id?: string
          industry?: string | null
          main_product?: string | null
          main_solution?: string | null
          problem_solved?: string | null
          social_links?: Json | null
          target_audience?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      onboarding: {
        Row: {
          ai_summary: string | null
          answers: Json | null
          created_at: string
          current_step: number | null
          id: string
          status: Database["public"]["Enums"]["onboarding_status"] | null
          updated_at: string
        }
        Insert: {
          ai_summary?: string | null
          answers?: Json | null
          created_at?: string
          current_step?: number | null
          id: string
          status?: Database["public"]["Enums"]["onboarding_status"] | null
          updated_at?: string
        }
        Update: {
          ai_summary?: string | null
          answers?: Json | null
          created_at?: string
          current_step?: number | null
          id?: string
          status?: Database["public"]["Enums"]["onboarding_status"] | null
          updated_at?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string
          first_name: string | null
          id: string
          last_name: string | null
          role: Database["public"]["Enums"]["user_role"]
          username: string | null
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          first_name?: string | null
          id: string
          last_name?: string | null
          role?: Database["public"]["Enums"]["user_role"]
          username?: string | null
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          first_name?: string | null
          id?: string
          last_name?: string | null
          role?: Database["public"]["Enums"]["user_role"]
          username?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      business_type:
        | "coach"
        | "consultant"
        | "influencer"
        | "network_marketer"
        | "online_trainer"
        | "course_creator"
        | "freelancer"
        | "other"
      onboarding_status: "not_started" | "in_progress" | "completed"
      user_role: "user" | "admin" | "super-admin"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
    ? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never
