import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft, ArrowRight, Check } from "lucide-react";
import { ONBOARDING_QUESTIONS } from "@/types/onboarding";
import { ChoiceGroup } from "./ChoiceGroup";
import { QuestionDescription } from "./QuestionDescription";
import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";
import type { OnboardingAnswers } from "@/types/onboarding";
import { Progress } from "@/components/ui/progress";

interface QuestionFormProps {
  currentStep: number;
  firstName: string;
  answers: OnboardingAnswers;
  onPrevious: () => void;
  onNext: () => void;
  onAnswerChange: (value: string | string[]) => void;
  isSubmitting: boolean;
}

export const QuestionForm = ({
  currentStep,
  firstName,
  answers,
  onPrevious,
  onNext,
  onAnswerChange,
  isSubmitting
}: QuestionFormProps) => {
  const currentQuestion = ONBOARDING_QUESTIONS[currentStep - 1];
  const questionText = currentQuestion.question.replace('{firstName}', firstName);
  const isMobile = useIsMobile();
  const progress = (currentStep / ONBOARDING_QUESTIONS.length) * 100;

  // Détermine si le champ doit être multi-lignes
  const isMultilineQuestion = currentQuestion.id === 'favorite_books' || 
                            currentQuestion.id === 'personal_story';

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <div className="flex items-center justify-between mb-4">
          <CardTitle>Questionnaire</CardTitle>
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium">{currentStep}/{ONBOARDING_QUESTIONS.length}</span>
            <Progress value={progress} className="w-24" />
          </div>
        </div>
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
                onChange={onAnswerChange}
              />
            )}

            {currentQuestion.type === 'date' && (
              <Input
                type="text"
                value={answers[currentQuestion.id] as string || ''}
                onChange={(e) => onAnswerChange(e.target.value)}
                placeholder="Ex: 19 février 1987"
                className="w-full"
              />
            )}

            {currentQuestion.type === 'text' && (
              <Input
                value={answers[currentQuestion.id] as string || ''}
                onChange={(e) => onAnswerChange(e.target.value)}
                placeholder="Votre réponse..."
                maxLength={currentQuestion.maxLength}
                className="w-full"
              />
            )}

            {currentQuestion.type === 'textarea' && (
              <Textarea
                value={answers[currentQuestion.id] as string || ''}
                onChange={(e) => onAnswerChange(e.target.value)}
                placeholder="Votre réponse..."
                className={cn(
                  "resize-y w-full",
                  isMultilineQuestion ? "min-h-[120px]" : "min-h-[80px]"
                )}
                maxLength={currentQuestion.maxLength}
              />
            )}

            <QuestionDescription description={currentQuestion.description} />
          </div>

          <div className={`flex ${isMobile ? 'flex-col' : 'justify-between'} gap-4 pt-4`}>
            <Button
              variant="outline"
              onClick={onPrevious}
              disabled={currentStep === 1}
              className="w-full md:w-auto"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Précédent
            </Button>
            <Button
              onClick={onNext}
              disabled={!answers[currentQuestion.id] || isSubmitting}
              className="w-full md:w-auto"
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