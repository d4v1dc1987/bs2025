import { useLocation } from "react-router-dom";
import { Separator } from "@/components/ui/separator";
import { useSidebar } from "./SidebarContext";
import { NavButton } from "./NavButton";
import { MainNavigation } from "./MainNavigation";
import { dashboardLink } from "./navigation";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export const SidebarNav = () => {
  const location = useLocation();
  const { isOpen, close } = useSidebar();
  const [onboardingCompleted, setOnboardingCompleted] = useState<boolean | null>(null);
  
  useEffect(() => {
    const checkOnboardingStatus = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        const { data, error } = await supabase
          .from('onboarding')
          .select('status')
          .eq('id', user.id)
          .maybeSingle();

        if (error) throw error;
        setOnboardingCompleted(data?.status === 'completed');
      } catch (error) {
        console.error('Error checking onboarding status:', error);
        toast.error("Erreur lors de la vérification du statut d'onboarding");
      }
    };

    checkOnboardingStatus();
  }, []);
  
  const handleLinkClick = (isProtected: boolean = true) => {
    if (window.innerWidth < 768) {
      close();
    }

    if (isProtected && !onboardingCompleted) {
      toast.error("Veuillez d'abord compléter le questionnaire de personnalisation");
      return false;
    }

    return true;
  };
  
  if (onboardingCompleted === null) {
    return null; // Or a loading state if you prefer
  }
  
  return (
    <nav className="grid gap-2 px-3 py-2">
      {/* Dashboard Section - Not protected */}
      <NavButton
        {...dashboardLink}
        isActive={location.pathname === dashboardLink.to}
        isOpen={isOpen}
        onClick={() => handleLinkClick(false)}
      />
      
      {/* Separator with consistent margin */}
      <Separator className="my-2 bg-gray-700/50" />
      
      {/* Main Navigation Links - Protected */}
      <MainNavigation 
        isOpen={isOpen}
        onLinkClick={() => handleLinkClick(true)}
        isDisabled={!onboardingCompleted}
      />
    </nav>
  );
};