import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export const useUserAvatar = (userId?: string) => {
  const queryClient = useQueryClient();

  const { data: avatarUrl } = useQuery({
    queryKey: ["userAvatar", userId],
    queryFn: async () => {
      if (!userId) return null;
      
      const { data, error } = await supabase
        .from("profiles")
        .select("avatar_url")
        .eq("id", userId)
        .single();

      if (error) throw error;
      return data?.avatar_url;
    },
    enabled: !!userId,
  });

  const updateAvatarCache = (newAvatarUrl: string) => {
    queryClient.setQueryData(["userAvatar", userId], newAvatarUrl);
  };

  return { avatarUrl, updateAvatarCache };
};