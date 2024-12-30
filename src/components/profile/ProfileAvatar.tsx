import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Pencil, User } from "lucide-react";

interface ProfileAvatarProps {
  avatarUrl?: string | null;
  isLoading: boolean;
  onAvatarChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  initials: string;
}

export const ProfileAvatar = ({
  avatarUrl,
  isLoading,
  onAvatarChange,
  initials,
}: ProfileAvatarProps) => {
  return (
    <div className="relative flex justify-center">
      <div className="relative inline-block">
        <Avatar className="h-32 w-32 ring-2 ring-primary/20 ring-offset-2 ring-offset-background">
          <AvatarImage 
            src={avatarUrl || undefined} 
            alt="Photo de profil"
            className="object-cover w-full h-full"
          />
          <AvatarFallback className="bg-primary/10 text-primary text-2xl">
            {avatarUrl ? initials : <User className="h-12 w-12" />}
          </AvatarFallback>
        </Avatar>
        <Label
          htmlFor="avatar"
          className="absolute bottom-0 right-0 p-2 bg-primary text-white rounded-full cursor-pointer hover:bg-primary/90 transition-colors shadow-lg"
        >
          <Pencil className="h-4 w-4" />
        </Label>
        <Input
          id="avatar"
          type="file"
          accept="image/*"
          className="hidden"
          onChange={onAvatarChange}
          disabled={isLoading}
        />
      </div>
    </div>
  );
};