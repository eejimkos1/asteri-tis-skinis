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
      background: 'linear-gradient(135deg, #FF6B9D, #C44FE2, #FF6B9D)',
      backgroundSize: '200% 200%',
      animation: 'gradientShift 4s ease infinite',
      color: 'white',
      boxShadow: '0 4px 20px rgba(255, 107, 157, 0.5), inset 0 1px 0 rgba(255, 255, 255, 0.2)',
    },
    secondary: {
      background: 'rgba(255, 255, 255, 0.12)',
      color: 'white',
      backdropFilter: 'blur(10px)',
      border: '1px solid rgba(255, 255, 255, 0.25)',
      boxShadow: '0 2px 12px rgba(0, 0, 0, 0.15), inset 0 1px 0 rgba(255, 255, 255, 0.1)',
    },
    answer: {
      background: color || 'rgba(255, 255, 255, 0.12)',
      color: 'white',
      boxShadow: '0 4px 15px rgba(0, 0, 0, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.1)',
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
      whileTap={disabled ? {} : { scale: 0.93 }}
      whileHover={disabled ? {} : {
        scale: 1.03,
        boxShadow: variant === 'primary'
          ? '0 6px 30px rgba(255, 107, 157, 0.7), 0 0 40px rgba(196, 79, 226, 0.3)'
          : '0 4px 20px rgba(255, 255, 255, 0.15)',
      }}
      transition={{ type: 'spring', stiffness: 400, damping: 17 }}
    >
      {variant === 'primary' && !disabled && (
        <span style={{
          position: 'absolute',
          top: 0,
          left: '-100%',
          width: '60%',
          height: '100%',
          background: 'linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent)',
          animation: 'btnShine 3s ease-in-out infinite',
          pointerEvents: 'none',
        }} />
      )}
      {children}
    </motion.button>
  );
}
