import { createContext, useContext, useState, ReactNode } from "react";

interface OnboardingContextType {
  isOnboardingOpen: boolean;
  openOnboarding: () => void;
  closeOnboarding: () => void;
}

const OnboardingContext = createContext<OnboardingContextType | undefined>(undefined);

export function OnboardingProvider({ children }: { children: ReactNode }) {
  const [isOnboardingOpen, setIsOnboardingOpen] = useState(false);

  const openOnboarding = () => {
    console.log("Opening onboarding...");
    setIsOnboardingOpen(true);
  };
  
  const closeOnboarding = () => {
    console.log("Closing onboarding...");
    setIsOnboardingOpen(false);
  };

  return (
    <OnboardingContext.Provider value={{ isOnboardingOpen, openOnboarding, closeOnboarding }}>
      {children}
    </OnboardingContext.Provider>
  );
}

export function useOnboarding() {
  const context = useContext(OnboardingContext);
  if (context === undefined) {
    throw new Error("useOnboarding must be used within an OnboardingProvider");
  }
  return context;
}