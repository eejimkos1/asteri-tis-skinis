import { motion } from 'framer-motion';

interface StarDisplayProps {
  count: number;
  max?: number;
  size?: number;
}

export function StarDisplay({ count, max = 3, size = 28 }: StarDisplayProps) {
  return (
    <div style={{ display: 'flex', gap: '4px', alignItems: 'center' }}>
      {Array.from({ length: max }).map((_, i) => (
        <motion.span
          key={i}
          initial={i < count ? { scale: 0, rotate: -180 } : {}}
          animate={i < count ? { scale: 1, rotate: 0 } : {}}
          transition={{ delay: i * 0.2, type: 'spring', stiffness: 300 }}
          style={{
            fontSize: `${size}px`,
            filter: i < count ? 'drop-shadow(0 0 6px gold)' : 'grayscale(1) opacity(0.3)',
          }}
        >
          ⭐
        </motion.span>
      ))}
    </div>
  );
}
