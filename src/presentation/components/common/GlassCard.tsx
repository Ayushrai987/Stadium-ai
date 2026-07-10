import { type ReactNode, type ComponentType } from 'react';
import { motion } from 'framer-motion';
import { type LucideProps } from 'lucide-react';

interface GlassCardProps {
  title?: string;
  icon?: ComponentType<LucideProps>;
  children: ReactNode;
  className?: string;
  badge?: { text: string; color: string };
  onClick?: () => void;
  animate?: boolean;
}

export function GlassCard({
  title,
  icon: Icon,
  children,
  className = '',
  badge,
  onClick,
  animate = true,
}: GlassCardProps) {
  const cardStyle = {
    background: 'rgba(15, 22, 41, 0.8)',
    backdropFilter: 'blur(20px)',
    WebkitBackdropFilter: 'blur(20px)',
    border: '1px solid rgba(255, 255, 255, 0.06)',
    borderRadius: '12px',
    padding: '20px',
    position: 'relative' as const,
    boxShadow: '0 4px 24px rgba(0, 0, 0, 0.3)',
    cursor: onClick ? 'pointer' : 'default',
  };

  const Component = animate ? motion.div : 'div';
  const motionProps = animate
    ? {
        whileHover: onClick ? { y: -4, borderColor: 'rgba(255, 255, 255, 0.15)' } : { borderColor: 'rgba(255, 255, 255, 0.08)' },
        transition: { duration: 0.2 },
      }
    : {};

  return (
    <Component
      style={cardStyle}
      className={`glass-card ${className}`}
      onClick={onClick}
      {...motionProps}
    >
      {(title || Icon || badge) && (
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '16px',
          borderBottom: '1px solid rgba(255, 255, 255, 0.03)',
          paddingBottom: '10px',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            {Icon && <Icon size={16} color="#3b82f6" />}
            {title && (
              <h4 style={{ fontSize: '14px', fontWeight: 600, color: '#f1f5f9', margin: 0 }}>
                {title}
              </h4>
            )}
          </div>
          {badge && (
            <span style={{
              fontSize: '10px',
              fontWeight: 600,
              padding: '2px 8px',
              borderRadius: '20px',
              background: `${badge.color}15`,
              color: badge.color,
              border: `1px solid ${badge.color}30`,
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
            }}>
              {badge.text}
            </span>
          )}
        </div>
      )}
      {children}
    </Component>
  );
}
