import { useState } from "react";
import { Send, Copy, CalendarDays, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PostTypeSelect, getPostTypeById } from "./PostTypeSelect";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

// Créer un événement personnalisé
const PROMPT_ADDED_EVENT = 'PROMPT_ADDED';
const promptEvent = new Event(PROMPT_ADDED_EVENT);

export const PostGenerator = () => {
  const [selectedType, setSelectedType] = useState<string>();
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedContent, setGeneratedContent] = useState<string>();
  const [hasHistory, setHasHistory] = useState(false);
  const [customFieldValues, setCustomFieldValues] = useState<Record<string, string>>({});

  const selectedPostType = selectedType ? getPostTypeById(selectedType) : undefined;

  const handleGenerate = async () => {
    if (!selectedType || !selectedPostType) return;
    
    setIsGenerating(true);
    try {
      let prompt = selectedPostType.prompt;
      
      if (selectedPostType.customFields) {
        const fieldValues = selectedPostType.customFields
          .map(field => customFieldValues[field.name])
          .filter(Boolean);
        
        if (fieldValues.length > 0) {
          prompt += " " + fieldValues.join(" ");
        }
      }

      // Ajout des logs pour voir le prompt exact
      console.log('Type de post sélectionné:', selectedPostType.label);
      console.log('Prompt de base:', selectedPostType.prompt);
      console.log('Valeurs des champs personnalisés:', customFieldValues);
      console.log('Prompt final envoyé à OpenAI:', prompt);

      // Store the prompt in localStorage and trigger custom event
      const promptEntry = {
        prompt,
        timestamp: new Date().toISOString()
      };
      const storedPrompts = localStorage.getItem('aiPrompts');
      const prompts = storedPrompts ? JSON.parse(storedPrompts) : [];
      prompts.unshift(promptEntry);
      localStorage.setItem('aiPrompts', JSON.stringify(prompts.slice(0, 100)));
      
      // Dispatch custom event
      window.dispatchEvent(promptEvent);
      console.log('Prompt event dispatched:', PROMPT_ADDED_EVENT);

      const { data, error } = await supabase.functions.invoke("generate-with-ai", {
        body: { prompt }
      });

      if (error) throw error;

      setGeneratedContent(data.generatedText);
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

  const handleCustomFieldChange = (name: string, value: string) => {
    setCustomFieldValues(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      {/* Section Options */}
      <div className="space-y-6">
        <div>
          <h2 className="text-lg font-semibold mb-2">Choisis un type de publication</h2>
          <p className="text-sm text-muted-foreground mb-4">
            Quel type de post veux-tu faire?
          </p>
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

            {selectedPostType.customFields && (
              <div className="space-y-4">
                {selectedPostType.customFields.map((field) => (
                  <div key={field.name} className="space-y-2">
                    <label className="text-sm font-medium">
                      {field.label}
                    </label>
                    {field.type === 'textarea' ? (
                      <Textarea
                        placeholder={field.placeholder}
                        value={customFieldValues[field.name] || ''}
                        onChange={(e) => handleCustomFieldChange(field.name, e.target.value)}
                      />
                    ) : (
                      <Input
                        type="text"
                        placeholder={field.placeholder}
                        value={customFieldValues[field.name] || ''}
                        onChange={(e) => handleCustomFieldChange(field.name, e.target.value)}
                      />
                    )}
                  </div>
                ))}
              </div>
            )}
            
            <Button
              onClick={handleGenerate}
              disabled={isGenerating}
              className="w-full bg-primary hover:bg-primary/90"
            >
              <Send className="w-4 h-4 mr-2" />
              {isGenerating ? "Génération en cours..." : (generatedContent ? "Générer une autre publication" : "Générer une publication")}
            </Button>
          </div>
        )}
      </div>

      {/* Section Résultat */}
      <div className="space-y-4">
        <Card className="p-6 min-h-[300px] bg-card/50 backdrop-blur-sm border-muted">
          {generatedContent ? (
            <div className="space-y-4">
              <h3 className="font-medium">Résultat:</h3>
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
    </div>
  );
};