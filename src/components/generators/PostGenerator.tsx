import { useState, useEffect } from "react";
import { Send, Copy, CalendarDays, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PostTypeSelect, getPostTypeById } from "./PostTypeSelect";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { createPromptWithUserContext } from "./types/postTypes";

export const PostGenerator = () => {
  const [selectedType, setSelectedType] = useState<string>();
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedContent, setGeneratedContent] = useState<string>();
  const [hasHistory, setHasHistory] = useState(false);
  const [customFieldValues, setCustomFieldValues] = useState<Record<string, string>>({});
  const [aiPersonalitySummary, setAiPersonalitySummary] = useState<string | null>(null);
  const [aiBusinessSummary, setAiBusinessSummary] = useState<string | null>(null);

  const selectedPostType = selectedType ? getPostTypeById(selectedType) : undefined;

  useEffect(() => {
    const fetchUserSummaries = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        const [{ data: onboardingData }, { data: businessData }] = await Promise.all([
          supabase.from('onboarding').select('ai_summary').eq('id', user.id).single(),
          supabase.from('business_profiles').select('ai_summary').eq('id', user.id).single()
        ]);

        setAiPersonalitySummary(onboardingData?.ai_summary || null);
        setAiBusinessSummary(businessData?.ai_summary || null);
      } catch (error) {
        console.error("Error fetching user summaries:", error);
      }
    };

    fetchUserSummaries();
  }, []);

  const handleGenerate = async () => {
    if (!selectedType || !selectedPostType) return;
    
    setIsGenerating(true);
    try {
      let basePrompt = selectedPostType.prompt;
      
      // Add custom field values to the prompt if they exist
      if (selectedPostType.customFields) {
        const fieldValues = selectedPostType.customFields
          .map(field => customFieldValues[field.name])
          .filter(Boolean);
        
        if (fieldValues.length > 0) {
          basePrompt += " " + fieldValues.join(" ");
        }
      }

      const prompt = createPromptWithUserContext(
        basePrompt,
        aiPersonalitySummary,
        aiBusinessSummary
      );

      // Store the prompt in localStorage with timestamp
      const promptEntry = {
        prompt,
        timestamp: new Date().toISOString()
      };
      const storedPrompts = localStorage.getItem('aiPrompts');
      const prompts = storedPrompts ? JSON.parse(storedPrompts) : [];
      prompts.unshift(promptEntry); // Add new prompt at the beginning
      localStorage.setItem('aiPrompts', JSON.stringify(prompts.slice(0, 100))); // Keep last 100 prompts

      // Dispatch event to notify PromptViewer
      window.dispatchEvent(new Event('aiPromptAdded'));

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