import { motion } from 'framer-motion';
import { ReactNode } from 'react';

interface ButtonProps {
  children: ReactNode;
  onClick: () => void;
  variant?: 'primary' | 'secondary' | 'answer';
  size?: 'small' | 'medium' | 'large';
  color?: string;
  disabled?: boolean;
}

export function Button({ children, onClick, variant = 'primary', size = 'medium', color, disabled }: ButtonProps) {
  const baseStyle: React.CSSProperties = {
    fontFamily: 'var(--font-body)',
    fontWeight: 700,
    border: 'none',
    borderRadius: size === 'large' ? 'var(--radius-lg)' : 'var(--radius-md)',
    cursor: disabled ? 'not-allowed' : 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
    opacity: disabled ? 0.5 : 1,
    position: 'relative',
    overflow: 'hidden',
  };

  const sizeStyles: Record<string, React.CSSProperties> = {
    small: { padding: '10px 20px', fontSize: '14px' },
    medium: { padding: '14px 28px', fontSize: '16px' },
    large: { padding: '18px 40px', fontSize: '20px' },
  };

  const variantStyles: Record<string, React.CSSProperties> = {
    primary: {
      background: 'linear-gradient(135deg, var(--color-primary-start), var(--color-primary-end))',
      color: 'white',
      boxShadow: '0 4px 15px rgba(255, 107, 157, 0.4)',
    },
    secondary: {
      background: 'rgba(255, 255, 255, 0.15)',
      color: 'white',
      backdropFilter: 'blur(10px)',
      border: '1px solid rgba(255, 255, 255, 0.2)',
    },
    answer: {
      background: color || 'rgba(255, 255, 255, 0.12)',
      color: 'white',
      boxShadow: '0 2px 10px rgba(0, 0, 0, 0.2)',
      width: '100%',
      minHeight: '60px',
      fontSize: '18px',
      fontFamily: 'var(--font-numbers)',
    },
  };

  return (
    <motion.button
      onClick={disabled ? undefined : onClick}
      style={{ ...baseStyle, ...sizeStyles[size], ...variantStyles[variant] }}
      whileTap={disabled ? {} : { scale: 0.95 }}
      whileHover={disabled ? {} : { scale: 1.02 }}
      transition={{ type: 'spring', stiffness: 400, damping: 17 }}
    >
      {children}
    </motion.button>
  );
}
