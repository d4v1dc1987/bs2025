import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { passwordSchema, type PasswordFormValues } from "@/schemas/passwordSchema";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

interface SecurityFormProps {
  isLoading: boolean;
  onSubmit: (values: PasswordFormValues) => void;
}

export const SecurityForm = ({ isLoading, onSubmit }: SecurityFormProps) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<PasswordFormValues>({
    resolver: zodResolver(passwordSchema),
  });

  const onSubmitForm = async (values: PasswordFormValues) => {
    await onSubmit(values);
    reset();
  };

  return (
    <form onSubmit={handleSubmit(onSubmitForm)} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="password" className="text-[#c299ff]">
          Nouveau mot de passe
        </Label>
        <Input
          id="password"
          type="password"
          {...register("password")}
          className="bg-background/50 border-foreground/20"
        />
        {errors.password && (
          <p className="text-sm text-red-500">{errors.password.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="confirmPassword" className="text-[#c299ff]">
          Confirmer le mot de passe
        </Label>
        <Input
          id="confirmPassword"
          type="password"
          {...register("confirmPassword")}
          className="bg-background/50 border-foreground/20"
        />
        {errors.confirmPassword && (
          <p className="text-sm text-red-500">{errors.confirmPassword.message}</p>
        )}
      </div>

      <div className="flex justify-center w-full">
        <Button
          type="submit"
          disabled={isLoading}
          className="bg-primary hover:bg-primary/90 w-full md:w-auto"
        >
          {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Mettre à jour le mot de passe
        </Button>
      </div>
    </form>
  );
};