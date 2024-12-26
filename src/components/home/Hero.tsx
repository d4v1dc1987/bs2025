import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

export const Hero = () => {
  return (
    <div className="py-20 text-center">
      <h1 className="text-5xl font-bold mb-6">
        Boostez votre présence sur{" "}
        <span className="text-primary">Facebook</span>
      </h1>
      <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
        Bobby Social est votre copilote marketing intelligent pour générer plus
        d'engagement, de conversations et de ventes sur Facebook.
      </p>
      <Link
        to="/generator"
        className="inline-flex items-center gap-2 bg-primary text-white px-6 py-3 rounded-lg hover:bg-primary-hover transition-colors"
      >
        Commencer maintenant
        <ArrowRight className="w-5 h-5" />
      </Link>
    </div>
  );
};