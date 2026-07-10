import { type ReactNode } from 'react';

/**
 * VisuallyHidden renders content that is invisible to sighted users
 * but accessible to screen readers. Essential for ARIA context.
 *
 * @example
 * <button>
 *   <Icon />
 *   <VisuallyHidden>Close dialog</VisuallyHidden>
 * </button>
 */
export function VisuallyHidden({ children }: { children: ReactNode }) {
  return (
    <span
      style={{
        position: 'absolute',
        width: '1px',
        height: '1px',
        padding: 0,
        margin: '-1px',
        overflow: 'hidden',
        clip: 'rect(0, 0, 0, 0)',
        whiteSpace: 'nowrap',
        border: 0,
      }}
    >
      {children}
    </span>
  );
}
