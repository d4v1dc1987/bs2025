import { useState } from "react";
import { Send, Copy, CalendarDays, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PostTypeSelect, getPostTypeById } from "./PostTypeSelect";
import { Card } from "@/components/ui/card";
import { toast } from "sonner";

export const PostGenerator = () => {
  const [selectedType, setSelectedType] = useState<string>();
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedContent, setGeneratedContent] = useState<string>();
  const [hasHistory, setHasHistory] = useState(false);

  const selectedPostType = selectedType ? getPostTypeById(selectedType) : undefined;

  const handleGenerate = async () => {
    if (!selectedType) return;
    
    setIsGenerating(true);
    try {
      // Temporairement, on simule la génération
      await new Promise(resolve => setTimeout(resolve, 2000));
      setGeneratedContent("Voici un exemple de contenu généré pour votre publication Facebook ! 🎉");
      setHasHistory(true);
    } catch (error) {
      console.error("Erreur lors de la génération:", error);
      toast.error("Une erreur est survenue lors de la génération");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCopy = () => {
    if (!generatedContent) return;
    
    navigator.clipboard.writeText(generatedContent);
    toast.success("Texte copié !");
  };

  const handleSchedule = () => {
    // À implémenter plus tard
    toast.info("Fonctionnalité à venir !");
  };

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      {/* Section Résultat */}
      <div className="space-y-4">
        <Card className="p-6 min-h-[300px] bg-card/50 backdrop-blur-sm">
          {generatedContent ? (
            <div className="space-y-4">
              <p className="whitespace-pre-wrap">{generatedContent}</p>
              <div className="flex gap-2">
                <Button onClick={handleCopy} variant="secondary" size="sm">
                  <Copy className="w-4 h-4 mr-2" />
                  Copier le texte
                </Button>
                <Button onClick={handleSchedule} variant="secondary" size="sm">
                  <CalendarDays className="w-4 h-4 mr-2" />
                  Programmer
                </Button>
              </div>
              {hasHistory && (
                <div className="flex gap-2 mt-4">
                  <Button variant="outline" size="sm">
                    <ChevronLeft className="w-4 h-4 mr-2" />
                    Précédent
                  </Button>
                  <Button variant="outline" size="sm">
                    Suivant
                    <ChevronRight className="w-4 h-4 ml-2" />
                  </Button>
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center justify-center h-full text-muted-foreground">
              Sélectionne un type de publication pour commencer
            </div>
          )}
        </Card>
      </div>

      {/* Section Options */}
      <div className="space-y-6">
        <div>
          <h2 className="text-lg font-semibold mb-2">Choisis un type de publications</h2>
          <PostTypeSelect 
            value={selectedType}
            onValueChange={setSelectedType}
          />
        </div>

        {selectedPostType && (
          <div className="space-y-4">
            <p className="text-muted-foreground">
              {selectedPostType.description}
            </p>
            
            <Button
              onClick={handleGenerate}
              disabled={isGenerating}
              className="w-full"
            >
              <Send className="w-4 h-4 mr-2" />
              {generatedContent ? "Générer une autre publication" : "Générer une publication"}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};