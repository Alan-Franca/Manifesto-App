import {
  FcHome,
  FcManager,
  FcPrivacy,
  FcSearch,
  FcCancel,
  FcEmptyTrash,
  FcDocument,
  FcPlus,
  FcCalendar,
  FcReading,
  FcIcons8Cup,
  FcFlashOn,
  FcClock,
  FcBookmark,
  FcCamera,
  FcGlobe,
  FcNightLandscape,
  FcIdea,
  FcLeave,
  FcVip,
  FcNews,
  FcConferenceCall,
  FcEmptyFilter,
  FcLeft,
  FcBinoculars,
  FcQuestions,
  FcClapperboard,
  FcBriefcase,
  FcMindMap
} from 'react-icons/fc';

const iconMap = {
  home: FcHome,
  user: FcManager,
  admin: FcPrivacy,
  search: FcSearch,
  close: FcCancel,
  trash: FcEmptyTrash,
  edit: FcDocument,
  plus: FcPlus,
  calendar: FcCalendar,
  book: FcReading,
  award: FcIcons8Cup,
  sparkles: FcFlashOn,
  clock: FcClock,
  tag: FcBookmark,
  camera: FcCamera,
  globe: FcGlobe,
  moon: FcNightLandscape,
  sun: FcIdea,
  logout: FcLeave,
  crown: FcVip,
  newspaper: FcNews,
  users: FcConferenceCall,
  filter: FcEmptyFilter,
  arrowLeft: FcLeft,
  compass: FcBinoculars,
  help: FcQuestions,
  theater: FcClapperboard,
  briefcase: FcBriefcase,
  brain: FcMindMap,
  lightbulb: FcIdea,
};

interface AnimatedIconProps {
  icon: keyof typeof iconMap;
  trigger?: 'hover' | 'loop' | 'loop-on-hover' | 'click' | 'morph' | 'boomerang';
  size?: number;
  className?: string;
  colors?: string; // Kept for interface compatibility but ignored as Fc icons are pre-colored
}

export function AnimatedIcon({ 
  icon, 
  size = 24, 
  className = ''
}: AnimatedIconProps) {
  const IconComponent = iconMap[icon] || FcHome;

  return (
    <IconComponent 
      style={{ width: `${size}px`, height: `${size}px` }} 
      className={`inline-block shrink-0 ${className}`} 
    />
  );
}
