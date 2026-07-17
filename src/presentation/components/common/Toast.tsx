import { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// --- Toast System ---

interface ToastData {
  id: string;
  message: string;
  type: 'success' | 'error' | 'info' | 'warning';
  duration?: number;
}

let toastIdCounter = 0;
const toastListeners = new Set<(toasts: ToastData[]) => void>();
let currentToasts: ToastData[] = [];

function notifyListeners() {
  toastListeners.forEach((fn) => fn([...currentToasts]));
}

/**
 * Show a toast notification. Can be called from anywhere — no hook needed.
 */
export function showToast(
  message: string,
  type: ToastData['type'] = 'info',
  duration: number = 4000
) {
  const id = `toast-${++toastIdCounter}`;
  const toast: ToastData = { id, message, type, duration };
  currentToasts = [...currentToasts, toast];
  notifyListeners();

  // Auto-dismiss
  if (duration > 0) {
    setTimeout(() => {
      dismissToast(id);
    }, duration);
  }
}

export function dismissToast(id: string) {
  currentToasts = currentToasts.filter((t) => t.id !== id);
  notifyListeners();
}

/**
 * Toast Container component — renders all active toasts.
 * Place once at the root of the app.
 */
export function ToastContainer() {
  const [toasts, setToasts] = useState<ToastData[]>([]);

  useEffect(() => {
    toastListeners.add(setToasts);
    return () => { toastListeners.delete(setToasts); };
  }, []);

  const typeColors: Record<string, { bg: string; border: string; text: string }> = {
    success: { bg: 'rgba(16,185,129,0.12)', border: 'rgba(16,185,129,0.3)', text: '#10b981' },
    error: { bg: 'rgba(239,68,68,0.12)', border: 'rgba(239,68,68,0.3)', text: '#ef4444' },
    warning: { bg: 'rgba(245,158,11,0.12)', border: 'rgba(245,158,11,0.3)', text: '#f59e0b' },
    info: { bg: 'rgba(59,130,246,0.12)', border: 'rgba(59,130,246,0.3)', text: '#3b82f6' },
  };

  const typeIcons: Record<string, string> = {
    success: '✓',
    error: '✕',
    warning: '⚠',
    info: 'ℹ',
  };

  return (
    <div
      role="region"
      aria-label="Notifications"
      aria-live="polite"
      style={{
        position: 'fixed',
        top: '20px',
        right: '20px',
        zIndex: 9999,
        display: 'flex',
        flexDirection: 'column',
        gap: '8px',
        pointerEvents: 'none',
        maxWidth: '400px',
      }}
    >
      <AnimatePresence>
        {toasts.map((toast) => {
          const colors = typeColors[toast.type] || typeColors.info;
          return (
            <motion.div
              key={toast.id}
              initial={{ opacity: 0, x: 60, scale: 0.95 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: 60, scale: 0.95 }}
              transition={{ duration: 0.25 }}
              role="alert"
              style={{
                background: colors.bg,
                border: `1px solid ${colors.border}`,
                backdropFilter: 'blur(20px)',
                borderRadius: '10px',
                padding: '12px 16px',
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                pointerEvents: 'auto',
                cursor: 'pointer',
                fontFamily: "'Inter', system-ui, sans-serif",
              }}
              onClick={() => dismissToast(toast.id)}
            >
              <span style={{ fontSize: '16px', color: colors.text, fontWeight: 700 }}>
                {typeIcons[toast.type]}
              </span>
              <span style={{ fontSize: '13px', color: '#f1f5f9', fontWeight: 500, flex: 1 }}>
                {toast.message}
              </span>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
}

// --- Confirmation Dialog ---

interface ConfirmDialogProps {
  isOpen: boolean;
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  variant?: 'danger' | 'default';
  onConfirm: () => void;
  onCancel: () => void;
}

/**
 * Accessible confirmation dialog with focus trapping.
 * Replaces native alert() / confirm() calls.
 */
export function ConfirmDialog({
  isOpen,
  title,
  message,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  variant = 'default',
  onConfirm,
  onCancel,
}: ConfirmDialogProps) {
  const confirmRef = useRef<HTMLButtonElement>(null);

  // Focus trap: focus the confirm button when dialog opens
  useEffect(() => {
    if (isOpen && confirmRef.current) {
      confirmRef.current.focus();
    }
  }, [isOpen]);

  // Close on Escape
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === 'Escape') onCancel();
    },
    [onCancel]
  );

  if (!isOpen) return null;

  const confirmBg = variant === 'danger'
    ? 'linear-gradient(135deg, #ef4444, #dc2626)'
    : 'linear-gradient(135deg, #3b82f6, #8b5cf6)';

  return (
    /* eslint-disable-next-line jsx-a11y/no-noninteractive-element-interactions */
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="confirm-dialog-title"
      aria-describedby="confirm-dialog-message"
      onKeyDown={handleKeyDown}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 10000,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'rgba(0,0,0,0.6)',
        backdropFilter: 'blur(4px)',
      }}
      onClick={onCancel}
    >
      {/* eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-static-element-interactions */}
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          maxWidth: '420px',
          width: '90%',
          background: 'rgba(15, 22, 41, 0.95)',
          border: '1px solid rgba(255,255,255,0.1)',
          borderRadius: '16px',
          padding: '28px',
          animation: 'anim-scale-in 0.2s ease',
        }}
      >
        <h3
          id="confirm-dialog-title"
          style={{ fontSize: '18px', fontWeight: 700, color: '#f1f5f9', margin: '0 0 8px' }}
        >
          {title}
        </h3>
        <p
          id="confirm-dialog-message"
          style={{ fontSize: '14px', color: '#94a3b8', margin: '0 0 24px', lineHeight: 1.5 }}
        >
          {message}
        </p>
        <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
          <button
            onClick={onCancel}
            style={{
              padding: '10px 20px',
              background: 'rgba(255,255,255,0.05)',
              color: '#94a3b8',
              border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: '8px',
              fontSize: '13px',
              fontWeight: 600,
              cursor: 'pointer',
            }}
          >
            {cancelLabel}
          </button>
          <button
            ref={confirmRef}
            onClick={onConfirm}
            style={{
              padding: '10px 20px',
              background: confirmBg,
              color: '#fff',
              border: 'none',
              borderRadius: '8px',
              fontSize: '13px',
              fontWeight: 600,
              cursor: 'pointer',
            }}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}

// --- Network Status Hook ---

/**
 * Hook to detect online/offline network status.
 */
export function useNetworkStatus() {
  const [isOnline, setIsOnline] = useState(typeof navigator !== 'undefined' ? navigator.onLine : true);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  return isOnline;
}

/**
 * Banner that shows when the user goes offline.
 */
export function OfflineIndicator() {
  const isOnline = useNetworkStatus();

  return (
    <AnimatePresence>
      {!isOnline && (
        <motion.div
          role="alert"
          aria-live="assertive"
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -50, opacity: 0 }}
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            zIndex: 9998,
            background: 'linear-gradient(135deg, #f59e0b, #d97706)',
            color: '#000',
            textAlign: 'center',
            padding: '8px 16px',
            fontSize: '13px',
            fontWeight: 600,
            fontFamily: "'Inter', system-ui, sans-serif",
          }}
        >
          ⚡ Offline Mode — Data may be stale. Reconnecting...
        </motion.div>
      )}
    </AnimatePresence>
  );
}
