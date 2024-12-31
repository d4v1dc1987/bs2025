import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { supabase } from "@/integrations/supabase/client";

const PromptViewer = () => {
  const [prompts, setPrompts] = useState<{ prompt: string; timestamp: string }[]>([]);

  useEffect(() => {
    // Subscribe to changes in localStorage
    const handleStorageChange = () => {
      const storedPrompts = localStorage.getItem('aiPrompts');
      if (storedPrompts) {
        setPrompts(JSON.parse(storedPrompts));
      }
    };

    // Initial load
    handleStorageChange();

    // Listen for changes
    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('aiPromptAdded', handleStorageChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('aiPromptAdded', handleStorageChange);
    };
  }, []);

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
            {prompts.map((entry, index) => (
              <div key={index} className="mb-6 last:mb-0">
                <div className="text-sm text-muted-foreground mb-2">
                  {new Date(entry.timestamp).toLocaleString()}
                </div>
                <div className="whitespace-pre-wrap bg-muted p-4 rounded-md">
                  {entry.prompt}
                </div>
              </div>
            ))}
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  );
};

export default PromptViewer;