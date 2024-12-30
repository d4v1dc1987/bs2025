import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import { Check, Edit } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

interface AIProfileReviewProps {
  isGenerating: boolean;
  progress: number;
  generatedProfile: string | null;
  onEdit: () => void;
  onConfirm: (profile: string) => Promise<void>;
}

export const AIProfileReview = ({ 
  isGenerating, 
  progress, 
  generatedProfile, 
  onEdit,
  onConfirm 
}: AIProfileReviewProps) => {
  const [editedProfile, setEditedProfile] = useState(generatedProfile || "");
  const [isSaving, setIsSaving] = useState(false);

  const handleConfirm = async () => {
    try {
      setIsSaving(true);
      await onConfirm(editedProfile);
      toast.success("Profil enregistré avec succès! Vous pouvez le modifier à tout moment depuis votre profil.");
    } catch (error) {
      console.error('Error saving profile:', error);
      toast.error("Erreur lors de l'enregistrement du profil");
    } finally {
      setIsSaving(false);
    }
  };

  if (isGenerating) {
    return (
      <Card className="w-full max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>Préparation de votre profil</CardTitle>
          <CardDescription>
            Bobby Social analyse vos réponses pour créer votre profil personnalisé...
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Progress value={progress} className="w-full h-2" />
            <p className="text-sm text-muted-foreground text-center">
              {progress < 33 && "Analyse de vos réponses en cours..."}
              {progress >= 33 && progress < 66 && "Création de votre profil personnalisé..."}
              {progress >= 66 && progress < 100 && "Finalisation de votre expérience Bobby Social..."}
              {progress === 100 && "Votre profil est prêt !"}
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!generatedProfile) return null;

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Votre profil Bobby Social</CardTitle>
        <CardDescription>
          Voici votre profil généré par Bobby Social. Vous pouvez le modifier si vous le souhaitez.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <Textarea
          value={editedProfile}
          onChange={(e) => setEditedProfile(e.target.value)}
          className="min-h-[200px]"
          placeholder="Votre profil..."
        />
        <div className="flex justify-between">
          <Button
            variant="outline"
            onClick={onEdit}
            disabled={isSaving}
          >
            <Edit className="w-4 h-4 mr-2" />
            Modifier mes réponses
          </Button>
          <Button
            onClick={handleConfirm}
            disabled={isSaving}
          >
            <Check className="w-4 h-4 mr-2" />
            Confirmer mon profil
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};