import { motion } from 'framer-motion';

interface HeartsProps {
  total: number;
  remaining: number;
}

export function Hearts({ total, remaining }: HeartsProps) {
  return (
    <div style={{ display: 'flex', gap: '6px' }}>
      {Array.from({ length: total }).map((_, i) => (
        <motion.span
          key={i}
          animate={i >= remaining ? { scale: [1, 1.3, 0], opacity: [1, 1, 0] } : {}}
          transition={{ duration: 0.4 }}
          style={{
            fontSize: '24px',
            filter: i < remaining ? 'drop-shadow(0 0 4px #ff4444)' : 'grayscale(1)',
            opacity: i < remaining ? 1 : 0.2,
          }}
        >
          ❤️
        </motion.span>
      ))}
    </div>
  );
}
