import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { Button } from './ui/button';
import miau from '../../imports/miau.png';

interface ThumbsUpAnimationProps {
  onComplete: () => void;
}

export function ThumbsUpAnimation({ onComplete }: ThumbsUpAnimationProps) {
  const [showButton, setShowButton] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setShowButton(true), 1500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="fixed inset-0 bg-background flex flex-col items-center justify-center z-50">
      <motion.div
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="mb-8 flex flex-col items-center gap-4"
      >
        <img
          src={miau}
          alt="Miau Thumbs Up"
          className="w-48 h-auto rounded-lg shadow-lg border border-border"
        />
        <span className="script-title text-3xl text-primary mt-2">Miau!</span>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: showButton ? 1 : 0, y: showButton ? 0 : 20 }}
        transition={{ duration: 0.5 }}
      >
        <Button onClick={onComplete} variant="default" className="px-12 py-4 text-lg">
          Explorar
        </Button>
      </motion.div>
    </div>
  );
}
