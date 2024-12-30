import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ProfileAvatar } from "@/components/profile/ProfileAvatar";
import { ProfileForm } from "@/components/profile/ProfileForm";
import { SecurityForm } from "@/components/profile/SecurityForm";
import type { PasswordFormValues } from "@/schemas/passwordSchema";
import { useNavigate } from "react-router-dom";
import { useOnboarding } from "@/components/onboarding/OnboardingContext";
import { Onboarding } from "@/components/onboarding/Onboarding";

const Profile = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    avatar_url: "",
  });
  const { isOnboardingOpen, openOnboarding } = useOnboarding();

  useEffect(() => {
    if (user) {
      const { first_name, last_name, avatar_url } = user.user_metadata;
      setFormData({
        first_name: first_name || "",
        last_name: last_name || "",
        avatar_url: avatar_url || "",
      });
    }
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

      const { error: updateError } = await supabase.auth.updateUser({
        data: { avatar_url: publicUrl }
      });

      if (updateError) throw updateError;

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

      const { error } = await supabase.auth.updateUser({
        data: {
          first_name: formData.first_name,
          last_name: formData.last_name,
        }
      });

      if (error) throw error;

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
      
      {isOnboardingOpen && <Onboarding />}
      
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
                formData={{ ...formData, email: user?.email }}
                isLoading={isLoading}
                onSubmit={handleProfileUpdate}
                onChange={handleFormChange}
              />
            </Card>
            
            <Card className="p-8 bg-background/50 backdrop-blur supports-[backdrop-filter]:bg-background/30 border-primary/20">
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Ma personnalité Bobby Social</h3>
                <p className="text-sm text-muted-foreground">
                  Modifiez vos réponses au questionnaire de personnalité pour mettre à jour votre profil.
                </p>
                <Button onClick={openOnboarding}>
                  Modifier ma personnalité
                </Button>
              </div>
            </Card>
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
    </div>
  );
};

export default Profile;
