import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { postTypes } from "./data/postTypeDefinitions";
export { getPostTypeById } from "./data/postTypeDefinitions";
export type { PostType } from "./types/postTypes";

interface PostTypeSelectProps {
  value?: string;
  onValueChange: (value: string) => void;
}

export const PostTypeSelect = ({ value, onValueChange }: PostTypeSelectProps) => {
  return (
    <Select value={value} onValueChange={onValueChange}>
      <SelectTrigger className="w-full bg-card border-muted">
        <SelectValue placeholder="Choisis un type de post" />
      </SelectTrigger>
      <SelectContent>
        {postTypes.map((type) => (
          <SelectItem 
            key={type.id} 
            value={type.id}
            className="flex items-center gap-2"
          >
            <span className="flex items-center gap-2">
              {type.icon}
              {type.label}
            </span>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};