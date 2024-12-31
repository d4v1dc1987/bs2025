import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";

const PROMPT_ADDED_EVENT = 'PROMPT_ADDED';

const PromptViewer = () => {
  const [prompts, setPrompts] = useState<{ prompt: string; timestamp: string }[]>([]);
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // Redirect to auth only if not authenticated and not loading
    if (!loading && !user) {
      navigate('/auth');
      return;
    }

    // Function to load prompts from localStorage
    const loadPrompts = () => {
      const storedPrompts = localStorage.getItem('aiPrompts');
      if (storedPrompts) {
        try {
          const parsedPrompts = JSON.parse(storedPrompts);
          setPrompts(parsedPrompts);
          console.log('Loaded prompts:', parsedPrompts.length);
        } catch (error) {
          console.error('Error parsing prompts:', error);
        }
      }
    };

    // Load initial prompts
    loadPrompts();

    // Listen for our custom event
    const handlePromptAdded = () => {
      console.log('Prompt added event received');
      loadPrompts();
    };

    window.addEventListener(PROMPT_ADDED_EVENT, handlePromptAdded);

    return () => {
      window.removeEventListener(PROMPT_ADDED_EVENT, handlePromptAdded);
    };
  }, [user, loading, navigate]);

  // Show loading state while checking auth
  if (loading) {
    return (
      <div className="container mx-auto py-8">
        <Card>
          <CardHeader>
            <CardTitle>Chargement...</CardTitle>
          </CardHeader>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8">
      <Card>
        <CardHeader>
          <CardTitle>Historique des Prompts OpenAI</CardTitle>
          <CardDescription>
            Visualisation des prompts exacts envoyés à l'API OpenAI
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[600px] rounded-md border p-4">
            {prompts.length === 0 ? (
              <div className="text-center text-muted-foreground">
                Aucun prompt n'a encore été généré. Générez du contenu pour voir les prompts apparaître ici.
              </div>
            ) : (
              prompts.map((entry, index) => (
                <div key={index} className="mb-6 last:mb-0">
                  <div className="text-sm text-muted-foreground mb-2">
                    {new Date(entry.timestamp).toLocaleString()}
                  </div>
                  <div className="whitespace-pre-wrap bg-muted p-4 rounded-md">
                    {entry.prompt}
                  </div>
                </div>
              ))
            )}
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  );
};

export default PromptViewer;