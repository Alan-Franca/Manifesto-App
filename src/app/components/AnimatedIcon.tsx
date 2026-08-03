import {
  Home,
  User,
  ShieldCheck,
  Search,
  X,
  Trash2,
  SquarePen,
  Plus,
  Calendar,
  BookOpen,
  Trophy,
  Sparkles,
  Clock,
  Tag,
  Camera,
  Globe,
  Moon,
  Sun,
  LogOut,
  Crown,
  Newspaper,
  Users,
  Filter,
  ArrowLeft,
  Compass,
  HelpCircle,
  Film,
  Briefcase,
  Brain,
  Lightbulb
} from 'lucide-react';

const iconMap = {
  home: Home,
  user: User,
  admin: ShieldCheck,
  search: Search,
  close: X,
  trash: Trash2,
  edit: SquarePen,
  plus: Plus,
  calendar: Calendar,
  book: BookOpen,
  award: Trophy,
  sparkles: Sparkles,
  clock: Clock,
  tag: Tag,
  camera: Camera,
  globe: Globe,
  moon: Moon,
  sun: Sun,
  logout: LogOut,
  crown: Crown,
  newspaper: Newspaper,
  users: Users,
  filter: Filter,
  arrowLeft: ArrowLeft,
  compass: Compass,
  help: HelpCircle,
  theater: Film,
  briefcase: Briefcase,
  brain: Brain,
  lightbulb: Lightbulb,
};

interface AnimatedIconProps {
  icon: keyof typeof iconMap;
  trigger?: string;
  size?: number;
  className?: string;
  colors?: string;
}

export function AnimatedIcon({ 
  icon, 
  size = 24, 
  className = ''
}: AnimatedIconProps) {
  const IconComponent = iconMap[icon] || Home;

  return (
    <IconComponent 
      size={size} 
      className={`inline-block shrink-0 stroke-[2] ${className}`} 
    />
  );
}
