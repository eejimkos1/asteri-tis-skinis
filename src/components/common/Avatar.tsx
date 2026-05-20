import { motion } from 'framer-motion';

interface AvatarProps {
  size?: number;
  mood?: 'idle' | 'happy' | 'sad' | 'celebrate';
}

export function Avatar({ size = 120, mood = 'idle' }: AvatarProps) {
  const moodEmoji: Record<string, string> = {
    idle: '💁‍♀️',
    happy: '💃',
    sad: '🥺',
    celebrate: '🥳',
  };

  const moodAnimation: Record<string, { y: number[]; rotate: number[]; scale?: number[] }> = {
    idle: { y: [0, -5, 0], rotate: [0, 2, -2, 0] },
    happy: { y: [0, -15, 0], scale: [1, 1.1, 1], rotate: [0, 10, -10, 0] },
    sad: { y: [0, -3, 0], scale: [1, 0.95, 1], rotate: [0, 0, 0] },
    celebrate: { y: [0, -20, 0], rotate: [0, 15, -15, 0], scale: [1, 1.2, 1] },
  };

  return (
    <motion.div
      animate={moodAnimation[mood]}
      transition={{ duration: mood === 'idle' ? 3 : 0.8, repeat: mood === 'idle' ? Infinity : 0, ease: 'easeInOut' }}
      style={{
        fontSize: `${size}px`,
        lineHeight: 1,
        filter: 'drop-shadow(0 4px 12px rgba(255, 107, 157, 0.3))',
        textAlign: 'center',
      }}
    >
      {moodEmoji[mood]}
    </motion.div>
  );
}
