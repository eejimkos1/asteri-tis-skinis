import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface Particle {
  id: number;
  x: number;
  angle: number;
  distance: number;
  emoji: string;
  rotation: number;
  scale: number;
  delay: number;
}

const CONFETTI_EMOJIS = ['⭐', '💖', '🎵', '✨', '💫', '🌟', '🎶', '💜', '🩷', '🥳', '💎', '🦋'];

interface ConfettiProps {
  active: boolean;
  count?: number;
}

export function Confetti({ active, count = 40 }: ConfettiProps) {
  const [particles, setParticles] = useState<Particle[]>([]);

  useEffect(() => {
    if (active) {
      const newParticles: Particle[] = Array.from({ length: count }).map((_, i) => ({
        id: Date.now() + i,
        x: 50,
        angle: (i / count) * 360 + Math.random() * 20,
        distance: 100 + Math.random() * 200,
        emoji: CONFETTI_EMOJIS[Math.floor(Math.random() * CONFETTI_EMOJIS.length)],
        rotation: Math.random() * 720 - 360,
        scale: 0.6 + Math.random() * 0.8,
        delay: Math.random() * 0.2,
      }));
      setParticles(newParticles);
      setTimeout(() => setParticles([]), 2500);
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
        {particles.map(p => {
          const rad = (p.angle * Math.PI) / 180;
          const endX = Math.cos(rad) * p.distance;
          const endY = Math.sin(rad) * p.distance;
          return (
            <motion.span
              key={p.id}
              initial={{
                left: '50%',
                top: '50%',
                scale: 0,
                rotate: 0,
                x: 0,
                y: 0,
                position: 'absolute',
                opacity: 1,
              }}
              animate={{
                x: endX,
                y: endY,
                scale: [0, p.scale * 1.3, p.scale, 0],
                rotate: p.rotation,
                opacity: [0, 1, 1, 0],
              }}
              exit={{ opacity: 0, scale: 0 }}
              transition={{ duration: 1.8, ease: 'easeOut', delay: p.delay }}
              style={{
                fontSize: `${18 + p.scale * 10}px`,
                position: 'absolute',
                filter: 'drop-shadow(0 0 4px rgba(255, 200, 255, 0.5))',
              }}
            >
              {p.emoji}
            </motion.span>
          );
        })}
      </AnimatePresence>
    </div>
  );
}
