import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ProfileSection } from "@/components/profile/ProfileSection";
import { SecuritySection } from "@/components/profile/SecuritySection";
import { PersonalitySection } from "@/components/profile/PersonalitySection";
import { PersonStanding, User, Shield } from "lucide-react";
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
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <User className="h-8 w-8 text-primary" />
        <h1 className="text-3xl font-bold">Mon Profil</h1>
      </div>

      <Tabs defaultValue={defaultTab} className="w-full space-y-8">
        <div className="sticky top-[3.5rem] z-30 -mx-4 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b border-border/40">
          <div className="px-4 overflow-x-auto scrollbar-none">
            <TabsList className="h-12 w-full md:w-auto justify-start gap-4 rounded-none border-b border-border/40 bg-transparent p-0 flex-nowrap">
              <TabsTrigger 
                value="profile" 
                className="relative h-12 rounded-none border-b-2 border-transparent bg-transparent px-4 pb-3 pt-3 font-medium text-muted-foreground shadow-none transition-none data-[state=active]:border-primary data-[state=active]:text-foreground data-[state=active]:shadow-none whitespace-nowrap"
              >
                <User className="mr-2 h-4 w-4" />
                Informations
              </TabsTrigger>
              <TabsTrigger 
                value="personality" 
                className="relative h-12 rounded-none border-b-2 border-transparent bg-transparent px-4 pb-3 pt-3 font-medium text-muted-foreground shadow-none transition-none data-[state=active]:border-primary data-[state=active]:text-foreground data-[state=active]:shadow-none whitespace-nowrap"
              >
                <PersonStanding className="mr-2 h-4 w-4" />
                Personnalité
              </TabsTrigger>
              <TabsTrigger 
                value="security" 
                className="relative h-12 rounded-none border-b-2 border-transparent bg-transparent px-4 pb-3 pt-3 font-medium text-muted-foreground shadow-none transition-none data-[state=active]:border-primary data-[state=active]:text-foreground data-[state=active]:shadow-none whitespace-nowrap"
              >
                <Shield className="mr-2 h-4 w-4" />
                Sécurité
              </TabsTrigger>
            </TabsList>
          </div>
        </div>

        <div className="space-y-8">
          <TabsContent value="profile" className="m-0">
            <ProfileSection
              formData={formData}
              isLoading={isLoading}
              setIsLoading={setIsLoading}
              setFormData={setFormData}
            />
          </TabsContent>

          <TabsContent value="personality" className="m-0">
            <PersonalitySection />
          </TabsContent>
          
          <TabsContent value="security" className="m-0">
            <SecuritySection
              isLoading={isLoading}
              setIsLoading={setIsLoading}
            />
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
};

export default Profile;