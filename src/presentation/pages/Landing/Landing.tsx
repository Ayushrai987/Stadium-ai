import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  LayoutDashboard,
  Smartphone,
  Globe,
  Shield,
  Activity,
  Zap,
  Users,
  Eye,
  ChevronRight,
  Radio,
} from 'lucide-react';

const roles = [
  {
    id: 'operator',
    title: 'Stadium Operations',
    subtitle: 'Command Center Dashboard',
    description: 'Real-time crowd analytics, predictive queue management, energy monitoring, and incident response for stadium operators.',
    icon: LayoutDashboard,
    path: '/operator',
    gradient: 'linear-gradient(135deg, #3b82f6, #1d4ed8)',
    glowColor: 'rgba(59, 130, 246, 0.3)',
    features: ['Crowd Heatmaps', 'Queue Prediction', 'Energy Tracking', 'Incident Management'],
  },
  {
    id: 'fan',
    title: 'Fan Experience',
    subtitle: 'AR Navigation & Smart Commerce',
    description: 'Personalized wayfinding, smart food recommendations, friend finder, and accessibility-first design for every fan.',
    icon: Smartphone,
    path: '/fan',
    gradient: 'linear-gradient(135deg, #10b981, #059669)',
    glowColor: 'rgba(16, 185, 129, 0.3)',
    features: ['AR Navigation', 'Smart Orders', 'Friend Finder', 'Accessibility'],
  },
  {
    id: 'command',
    title: 'Tournament Command',
    subtitle: 'Multi-Venue Orchestration',
    description: 'Unified command center for FIFA World Cup 2026 scale operations across 5 venues, 3 countries.',
    icon: Globe,
    path: '/command',
    gradient: 'linear-gradient(135deg, #8b5cf6, #6d28d9)',
    glowColor: 'rgba(139, 92, 246, 0.3)',
    features: ['5-Venue Federation', 'Cross-Venue Alerts', 'Resource Allocation', 'Tournament Playbook'],
  },
  {
    id: 'privacy',
    title: 'Privacy & Compliance',
    subtitle: 'Data Protection Center',
    description: 'GDPR/CCPA compliance dashboard, consent management, audit logging, and data classification for regulators.',
    icon: Shield,
    path: '/privacy',
    gradient: 'linear-gradient(135deg, #f59e0b, #d97706)',
    glowColor: 'rgba(245, 158, 11, 0.3)',
    features: ['Consent Manager', 'Audit Logs', 'Data Classification', 'Compliance Tracking'],
  },
];

const stats = [
  { label: 'Venues Connected', value: '5', icon: Radio },
  { label: 'Live Sensors', value: '2,847', icon: Activity },
  { label: 'Fan Capacity', value: '350K+', icon: Users },
  { label: 'Uptime', value: '99.97%', icon: Zap },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.3 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' as const } },
};

/**
 * Platform Landing Portal Page.
 * Acts as the role-selection gateway with high-impact visuals, KPI highlights,
 * and keyboard-accessible navigation cards.
 */
