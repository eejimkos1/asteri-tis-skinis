import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface Particle {
  id: number;
  x: number;
  y: number;
  emoji: string;
  rotation: number;
  scale: number;
}

const CONFETTI_EMOJIS = ['⭐', '💖', '🎵', '✨', '💫', '🌟', '🎶', '💜', '🩷', '🥳'];

interface ConfettiProps {
  active: boolean;
  count?: number;
}

export function Confetti({ active, count = 30 }: ConfettiProps) {
  const [particles, setParticles] = useState<Particle[]>([]);

  useEffect(() => {
    if (active) {
      const newParticles: Particle[] = Array.from({ length: count }).map((_, i) => ({
        id: Date.now() + i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        emoji: CONFETTI_EMOJIS[Math.floor(Math.random() * CONFETTI_EMOJIS.length)],
        rotation: Math.random() * 360,
        scale: 0.5 + Math.random() * 1,
      }));
      setParticles(newParticles);
      setTimeout(() => setParticles([]), 2000);
    }
  }, [active, count]);

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      pointerEvents: 'none',
      zIndex: 1000,
      overflow: 'hidden',
    }}>
      <AnimatePresence>
        {particles.map(p => (
          <motion.span
            key={p.id}
            initial={{
              left: `${p.x}%`,
              top: '50%',
              scale: 0,
              rotate: 0,
              position: 'absolute',
            }}
            animate={{
              top: `${p.y}%`,
              scale: p.scale,
              rotate: p.rotation,
              opacity: [0, 1, 1, 0],
            }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.5, ease: 'easeOut' }}
            style={{ fontSize: '24px', position: 'absolute' }}
          >
            {p.emoji}
          </motion.span>
        ))}
      </AnimatePresence>
    </div>
  );
}
