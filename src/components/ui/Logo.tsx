import { Zap } from "lucide-react";
import { Link } from "react-router-dom";

export const Logo = () => {
  return (
    <Link to="/" className="flex items-center gap-2">
      <Zap className="w-8 h-8 text-yellow-400" />
      <span className="text-xl font-bold text-foreground">Bobby Social</span>
    </Link>
  );
};