export function Landing() {
  const navigate = useNavigate();

  const handleKeyDown = (e: React.KeyboardEvent, path: string) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      navigate(path);
    }
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        background: '#0a0e1a',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Animated background grid */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          backgroundImage: `
            radial-gradient(ellipse at 20% 50%, rgba(59,130,246,0.08) 0%, transparent 50%),
            radial-gradient(ellipse at 80% 20%, rgba(139,92,246,0.06) 0%, transparent 50%),
            radial-gradient(ellipse at 50% 80%, rgba(16,185,129,0.05) 0%, transparent 50%)
          `,
          pointerEvents: 'none',
        }}
      />

      {/* Grid pattern overlay */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          backgroundImage: `
            linear-gradient(rgba(255,255,255,0.02) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.02) 1px, transparent 1px)
          `,
          backgroundSize: '60px 60px',
          pointerEvents: 'none',
        }}
      />

      <div
        id="main-content"
        style={{ position: 'relative', zIndex: 1, maxWidth: '1400px', margin: '0 auto', padding: '0 32px' }}
      >
        {/* Header */}
        <motion.header
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          role="banner"
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '24px 0',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div
              style={{
                width: '40px',
                height: '40px',
                borderRadius: '10px',
                background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Activity size={22} color="white" />
            </div>
            <div>
              <h1
                style={{
                  fontSize: '20px',
                  fontWeight: 700,
                  color: '#f1f5f9',
                  margin: 0,
                  letterSpacing: '-0.02em',
                }}
              >
                StadiumAI
              </h1>
              <p
                style={{
                  fontSize: '11px',
                  color: '#64748b',
                  margin: 0,
                  textTransform: 'uppercase',
                  letterSpacing: '0.1em',
                }}
              >
                Intelligence Platform
              </p>
            </div>
          </div>

          <div
            role="status"
            aria-live="polite"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '6px 14px',
              borderRadius: '20px',
              background: 'rgba(16, 185, 129, 0.1)',
              border: '1px solid rgba(16, 185, 129, 0.2)',
            }}
          >
            <div
              style={{
                width: '8px',
                height: '8px',
                borderRadius: '50%',
                background: '#10b981',
                animation: 'pulse 2s infinite',
              }}
            />
            <span style={{ fontSize: '12px', color: '#10b981', fontWeight: 500 }}>
              All Systems Operational
            </span>
          </div>
        </motion.header>

        {/* Hero Section */}
        <motion.section
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          style={{ textAlign: 'center', padding: '60px 0 40px' }}
          aria-label="Welcome Introduction"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              padding: '8px 20px',
              borderRadius: '20px',
              background: 'rgba(139, 92, 246, 0.1)',
              border: '1px solid rgba(139, 92, 246, 0.2)',
              marginBottom: '24px',
            }}
          >
            <Eye size={14} color="#8b5cf6" />
            <span style={{ fontSize: '13px', color: '#8b5cf6', fontWeight: 500 }}>
              Real-Time Crowd Intelligence · FIFA World Cup 2026 Ready
            </span>
          </motion.div>

          <h2
            style={{
              fontSize: 'clamp(32px, 5vw, 56px)',
              fontWeight: 800,
              color: '#f1f5f9',
              margin: '0 0 16px',
              lineHeight: 1.1,
              letterSpacing: '-0.03em',
            }}
          >
            Smart Stadium
            <br />
            <span
              style={{
                background: 'linear-gradient(135deg, #3b82f6, #8b5cf6, #10b981)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              Operations Platform
            </span>
          </h2>
          <p
            style={{
              fontSize: '18px',
              color: '#94a3b8',
              maxWidth: '640px',
              margin: '0 auto 40px',
              lineHeight: 1.6,
            }}
          >
            Predictive crowd management, AR fan experiences, and multi-venue
            tournament orchestration — powered by real-time sensor intelligence.
          </p>

          {/* Stats bar */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            style={{
              display: 'flex',
              justifyContent: 'center',
              gap: '32px',
              flexWrap: 'wrap',
              marginBottom: '48px',
            }}
            role="list"
            aria-label="Platform Telemetry Summary"
          >
            {stats.map((stat) => (
              <motion.div
                key={stat.label}
                variants={itemVariants}
                role="listitem"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  padding: '12px 20px',
                  borderRadius: '12px',
                  background: 'rgba(15, 22, 41, 0.6)',
                  border: '1px solid rgba(255,255,255,0.06)',
                }}
              >
                <stat.icon size={18} color="#3b82f6" aria-hidden="true" />
                <div style={{ textAlign: 'left' }}>
                  <div style={{ fontSize: '18px', fontWeight: 700, color: '#f1f5f9' }}>
                    {stat.value}
                  </div>
                  <div style={{ fontSize: '11px', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    {stat.label}
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </motion.section>

        {/* Role Cards */}
        <motion.section
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: '24px',
            paddingBottom: '80px',
          }}
          aria-label="Operational Role Gateways"
        >
          {roles.map((role) => (
            <motion.div
              key={role.id}
              variants={itemVariants}
              whileHover={{ y: -8, scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => navigate(role.path)}
              onKeyDown={(e) => handleKeyDown(e, role.path)}
              tabIndex={0}
              role="button"
              aria-label={`Enter ${role.title} Module. ${role.subtitle}: ${role.description}`}
              style={{
                background: 'rgba(15, 22, 41, 0.8)',
                backdropFilter: 'blur(20px)',
                border: '1px solid rgba(255,255,255,0.06)',
                borderRadius: '16px',
                padding: '32px',
                cursor: 'pointer',
                position: 'relative',
                overflow: 'hidden',
                transition: 'border-color 0.3s ease',
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLDivElement).style.borderColor = 'rgba(255,255,255,0.15)';
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLDivElement).style.borderColor = 'rgba(255,255,255,0.06)';
              }}
            >
              {/* Glow effect */}
              <div
                style={{
                  position: 'absolute',
                  top: '-50%',
                  right: '-50%',
                  width: '200px',
                  height: '200px',
                  borderRadius: '50%',
                  background: role.glowColor,
                  filter: 'blur(60px)',
                  opacity: 0.5,
                  pointerEvents: 'none',
                }}
              />

              <div style={{ position: 'relative', zIndex: 1 }}>
                <div
                  style={{
                    width: '48px',
                    height: '48px',
                    borderRadius: '12px',
                    background: role.gradient,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginBottom: '20px',
                    boxShadow: `0 8px 32px ${role.glowColor}`,
                  }}
                >
                  <role.icon size={24} color="white" aria-hidden="true" />
                </div>

                <div
                  style={{
                    fontSize: '11px',
                    color: '#64748b',
                    textTransform: 'uppercase',
                    letterSpacing: '0.1em',
                    marginBottom: '4px',
                  }}
                >
                  {role.subtitle}
                </div>
                <h3
                  style={{
                    fontSize: '22px',
                    fontWeight: 700,
                    color: '#f1f5f9',
                    margin: '0 0 12px',
                    letterSpacing: '-0.01em',
                  }}
                >
                  {role.title}
                </h3>
                <p
                  style={{
                    fontSize: '14px',
                    color: '#94a3b8',
                    lineHeight: 1.6,
                    margin: '0 0 20px',
                  }}
                >
                  {role.description}
                </p>

                <div
                  style={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    gap: '6px',
                    marginBottom: '20px',
                  }}
                >
                  {role.features.map((f) => (
                    <span
                      key={f}
                      style={{
                        fontSize: '11px',
                        color: '#94a3b8',
                        padding: '4px 10px',
                        borderRadius: '6px',
                        background: 'rgba(255,255,255,0.04)',
                        border: '1px solid rgba(255,255,255,0.06)',
                      }}
                    >
                      {f}
                    </span>
                  ))}
                </div>

                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    fontSize: '14px',
                    fontWeight: 600,
                    color: '#3b82f6',
                  }}
                >
                  Enter Dashboard
                  <ChevronRight size={16} aria-hidden="true" />
                </div>
              </div>
            </motion.div>
          ))}
        </motion.section>

        {/* Footer */}
        <motion.footer
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          role="contentinfo"
          style={{
            textAlign: 'center',
            padding: '32px 0',
            borderTop: '1px solid rgba(255,255,255,0.04)',
          }}
        >
          <p style={{ fontSize: '12px', color: '#475569' }}>
            StadiumAI — Real-Time Crowd Intelligence Platform · Privacy-First Architecture · FIFA World Cup 2026 Ready
          </p>
        </motion.footer>
      </div>

      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
      `}</style>
    </div>
  );
}

export default Landing;
