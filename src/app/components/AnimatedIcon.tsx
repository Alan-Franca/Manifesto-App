import React from 'react';

interface AnimatedIconProps {
  icon: keyof typeof iconUrls;
  trigger?: 'hover' | 'loop' | 'loop-on-hover' | 'click' | 'morph' | 'boomerang';
  size?: number;
  className?: string;
  colors?: string; // e.g. "primary:#003049,secondary:#540B0E"
}

// Icons8 Lottie Animated Icons (Color style) CDN links
const iconUrls = {
  home: 'https://cdn.lordicon.com/etqbfrgp.json',
  user: 'https://cdn.lordicon.com/dqxvvqzi.json',
  admin: 'https://cdn.lordicon.com/orozeuqy.json', // Shield/Admin
  search: 'https://cdn.lordicon.com/msoeawqm.json',
  close: 'https://cdn.lordicon.com/nhfyxkry.json',
  trash: 'https://cdn.lordicon.com/gsqxdxog.json',
  edit: 'https://cdn.lordicon.com/wloilxuq.json',
  plus: 'https://cdn.lordicon.com/oegrrwyk.json',
  calendar: 'https://cdn.lordicon.com/qvyppzqz.json',
  book: 'https://cdn.lordicon.com/wxnxiano.json',
  award: 'https://cdn.lordicon.com/lupuorrc.json',
  sparkles: 'https://cdn.lordicon.com/hnidwncw.json',
  clock: 'https://cdn.lordicon.com/kbtmbyzq.json',
  tag: 'https://cdn.lordicon.com/cllunfud.json',
  camera: 'https://cdn.lordicon.com/mxddzdmt.json',
  globe: 'https://cdn.lordicon.com/yxyampru.json',
  moon: 'https://cdn.lordicon.com/pndmwjzb.json',
  sun: 'https://cdn.lordicon.com/tedxcioy.json',
  logout: 'https://cdn.lordicon.com/hcuxgjjx.json',
  crown: 'https://cdn.lordicon.com/lmjldwqd.json',
  newspaper: 'https://cdn.lordicon.com/wxnxiano.json', // Map to working Book Lottie
  users: 'https://cdn.lordicon.com/dxjqoygy.json',
  filter: 'https://cdn.lordicon.com/oncyjozz.json', // Map to working Settings Lottie
  arrowLeft: 'https://cdn.lordicon.com/zmkotitn.json',
  compass: 'https://cdn.lordicon.com/mrdniesz.json',
  help: 'https://cdn.lordicon.com/wxnxiano.json',
  theater: 'https://cdn.lordicon.com/lupuorrc.json', // Map to working Award/Trophy Lottie
  briefcase: 'https://cdn.lordicon.com/dxjqoygy.json', // Map to working Users Lottie
  brain: 'https://cdn.lordicon.com/oncyjozz.json', // Map to working Settings Lottie
  lightbulb: 'https://cdn.lordicon.com/yxyampru.json', // Map to working Globe Lottie
};

export function AnimatedIcon({ 
  icon, 
  trigger = 'hover', 
  size = 24, 
  className = '',
  colors
}: AnimatedIconProps) {
  const src = iconUrls[icon] || iconUrls.home;

  // Primary: deep navy (#003049), Secondary: wine red (#540B0E) - Default Manifesto brand colors
  // These are overridable via the colors prop if needed
  const defaultColors = 'primary:#003049,secondary:#540B0E';

  return (
    <lord-icon
      src={src}
      trigger={trigger}
      colors={colors || defaultColors}
      style={{ width: `${size}px`, height: `${size}px` }}
      className={className}
    />
  );
}
