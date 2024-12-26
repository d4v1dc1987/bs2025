import { Crown } from "lucide-react";

export const Logo = () => {
  return (
    <div className="flex items-center gap-2 text-primary">
      <Crown className="w-8 h-8" />
      <span className="text-xl font-bold">Bobby Social</span>
    </div>
  );
};