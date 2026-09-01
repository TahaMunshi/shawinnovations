import {
  Briefcase,
  Cog,
  GraduationCap,
  HeartPulse,
  Hospital,
  Layers,
  LayoutPanelLeft,
  Lightbulb,
  Scale,
  ShieldCheck,
  Stethoscope,
  Users,
  Video,
  type LucideIcon,
} from "lucide-react";

const icons: Record<string, LucideIcon> = {
  stethoscope: Stethoscope,
  hospital: Hospital,
  users: Users,
  layers: Layers,
  cog: Cog,
  "graduation-cap": GraduationCap,
  briefcase: Briefcase,
  "heart-pulse": HeartPulse,
  lightbulb: Lightbulb,
  scale: Scale,
  panel: LayoutPanelLeft,
  shield: ShieldCheck,
  zoom: Video,
};

export function SectionIcon({
  name,
  className = "h-6 w-6",
}: {
  name: string;
  className?: string;
}) {
  const Icon = icons[name] ?? LayoutPanelLeft;
  return <Icon className={className} />;
}
