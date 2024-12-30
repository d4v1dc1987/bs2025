import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ProfileAvatar } from "@/components/profile/ProfileAvatar";
import { ProfileForm } from "@/components/profile/ProfileForm";
import { SecurityForm } from "@/components/profile/SecurityForm";
import { OnboardingSection } from "@/components/profile/OnboardingSection";
import { OnboardingProvider } from "@/components/onboarding/OnboardingContext";
import type { PasswordFormValues } from "@/schemas/passwordSchema";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const Profile = () => {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    avatar_url: "",
    email: "",
  });

  useEffect(() => {
    const fetchProfileData = async () => {
      if (!user?.id) return;

      try {
        const { data: profile, error } = await supabase
          .from('profiles')
          .select('first_name, last_name, avatar_url')
          .eq('id', user.id)
          .single();

        if (error) throw error;

        setFormData({
          first_name: profile.first_name || "",
          last_name: profile.last_name || "",
          avatar_url: profile.avatar_url || "",
          email: user.email || "",
        });
      } catch (error) {
        console.error("Error fetching profile:", error);
        toast.error("Erreur lors du chargement du profil");
      }
    };

    fetchProfileData();
  }, [user]);

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

      // Update both auth metadata and profiles table
      const { error: updateAuthError } = await supabase.auth.updateUser({
        data: { avatar_url: publicUrl }
      });

      if (updateAuthError) throw updateAuthError;

      const { error: updateProfileError } = await supabase
        .from('profiles')
        .update({ avatar_url: publicUrl })
        .eq('id', user?.id);

      if (updateProfileError) throw updateProfileError;

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

      // Update both auth metadata and profiles table
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

  const handlePasswordUpdate = async (values: PasswordFormValues) => {
    try {
      setIsLoading(true);
      const { error } = await supabase.auth.updateUser({
        password: values.password,
      });

      if (error) throw error;

      toast.success("Mot de passe mis à jour avec succès");
    } catch (error: any) {
      toast.error(error.message || "Erreur lors de la mise à jour du mot de passe");
    } finally {
      setIsLoading(false);
    }
  };

  const handleFormChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const getInitials = () => {
    return `${(formData.first_name?.[0] || "").toUpperCase()}${(formData.last_name?.[0] || "").toUpperCase()}` || "U";
  };

  return (
    <div className="container max-w-4xl py-8">
      <h1 className="text-3xl font-bold mb-8 text-center bg-gradient-to-r from-[#c299ff] to-primary bg-clip-text text-transparent">
        Mon Profil
      </h1>
      
      <OnboardingProvider>
        <Tabs defaultValue="profile" className="space-y-8">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="profile" className="text-lg">
              Informations
            </TabsTrigger>
            <TabsTrigger value="security" className="text-lg">
              Sécurité
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="profile">
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
              
              <OnboardingSection />
            </div>
          </TabsContent>
          
          <TabsContent value="security">
            <Card className="p-8 bg-background/50 backdrop-blur supports-[backdrop-filter]:bg-background/30 border-primary/20">
              <SecurityForm
                isLoading={isLoading}
                onSubmit={handlePasswordUpdate}
              />
            </Card>
          </TabsContent>
        </Tabs>
      </OnboardingProvider>
    </div>
  );
};

export default Profile;