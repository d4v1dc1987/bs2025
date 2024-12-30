import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Loader2, Pencil } from "lucide-react";

interface AIProfileReviewProps {
  isGenerating: boolean;
  progress: number;
  generatedProfile: string | null;
  onEdit: () => void;
  onConfirm: (profile: string) => void;
}

export const AIProfileReview = ({
  isGenerating,
  progress,
  generatedProfile,
  onEdit,
  onConfirm
}: AIProfileReviewProps) => {
  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>
          {isGenerating ? "Configuration de votre profil..." : "Votre profil personnalisé"}
        </CardTitle>
        <CardDescription>
          {isGenerating 
            ? "Bobby Social analyse vos réponses pour créer votre profil personnalisé" 
            : "Voici le profil que Bobby Social a créé pour vous. Vous pouvez le modifier si nécessaire."}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {isGenerating ? (
          <div className="space-y-4 py-8">
            <Progress value={progress} className="w-full" />
            <p className="text-center text-sm text-muted-foreground">
              {progress < 100 
                ? "Analyse de vos réponses en cours..." 
                : "Génération de votre profil..."}
            </p>
          </div>
        ) : generatedProfile ? (
          <>
            <div className="whitespace-pre-line bg-background/5 p-4 rounded-lg">
              {generatedProfile}
            </div>
            <div className="flex flex-col md:flex-row gap-4">
              <Button
                variant="outline"
                onClick={onEdit}
                className="w-full md:w-auto"
              >
                <Pencil className="w-4 h-4 mr-2" />
                Modifier mes réponses
              </Button>
              <Button
                onClick={() => onConfirm(generatedProfile)}
                className="w-full md:w-auto"
              >
                Confirmer mon profil
              </Button>
            </div>
          </>
        ) : (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="w-8 h-8 animate-spin" />
          </div>
        )}
      </CardContent>
    </Card>
  );
};