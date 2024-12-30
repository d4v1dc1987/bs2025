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
import { useIsMobile } from "@/hooks/use-mobile";

const Profile = () => {
  const [searchParams] = useSearchParams();
  const defaultTab = searchParams.get('tab') || 'profile';
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const isMobile = useIsMobile();
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
    <div className="container max-w-4xl py-8">
      <h1 className="text-3xl font-bold mb-8 text-center bg-gradient-to-r from-[#c299ff] to-primary bg-clip-text text-transparent">
        Mon Profil
      </h1>
      
      <Tabs defaultValue={defaultTab} className="space-y-8">
        <TabsList className={`grid w-full ${isMobile ? 'grid-cols-1 gap-2' : 'grid-cols-3'} mb-8`}>
          <TabsTrigger value="profile" className="text-lg">
            Informations
          </TabsTrigger>
          <TabsTrigger value="personality" className="text-lg flex items-center gap-2">
            <PersonStanding className="w-4 h-4" />
            {isMobile ? 'Bobby Social' : 'Personnalité'}
          </TabsTrigger>
          <TabsTrigger value="security" className="text-lg">
            Sécurité
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="profile">
          <ProfileSection
            formData={formData}
            isLoading={isLoading}
            setIsLoading={setIsLoading}
            setFormData={setFormData}
          />
        </TabsContent>

        <TabsContent value="personality">
          <PersonalitySection />
        </TabsContent>
        
        <TabsContent value="security">
          <SecuritySection
            isLoading={isLoading}
            setIsLoading={setIsLoading}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Profile;