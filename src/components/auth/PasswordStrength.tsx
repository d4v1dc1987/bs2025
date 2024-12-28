import { cn } from "@/lib/utils";

interface PasswordStrengthProps {
  password: string;
}

export const PasswordStrength = ({ password }: PasswordStrengthProps) => {
  const getStrength = (password: string) => {
    let strength = 0;
    if (password.length >= 8) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/[a-z]/.test(password)) strength++;
    if (/[0-9]/.test(password)) strength++;
    if (/[^A-Za-z0-9]/.test(password)) strength++;
    return strength;
  };

  const strength = getStrength(password);

  return (
    <div className="space-y-2">
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((level) => (
          <div
            key={level}
            className={cn(
              "h-2 w-full rounded-full",
              level <= strength
                ? strength <= 2
                  ? "bg-red-500"
                  : strength <= 3
                  ? "bg-yellow-500"
                  : "bg-green-500"
                : "bg-gray-200"
            )}
          />
        ))}
      </div>
      <p className="text-sm text-muted-foreground">
        {strength <= 2
          ? "Mot de passe faible"
          : strength <= 3
          ? "Mot de passe moyen"
          : "Mot de passe fort"}
      </p>
    </div>
  );
};