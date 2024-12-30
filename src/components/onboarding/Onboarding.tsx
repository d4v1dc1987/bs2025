import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft, ArrowRight, Check } from "lucide-react";
import { ONBOARDING_QUESTIONS, AI_PROFILE_PROMPT } from "@/types/onboarding";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { ChoiceGroup } from "./ChoiceGroup";
import { QuestionDescription } from "./QuestionDescription";
import type { OnboardingAnswers } from "@/types/onboarding";

export const Onboarding = () => {
  const [currentStep, setCurrentStep] = useState(0); // Start at 0 for intro
  const [answers, setAnswers] = useState<OnboardingAnswers>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [firstName, setFirstName] = useState<string>("");

  useEffect(() => {
    // Load existing answers and user data
    const loadData = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        // Get user's first name
        const { data: profileData } = await supabase
          .from('profiles')
          .select('first_name')
          .eq('id', user.id)
          .maybeSingle();

        if (profileData?.first_name) {
          setFirstName(profileData.first_name);
        }

        // Get onboarding data
        const { data: onboardingData, error } = await supabase
          .from('onboarding')
          .select('current_step, answers')
          .eq('id', user.id)
          .maybeSingle();

        if (error) {
          console.error('Error loading onboarding data:', error);
          return;
        }

        if (onboardingData) {
          setCurrentStep(onboardingData.current_step || 0);
          setAnswers(onboardingData.answers as OnboardingAnswers || {});
        }
      } catch (error) {
        console.error('Error loading data:', error);
      }
    };

    loadData();
  }, []);

  const handleNext = async () => {
    const currentQuestion = ONBOARDING_QUESTIONS[currentStep - 1];
    
    if (currentStep === 0) {
      setCurrentStep(1);
      return;
    }

    if (currentQuestion && !answers[currentQuestion.id]) {
      toast.error("Veuillez répondre à la question avant de continuer");
      return;
    }

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    let nextStep = currentStep + 1;
    
    // Skip children details question if not applicable
    if (currentStep === 5 && answers.has_children !== 'yes') {
      nextStep = 7;
    }

    // Update Supabase with current progress
    const { error } = await supabase
      .from('onboarding')
      .upsert({
        id: user.id,
        current_step: nextStep,
        answers,
        status: nextStep > ONBOARDING_QUESTIONS.length ? 'completed' : 'in_progress',
      });

    if (error) {
      toast.error("Erreur lors de la sauvegarde de votre réponse");
      console.error('Error updating onboarding:', error);
      return;
    }

    if (nextStep > ONBOARDING_QUESTIONS.length) {
      setIsSubmitting(true);
      // Generate AI summary
      try {
        const formattedAnswers = Object.entries(answers)
          .map(([key, value]) => `${key}: ${Array.isArray(value) ? value.join(', ') : value}`)
          .join('\n');

        const prompt = AI_PROFILE_PROMPT
          .replace('{firstName}', firstName)
          .replace('{answers}', formattedAnswers);

        const response = await fetch('/functions/v1/generate-with-ai', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${process.env.SUPABASE_ANON_KEY}`,
          },
          body: JSON.stringify({ prompt }),
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
  };

  const handlePrevious = () => {
    if (currentStep === 7 && answers.has_children !== 'yes') {
      setCurrentStep(5);
    } else {
      setCurrentStep(Math.max(0, currentStep - 1));
    }
  };

  const handleAnswerChange = (value: string | string[]) => {
    if (currentStep === 0) return;
    
    const currentQuestion = ONBOARDING_QUESTIONS[currentStep - 1];
    setAnswers(prev => ({
      ...prev,
      [currentQuestion.id]: value
    }));
  };

  if (currentStep > ONBOARDING_QUESTIONS.length) {
    return (
      <Card className="w-full max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>Onboarding terminé !</CardTitle>
          <CardDescription>
            Merci d'avoir complété l'onboarding. Nous analysons vos réponses pour personnaliser votre expérience.
          </CardDescription>
        </CardHeader>
      </Card>
    );
  }

  if (currentStep === 0) {
    return (
      <Card className="w-full max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>Bienvenue dans Bobby Social</CardTitle>
          <CardDescription className="text-lg space-y-4">
            <p>Ok {firstName}, tout d'abord, j'ai quelques questions à te poser pour personnaliser ton expérience avec Bobby Social au maximum. 😎</p>
            <p>🔥 Plus tu réponds de façon honnête et précise, mieux c'est!</p>
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button onClick={handleNext} className="w-full">
            Commencer
          </Button>
        </CardContent>
      </Card>
    );
  }

  const currentQuestion = ONBOARDING_QUESTIONS[currentStep - 1];
  const questionText = currentQuestion.question.replace('{firstName}', firstName);

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
            <h3 className="font-medium text-lg whitespace-pre-line">{questionText}</h3>
            
            {(currentQuestion.type === 'single' || currentQuestion.type === 'multiple') && (
              <ChoiceGroup
                question={currentQuestion}
                value={answers[currentQuestion.id]}
                onChange={handleAnswerChange}
              />
            )}

            {currentQuestion.type === 'text' && (
              <Input
                value={answers[currentQuestion.id] as string || ''}
                onChange={(e) => handleAnswerChange(e.target.value)}
                placeholder="Votre réponse..."
              />
            )}

            {currentQuestion.type === 'textarea' && (
              <Textarea
                value={answers[currentQuestion.id] as string || ''}
                onChange={(e) => handleAnswerChange(e.target.value)}
                placeholder="Votre réponse..."
                className="min-h-[120px]"
              />
            )}

            {currentQuestion.type === 'date' && (
              <Input
                type="text"
                value={answers[currentQuestion.id] as string || ''}
                onChange={(e) => handleAnswerChange(e.target.value)}
                placeholder="19 février 1987"
              />
            )}

            <QuestionDescription description={currentQuestion.description} />
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
