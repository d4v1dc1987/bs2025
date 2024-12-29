import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { 
  LayoutDashboard, 
  BookOpen, 
  MessageSquare, 
  MessageCircleReply, 
  Calendar, 
  CheckSquare 
} from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Onboarding } from "@/components/onboarding/Onboarding";
import { supabase } from "@/integrations/supabase/client";
import type { OnboardingStatus } from "@/types/onboarding";

const features = [
  {
    icon: BookOpen,
    title: "Idées de publications",
    description: "Booste ton contenu et captive ton audience en un clin d'œil.",
    to: "/generator",
  },
  {
    icon: MessageSquare,
    title: "Aide-moi à commenter",
    description: "Donne les meilleurs commentaires sur les posts de tes prospects.",
    to: "/comment",
  },
  {
    icon: MessageCircleReply,
    title: "Aide-moi à répondre",
    description: "Lance des conversations privées avec tes prospects à partir de tes posts.",
    to: "/reply",
  },
  {
    icon: Calendar,
    title: "Calendrier social",
    description: "Planifie tes publications avec le calendrier interactif.",
    to: "/calendar",
  },
  {
    icon: CheckSquare,
    title: "Aide-moi à closer",
    description: "Booste tes interactions et close plus facilement avec tes prospects.",
    to: "/close",
  },
];

const Dashboard = () => {
  const [onboardingStatus, setOnboardingStatus] = useState<OnboardingStatus | null>(null);

  useEffect(() => {
    const checkOnboardingStatus = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from('onboarding')
        .select('status')
        .eq('id', user.id)
        .single();

      if (error) {
        console.error('Error checking onboarding status:', error);
        return;
      }

      setOnboardingStatus(data?.status || 'not_started');
    };

    checkOnboardingStatus();
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <LayoutDashboard className="h-8 w-8 text-primary" />
        <h1 className="text-3xl font-bold">Tableau de bord</h1>
      </div>
      
      <p className="text-muted-foreground">
        Bienvenue sur votre tableau de bord Bobby Social
      </p>

      {onboardingStatus !== 'completed' && (
        <div className="mb-8">
          <Onboarding />
        </div>
      )}

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {features.map((feature) => {
          const Icon = feature.icon;
          return (
            <Link 
              key={feature.to} 
              to={feature.to}
              className={onboardingStatus !== 'completed' ? 'pointer-events-none opacity-50' : ''}
            >
              <Card className="h-full transition-all duration-200 hover:shadow-lg hover:border-primary/50 hover:-translate-y-1 bg-[#2A2A30] backdrop-blur-sm border-[#3A3A40]">
                <CardHeader>
                  <div className="flex items-center gap-2 mb-2">
                    <Icon className="h-6 w-6 text-primary" />
                    <CardTitle className="text-xl">{feature.title}</CardTitle>
                  </div>
                  <CardDescription className="text-base text-gray-300">
                    {feature.description}
                  </CardDescription>
                </CardHeader>
              </Card>
            </Link>
          );
        })}
      </div>
    </div>
  );
};

export default Dashboard;