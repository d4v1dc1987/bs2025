import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ProfileSection } from "@/components/profile/ProfileSection";
import { SecuritySection } from "@/components/profile/SecuritySection";
import { PersonalitySection } from "@/components/profile/PersonalitySection";
import { PersonStanding } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useSearchParams } from "react-router-dom";

const Profile = () => {
  const [searchParams] = useSearchParams();
  const defaultTab = searchParams.get('tab') || 'profile';
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

  return (
    <div className="flex-1 px-4 md:px-6 py-6">
      <div className="max-w-4xl mx-auto space-y-6">
        <h1 className="text-3xl font-bold text-center bg-gradient-to-r from-[#c299ff] to-primary bg-clip-text text-transparent">
          Mon Profil
        </h1>
        
        <Tabs defaultValue={defaultTab} className="space-y-6">
          <div className="sticky top-0 z-10 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 py-4 border-b border-border/40">
            <TabsList className="flex flex-col w-full gap-2 md:flex-row md:w-fit mx-auto">
              <TabsTrigger 
                value="profile" 
                className="w-full md:w-auto text-base font-medium px-6"
              >
                Informations
              </TabsTrigger>
              <TabsTrigger 
                value="personality" 
                className="w-full md:w-auto text-base font-medium px-6 flex items-center gap-2 justify-center"
              >
                <PersonStanding className="w-4 h-4" />
                <span>Personnalité</span>
              </TabsTrigger>
              <TabsTrigger 
                value="security" 
                className="w-full md:w-auto text-base font-medium px-6"
              >
                Sécurité
              </TabsTrigger>
            </TabsList>
          </div>
          
          <TabsContent value="profile" className="mt-6">
            <ProfileSection
              formData={formData}
              isLoading={isLoading}
              setIsLoading={setIsLoading}
              setFormData={setFormData}
            />
          </TabsContent>

          <TabsContent value="personality" className="mt-6">
            <PersonalitySection />
          </TabsContent>
          
          <TabsContent value="security" className="mt-6">
            <SecuritySection
              isLoading={isLoading}
              setIsLoading={setIsLoading}
            />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Profile;