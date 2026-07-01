import React from 'react';

interface ScrapbookFlagProps {
  flag: string;
  rotate?: string;
  className?: string;
}

export function ScrapbookFlag({ flag, rotate = 'random', className = '' }: ScrapbookFlagProps) {
  const getRotation = () => {
    if (rotate !== 'random') return rotate;
    let hash = 0;
    for (let i = 0; i < flag.length; i++) {
      hash = flag.charCodeAt(i) + ((hash << 5) - hash);
    }
    const deg = (hash % 6) - 3; // -3 to 3 degrees
    return `${deg}deg`;
  };

  return (
    <div 
      style={{ transform: `rotate(${getRotation()})` }}
      className={`inline-flex items-center justify-center bg-white border border-slate-300 px-1.5 py-0.5 shadow-sm rounded-md select-none transition-transform hover:scale-110 flex-shrink-0 ${className}`}
    >
      <span className="text-lg leading-none filter drop-shadow-sm">{flag}</span>
    </div>
  );
}
