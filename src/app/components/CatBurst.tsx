import { useEffect, useMemo } from 'react';
import { motion } from 'motion/react';
import miau from '../../imports/miau.png';

interface CatBurstProps {
  onComplete: () => void;
}

export function CatBurst({ onComplete }: CatBurstProps) {
  const cats = useMemo(() => Array.from({ length: 42 }, (_, index) => {
    const column = index % 7;
    const row = Math.floor(index / 7);
    const jitterX = ((index * 37) % 17) - 8;
    const jitterY = ((index * 53) % 15) - 7;

    return {
      id: index,
      left: Math.min(96, Math.max(4, 7 + column * 14.5 + jitterX)),
      top: Math.min(94, Math.max(5, 8 + row * 17 + jitterY)),
      size: 42 + ((index * 19) % 54),
      rotation: ((index * 71) % 260) - 130,
      delay: (index % 9) * 0.025,
      duration: 0.75 + ((index * 11) % 30) / 100,
    };
  }), []);

  useEffect(() => {
    const timer = window.setTimeout(onComplete, 1900);
    return () => window.clearTimeout(timer);
  }, [onComplete]);

  return (
    <div
      className="fixed inset-0 z-[100] overflow-hidden pointer-events-none"
      aria-hidden="true"
    >
      {cats.map(cat => (
        <motion.img
          key={cat.id}
          src={miau}
          alt=""
          className="absolute rounded-xl object-cover shadow-xl"
          style={{
            width: cat.size,
            height: cat.size,
            left: '50%',
            top: '50%',
          }}
          initial={{
            x: '-50%',
            y: '-50%',
            scale: 0,
            rotate: 0,
            opacity: 0,
          }}
          animate={{
            left: `${cat.left}%`,
            top: `${cat.top}%`,
            scale: [0, 1.25, 0.9, 0],
            rotate: cat.rotation,
            opacity: [0, 1, 1, 0],
          }}
          transition={{
            duration: cat.duration,
            delay: cat.delay,
            ease: 'easeOut',
            times: [0, 0.28, 0.72, 1],
          }}
        />
      ))}
    </div>
  );
}
