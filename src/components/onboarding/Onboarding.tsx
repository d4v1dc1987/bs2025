import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight, Check } from "lucide-react";
import { ONBOARDING_QUESTIONS } from "@/types/onboarding";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import type { OnboardingAnswers } from "@/types/onboarding";

export const Onboarding = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [answers, setAnswers] = useState<OnboardingAnswers>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    // Load existing answers if any
    const loadOnboardingData = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from('onboarding')
        .select('current_step, answers')
        .eq('id', user.id)
        .single();

      if (error) {
        console.error('Error loading onboarding data:', error);
        return;
      }

      if (data) {
        setCurrentStep(data.current_step);
        setAnswers(data.answers || {});
      }
    };

    loadOnboardingData();
  }, []);

  const currentQuestion = ONBOARDING_QUESTIONS[currentStep - 1];

  const handleNext = async () => {
    if (!answers[currentQuestion.id]) {
      toast.error("Veuillez sélectionner une réponse avant de continuer");
      return;
    }

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const nextStep = currentStep + 1;
    
    // Update Supabase with current progress
    const { error } = await supabase
      .from('onboarding')
      .update({
        current_step: nextStep,
        answers,
        status: nextStep > ONBOARDING_QUESTIONS.length ? 'completed' : 'in_progress',
      })
      .eq('id', user.id);

    if (error) {
      toast.error("Erreur lors de la sauvegarde de votre réponse");
      console.error('Error updating onboarding:', error);
      return;
    }

    if (nextStep > ONBOARDING_QUESTIONS.length) {
      setIsSubmitting(true);
      // Generate AI summary
      try {
        const response = await fetch('/functions/v1/generate-with-ai', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${process.env.SUPABASE_ANON_KEY}`,
          },
          body: JSON.stringify({
            prompt: `En tant qu'assistant marketing spécialisé, analyse ces réponses d'onboarding et crée un résumé professionnel du profil entrepreneurial. Voici les réponses : ${JSON.stringify(answers)}. 
            Format souhaité : Un paragraphe concis qui capture l'essence de leur activité, leur niveau d'expérience, leurs objectifs principaux et leurs défis.`,
          }),
        });

        const { generatedText } = await response.json();

        // Save AI summary
        await supabase
          .from('onboarding')
          .update({ ai_summary: generatedText })
          .eq('id', user.id);

        toast.success("Onboarding terminé avec succès !");
      } catch (error) {
        console.error('Error generating AI summary:', error);
        toast.error("Erreur lors de la génération du résumé");
      } finally {
        setIsSubmitting(false);
      }
    }

    setCurrentStep(nextStep);
  };

  const handlePrevious = () => {
    setCurrentStep(Math.max(1, currentStep - 1));
  };

  const handleAnswerChange = (value: string) => {
    setAnswers(prev => ({
      ...prev,
      [currentQuestion.id]: value
    }));
  };

  if (currentStep > ONBOARDING_QUESTIONS.length) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Onboarding terminé !</CardTitle>
          <CardDescription>
            Merci d'avoir complété l'onboarding. Nous analysons vos réponses pour personnaliser votre expérience.
          </CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Onboarding ({currentStep}/{ONBOARDING_QUESTIONS.length})</CardTitle>
        <CardDescription>
          Répondez à quelques questions pour personnaliser votre expérience
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div className="space-y-4">
            <h3 className="font-medium text-lg">{currentQuestion.question}</h3>
            <RadioGroup
              value={answers[currentQuestion.id]}
              onValueChange={handleAnswerChange}
              className="space-y-3"
            >
              {currentQuestion.options.map((option) => (
                <div key={option.value} className="flex items-center space-x-2">
                  <RadioGroupItem value={option.value} id={option.value} />
                  <Label htmlFor={option.value}>{option.label}</Label>
                </div>
              ))}
            </RadioGroup>
          </div>

          <div className="flex justify-between pt-4">
            <Button
              variant="outline"
              onClick={handlePrevious}
              disabled={currentStep === 1}
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Précédent
            </Button>
            <Button
              onClick={handleNext}
              disabled={!answers[currentQuestion.id] || isSubmitting}
            >
              {currentStep === ONBOARDING_QUESTIONS.length ? (
                <>
                  Terminer
                  <Check className="w-4 h-4 ml-2" />
                </>
              ) : (
                <>
                  Suivant
                  <ArrowRight className="w-4 h-4 ml-2" />
                </>
              )}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};