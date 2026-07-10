/**
 * SkipNavLink provides a "skip to main content" link that
 * appears only when focused via keyboard navigation (Tab key).
 * Essential for WCAG 2.4.1 compliance.
 */
export function SkipNavLink({ targetId = 'main-content' }: { targetId?: string }) {
  return (
    <a
      href={`#${targetId}`}
      className="skip-nav-link"
      style={{
        position: 'absolute',
        top: '-100%',
        left: '16px',
        zIndex: 10000,
        padding: '12px 24px',
        background: 'var(--primary, #3b82f6)',
        color: '#ffffff',
        fontSize: '14px',
        fontWeight: 600,
        borderRadius: '0 0 8px 8px',
        textDecoration: 'none',
        transition: 'top 0.2s ease',
      }}
      onFocus={(e) => {
        (e.target as HTMLElement).style.top = '0';
      }}
      onBlur={(e) => {
        (e.target as HTMLElement).style.top = '-100%';
      }}
    >
      Skip to main content
    </a>
  );
}
