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
  pathType: number;
}

export function FloatingElements({ elements, count = 12 }: FloatingElementsProps) {
  const [items] = useState<FloatingItem[]>(() =>
    Array.from({ length: count }).map((_, i) => ({
      id: i,
      emoji: elements[i % elements.length],
      x: Math.random() * 90 + 5,
      y: Math.random() * 90 + 5,
      size: 18 + Math.random() * 22,
      duration: 5 + Math.random() * 7,
      delay: Math.random() * 4,
      pathType: Math.floor(Math.random() * 3),
    }))
  );

  const getAnimation = (pathType: number) => {
    switch (pathType) {
      case 0:
        return { y: [0, -25, 5, -20, 0], x: [0, 12, -8, 10, 0], rotate: [0, 8, -5, 3, 0], scale: [1, 1.1, 0.95, 1.05, 1] };
      case 1:
        return { y: [0, -15, -30, -15, 0], x: [0, -15, 0, 15, 0], rotate: [0, -10, 5, -3, 0], scale: [1, 1.15, 1, 0.9, 1] };
      default:
        return { y: [0, -20, -10, -25, 0], x: [0, 8, 15, 5, 0], rotate: [0, 12, -8, 6, 0], scale: [0.9, 1.1, 1, 1.15, 0.9] };
    }
  };

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
          animate={getAnimation(item.pathType)}
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
            opacity: 0.7,
            filter: `drop-shadow(0 0 ${item.size * 0.3}px rgba(255, 200, 255, 0.4))`,
          }}
        >
          {item.emoji}
        </motion.span>
      ))}
    </div>
  );
}
