import { useAuth } from "@/hooks/useAuth";
import { Card } from "@/components/ui/card";

const Profile = () => {
  const { user } = useAuth();

  if (!user) return null;

  return (
    <div className="container py-8">
      <h1 className="text-2xl font-bold mb-4">Mon profil</h1>
      <Card className="p-6">
        <div className="space-y-4">
          <div>
            <h3 className="text-sm font-medium text-muted-foreground">Prénom</h3>
            <p className="text-lg">{user.user_metadata.first_name}</p>
          </div>
          <div>
            <h3 className="text-sm font-medium text-muted-foreground">Nom</h3>
            <p className="text-lg">{user.user_metadata.last_name}</p>
          </div>
          <div>
            <h3 className="text-sm font-medium text-muted-foreground">Email</h3>
            <p className="text-lg">{user.email}</p>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default Profile;