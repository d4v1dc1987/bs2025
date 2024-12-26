import { useState } from "react";
import { Send } from "lucide-react";

export const PostGenerator = () => {
  const [topic, setTopic] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // La logique de génération sera ajoutée plus tard
    console.log("Generating post ideas for:", topic);
  };

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold mb-6 text-sidebar-foreground">
        Générateur d'idées de posts
      </h1>
      <p className="text-sidebar-foreground/70 mb-8">
        Décrivez votre sujet ou votre objectif, et laissez Bobby Social vous
        proposer des idées de publications engageantes.
      </p>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="topic" className="block text-sm font-medium text-sidebar-foreground mb-2">
            Sujet ou objectif
          </label>
          <textarea
            id="topic"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            className="w-full p-3 bg-sidebar border border-sidebar-border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary text-sidebar-foreground placeholder:text-sidebar-foreground/50"
            rows={4}
            placeholder="Ex: Je veux promouvoir mon nouveau service de coaching en développement personnel..."
          />
        </div>
        
        <button
          type="submit"
          className="w-full flex items-center justify-center gap-2 bg-primary text-primary-foreground px-6 py-3 rounded-lg hover:bg-primary/90 transition-colors"
        >
          Générer des idées
          <Send className="w-5 h-5" />
        </button>
      </form>
    </div>
  );
};