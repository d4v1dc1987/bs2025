import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export type PostType = {
  id: string;
  label: string;
  description: string;
  hasCustomFields?: boolean;
};

const postTypes: PostType[] = [
  {
    id: "ideas",
    label: "Idées de publications",
    description: "Booste l'engagement avec des idées de contenu novatrices. Provoque l'intérêt et l'action parmi ton audience, en transformant chaque post en une opportunité d'interaction.",
  },
  {
    id: "motivational-quotes",
    label: "Citations motivantes",
    description: "Booste le moral de ton audience avec des citations qui inspirent l'action. Chaque mot compte pour motiver et pousser tes followers vers le haut.",
  },
  {
    id: "funny-quotes",
    label: "Citations humoristiques",
    description: "Illumine la journée de ton audience avec de l'humour piquant. Des citations amusantes qui détendent et créent un lien de complicité.",
  },
  {
    id: "engagement-questions",
    label: "Questions d'engagement",
    description: "Provoque la pensée et le dialogue avec des questions engageantes. Encourage tes followers à partager, débattre et connecter.",
  },
  {
    id: "behind-scenes",
    label: "Behind the scenes",
    description: "Partage tes 'Behind the Scenes' pour inspirer et montrer le vrai toi. Laisse ton audience découvrir le leader en toi, dans chaque moment authentique.",
    hasCustomFields: true,
  },
  // ... Nous ajouterons les autres types progressivement
];

interface PostTypeSelectProps {
  value?: string;
  onValueChange: (value: string) => void;
}

export const PostTypeSelect = ({ value, onValueChange }: PostTypeSelectProps) => {
  return (
    <Select value={value} onValueChange={onValueChange}>
      <SelectTrigger className="w-full">
        <SelectValue placeholder="Sélectionne un type de publication" />
      </SelectTrigger>
      <SelectContent>
        {postTypes.map((type) => (
          <SelectItem key={type.id} value={type.id}>
            {type.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};

export const getPostTypeById = (id: string): PostType | undefined => {
  return postTypes.find(type => type.id === id);
};