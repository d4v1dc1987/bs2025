import { Card } from "@/components/ui/card";
import { ProfileAvatar } from "@/components/profile/ProfileAvatar";
import { ProfileForm } from "@/components/profile/ProfileForm";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useAuth } from "@/hooks/useAuth";

interface ProfileSectionProps {
  formData: {
    first_name: string;
    last_name: string;
    avatar_url: string;
    email?: string;
  };
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
  setFormData: (data: any) => void;
}

export const ProfileSection = ({ 
  formData, 
  isLoading, 
  setIsLoading,
  setFormData 
}: ProfileSectionProps) => {
  const { user } = useAuth();

  const handleFormChange = (field: string, value: string) => {
    setFormData((prev: any) => ({ ...prev, [field]: value }));
  };

  const cleanupOldAvatars = async (userId: string, currentAvatarUrl: string | null) => {
    try {
      const { error } = await supabase.functions.invoke('cleanup-old-avatars', {
        body: {
          userId,
          currentAvatarUrl
        }
      });

      if (error) {
        throw error;
      }

      console.log('Cleanup completed successfully');
    } catch (error) {
      console.error('Error cleaning up old avatars:', error);
    }
  };

  const handleAvatarChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    try {
      setIsLoading(true);
      const file = event.target.files?.[0];
      if (!file) return;

      if (file.size > 2 * 1024 * 1024) {
        toast.error("L'image ne doit pas dépasser 2MB");
        return;
      }

      const fileExt = file.name.split('.').pop();
      const filePath = `${user?.id}/${crypto.randomUUID()}.${fileExt}`;

      const { error: uploadError, data } = await supabase.storage
        .from('avatars')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('avatars')
        .getPublicUrl(filePath);

      const { error: updateAuthError } = await supabase.auth.updateUser({
        data: { avatar_url: publicUrl }
      });

      if (updateAuthError) throw updateAuthError;

      const { error: updateProfileError } = await supabase
        .from('profiles')
        .update({ avatar_url: publicUrl })
        .eq('id', user?.id);

      if (updateProfileError) throw updateProfileError;

      // Clean up old avatars after successful update
      await cleanupOldAvatars(user?.id || '', publicUrl);

      setFormData(prev => ({ ...prev, avatar_url: publicUrl }));
      toast.success("Photo de profil mise à jour avec succès");
    } catch (error: any) {
      toast.error("Erreur lors de la mise à jour de la photo de profil");
      console.error("Error updating avatar:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setIsLoading(true);

      const { error: updateAuthError } = await supabase.auth.updateUser({
        data: {
          first_name: formData.first_name,
          last_name: formData.last_name,
        }
      });

      if (updateAuthError) throw updateAuthError;

      const { error: updateProfileError } = await supabase
        .from('profiles')
        .update({
          first_name: formData.first_name,
          last_name: formData.last_name,
        })
        .eq('id', user?.id);

      if (updateProfileError) throw updateProfileError;

      toast.success("Profil mis à jour avec succès");
    } catch (error: any) {
      toast.error("Erreur lors de la mise à jour du profil");
      console.error("Error updating profile:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const getInitials = () => {
    return `${(formData.first_name?.[0] || "").toUpperCase()}${(formData.last_name?.[0] || "").toUpperCase()}` || "U";
  };

  return (
    <div className="space-y-8">
      <Card className="p-8 bg-background/50 backdrop-blur supports-[backdrop-filter]:bg-background/30 border-primary/20">
        <div className="flex flex-col items-center space-y-4">
          <ProfileAvatar
            avatarUrl={formData.avatar_url}
            isLoading={isLoading}
            onAvatarChange={handleAvatarChange}
            initials={getInitials()}
          />
          <p className="text-sm text-[#c299ff]">
            JPG, PNG ou GIF • Max 2MB
          </p>
        </div>
      </Card>

      <Card className="p-8 bg-background/50 backdrop-blur supports-[backdrop-filter]:bg-background/30 border-primary/20">
        <ProfileForm
          formData={formData}
          isLoading={isLoading}
          onSubmit={handleProfileUpdate}
          onChange={handleFormChange}
        />
      </Card>
    </div>
  );
};