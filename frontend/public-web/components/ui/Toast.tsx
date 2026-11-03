'use client';

import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from 'react';
import { assistantCopy } from '../../lib/i18n';
import { X } from '@phosphor-icons/react';

type Toast = { id: string; message: string; lang: 'vi' | 'en' };

const ToastContext = createContext<(message: string) => void>(() => {});

/** Access the toast queue from any client component. */
export function useToast() {
  return useContext(ToastContext);
}

/**
 * Minimal toast surface for demo confirmations.
 *
 * Replaces `alert()`, which blocks the tab, cannot be styled, is not announced
 * with the rest of the page and shows a browser-owned dialog on top of the
 * product UI.
 */
export default function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const show = useCallback((message: string) => {
    const id = crypto.randomUUID();
    setToasts((previous) => [...previous.slice(-2), { id, message, lang: document.documentElement.lang === 'en' ? 'en' : 'vi' }]);
    window.setTimeout(() => {
      setToasts((previous) => previous.filter((toast) => toast.id !== id));
    }, 5000);
  }, []);

  const value = useMemo(() => show, [show]);

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div
        className="pointer-events-none fixed inset-x-0 bottom-[calc(1.5rem+env(safe-area-inset-bottom))] z-50 flex flex-col items-center gap-2 px-4"
        role="status"
        aria-live="polite"
        aria-atomic="false"
      >
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className="pointer-events-auto flex w-full max-w-md items-start gap-3 rounded-2xl border border-emerald-200 bg-white px-4 py-3 text-xs font-semibold text-gray-800 shadow-xl"
          >
            <p className="flex-1 whitespace-pre-wrap leading-relaxed">{toast.message}</p>
            <button
              type="button"
              onClick={() => setToasts((previous) => previous.filter((item) => item.id !== toast.id))}
              className="min-h-8 rounded-lg px-2 text-gray-500 hover:bg-gray-100 hover:text-gray-700"
              aria-label={assistantCopy[toast.lang].toastClose}
            >
              <X size={16} aria-hidden="true" />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}
