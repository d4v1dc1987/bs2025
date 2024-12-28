import { useAuth } from "@/hooks/useAuth";

const Profile = () => {
  const { user } = useAuth();

  return (
    <div className="container py-8">
      <h1 className="text-2xl font-bold mb-4">Mon profil</h1>
      <div className="bg-card p-6 rounded-lg">
        <p className="text-lg">Email : {user?.email}</p>
      </div>
    </div>
  );
};

export default Profile;