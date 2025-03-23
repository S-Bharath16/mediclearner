
import { Link } from "react-router-dom";
import { LucideIcon } from "lucide-react";

interface ServiceCardProps {
  title: string;
  description: string;
  icon: LucideIcon;
  path: string;
}

const ServiceCard = ({ title, description, icon: Icon, path }: ServiceCardProps) => {
  return (
    <Link to={path} className="block">
      <div className="card-hover h-full rounded-xl border border-border/50 bg-white p-6 transition-all shadow-sm">
        <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-medical-50">
          <Icon className="h-7 w-7 text-medical-600" />
        </div>
        <h3 className="text-lg font-semibold tracking-tight mb-2">{title}</h3>
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>
    </Link>
  );
};

export default ServiceCard;
