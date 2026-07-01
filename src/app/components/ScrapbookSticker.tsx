import React from 'react';
import { AnimatedIcon } from './AnimatedIcon';

interface ScrapbookStickerProps {
  category: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  hasTape?: boolean;
}

export function ScrapbookSticker({ category, size = 'md', className = '', hasTape = true }: ScrapbookStickerProps) {
  // Get matching icon and color scheme based on category text
  const getCategoryDetails = () => {
    // Clean string from any emojis to check keywords
    const cleanName = category.replace(/[\uD800-\uDFFF\u2600-\u27BF]/g, '').trim().toUpperCase();

    if (cleanName.includes('TECNOLOGIA')) {
      return { iconName: 'brain' as const, color: '#0284c7', bgColor: 'bg-[#f0f9ff]', rotate: '-3deg' };
    }
    if (cleanName.includes('TRABALHO')) {
      return { iconName: 'briefcase' as const, color: '#b45309', bgColor: 'bg-[#fffbeb]', rotate: '2deg' };
    }
    if (cleanName.includes('CULTURA')) {
      return { iconName: 'theater' as const, color: '#7c3aed', bgColor: 'bg-[#faf5ff]', rotate: '-2deg' };
    }
    if (cleanName.includes('EXPLICA') || cleanName.includes('EXPLICAÇÕES')) {
      return { iconName: 'lightbulb' as const, color: '#d97706', bgColor: 'bg-[#fef3c7]', rotate: '4deg' };
    }
    if (cleanName.includes('SOCIEDADE')) {
      return { iconName: 'users' as const, color: '#059669', bgColor: 'bg-[#ecfdf5]', rotate: '-4deg' };
    }
    if (cleanName.includes('NOTÍCIAS') || cleanName.includes('NOTICIAS')) {
      return { iconName: 'newspaper' as const, color: '#e11d48', bgColor: 'bg-[#fff1f2]', rotate: '3deg' };
    }

    return { iconName: 'help' as const, color: '#475569', bgColor: 'bg-slate-50', rotate: '1deg' };
  };

  const { iconName, color, bgColor, rotate } = getCategoryDetails();

  const sizeClasses = {
    sm: 'w-7 h-7 rounded-lg text-xs border border-slate-200 shadow-sm',
    md: 'w-11 h-11 rounded-xl text-base border-2 border-slate-200 shadow-md',
    lg: 'w-14 h-14 rounded-2xl text-xl border-3 border-slate-200 shadow-lg'
  };

  const iconSizes = {
    sm: 16,
    md: 22,
    lg: 28
  };

  const rotationStyle = {
    transform: `rotate(${rotate})`,
  };

  return (
    <div 
      style={rotationStyle} 
      className={`relative inline-flex items-center justify-center bg-white ${bgColor} select-none transition-all duration-300 hover:scale-110 hover:-translate-y-0.5 cursor-pointer border border-dashed border-slate-300 flex-shrink-0 ${sizeClasses[size]} ${className}`}
    >
      {/* Tape Overlay */}
      {hasTape && (
        <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-6 h-2.5 bg-yellow-100/50 border-l border-r border-dashed border-yellow-300/40 rotate-[-4deg] shadow-sm pointer-events-none" />
      )}
      <AnimatedIcon 
        icon={iconName} 
        size={iconSizes[size]} 
        colors={`primary:${color},secondary:#475569`} 
      />
    </div>
  );
}
