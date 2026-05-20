import { useState } from 'react';
import { motion } from 'framer-motion';

interface FloatingElementsProps {
  elements: string[];
  count?: number;
}

interface FloatingItem {
  id: number;
  emoji: string;
  x: number;
  y: number;
  size: number;
  duration: number;
  delay: number;
}

export function FloatingElements({ elements, count = 12 }: FloatingElementsProps) {
  const [items] = useState<FloatingItem[]>(() =>
    Array.from({ length: count }).map((_, i) => ({
      id: i,
      emoji: elements[i % elements.length],
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: 16 + Math.random() * 20,
      duration: 4 + Math.random() * 6,
      delay: Math.random() * 3,
    }))
  );

  return (
    <div style={{
      position: 'absolute',
      inset: 0,
      pointerEvents: 'none',
      overflow: 'hidden',
      zIndex: 0,
    }}>
      {items.map(item => (
        <motion.span
          key={item.id}
          animate={{
            y: [0, -30, 0],
            x: [0, 10, -10, 0],
            rotate: [0, 10, -10, 0],
          }}
          transition={{
            duration: item.duration,
            delay: item.delay,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
          style={{
            position: 'absolute',
            left: `${item.x}%`,
            top: `${item.y}%`,
            fontSize: `${item.size}px`,
            opacity: 0.4,
            filter: 'blur(0.5px)',
          }}
        >
          {item.emoji}
        </motion.span>
      ))}
    </div>
  );
}
