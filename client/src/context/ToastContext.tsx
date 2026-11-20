'use client';

import React, { createContext, useContext, useState, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

export type ToastType = 'success' | 'error' | 'info';

interface Toast {
  id: string;
  title: string;
  message?: string;
  type: ToastType;
}

interface ToastContextType {
  toast: (title: string, message?: string, type?: ToastType) => void;
  success: (title: string, message?: string) => void;
  error: (title: string, message?: string) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const timersRef = useRef<Map<string, NodeJS.Timeout>>(new Map());

  const removeToast = useCallback((id: string) => {
    // Clear timer if active
    const timer = timersRef.current.get(id);
    if (timer) {
      clearTimeout(timer);
      timersRef.current.delete(id);
    }
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const addToast = useCallback(
    (title: string, message?: string, type: ToastType = 'info') => {
      const id = Math.random().toString(36).substring(2, 9);
      setToasts((prev) => [...prev, { id, title, message, type }]);

      const timer = setTimeout(() => {
        removeToast(id);
      }, 4500);

      timersRef.current.set(id, timer);
    },
    [removeToast]
  );

  const success = useCallback(
    (title: string, message?: string) => addToast(title, message, 'success'),
    [addToast]
  );
  const error = useCallback(
    (title: string, message?: string) => addToast(title, message, 'error'),
    [addToast]
  );

  return (
    <ToastContext.Provider value={{ toast: addToast, success, error }}>
      {children}
      <div className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-[9999] flex flex-col space-y-2 pointer-events-none w-[calc(100vw-2rem)] sm:w-96 max-w-sm">
        <AnimatePresence mode="popLayout">
          {toasts.map((t) => (
            <motion.div
              key={t.id}
              layout
              initial={{ opacity: 0, y: 16, scale: 0.94 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 8, scale: 0.92, transition: { duration: 0.15 } }}
              transition={{ type: 'spring', damping: 26, stiffness: 360 }}
              className="pointer-events-auto relative overflow-hidden flex items-start space-x-3 rounded-xl border border-zinc-200/90 bg-white/95 backdrop-blur-md p-3.5 shadow-xl text-zinc-800 hover:border-zinc-300 transition-colors"
            >
              {/* Status Badge Icon */}
              {t.type === 'success' && (
                <div className="h-7 w-7 rounded-lg bg-emerald-50 border border-emerald-200/70 text-emerald-600 flex items-center justify-center shrink-0 shadow-2xs mt-0.5">
                  <CheckCircle2 className="h-4 w-4" />
                </div>
              )}
              {t.type === 'error' && (
                <div className="h-7 w-7 rounded-lg bg-rose-50 border border-rose-200/70 text-rose-600 flex items-center justify-center shrink-0 shadow-2xs mt-0.5">
                  <AlertCircle className="h-4 w-4" />
                </div>
              )}
              {t.type === 'info' && (
                <div className="h-7 w-7 rounded-lg bg-sky-50 border border-sky-200/70 text-sky-600 flex items-center justify-center shrink-0 shadow-2xs mt-0.5">
                  <Info className="h-4 w-4" />
                </div>
              )}

              {/* Text Details */}
              <div className="flex-1 min-w-0 pr-1">
                <div className="flex items-center space-x-2">
                  <p className="font-semibold text-xs text-zinc-900 tracking-tight truncate">
                    {t.title}
                  </p>
                  <span className="text-[10px] font-mono text-zinc-400 shrink-0">just now</span>
                </div>
                {t.message && (
                  <p className="text-[11px] text-zinc-500 mt-0.5 leading-snug line-clamp-2">
                    {t.message}
                  </p>
                )}
              </div>

              {/* Close 'X' Button - Rock Solid & Fully Clickable */}
              <button
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  removeToast(t.id);
                }}
                onPointerDown={(e) => e.stopPropagation()}
                className="h-6 w-6 rounded-md hover:bg-zinc-100 flex items-center justify-center text-zinc-400 hover:text-zinc-700 transition-colors cursor-pointer shrink-0 ml-auto focus:outline-none focus:ring-1 focus:ring-zinc-400 active:scale-90"
                aria-label="Dismiss notification"
                title="Dismiss notification"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) throw new Error('useToast must be used within a ToastProvider');
  return context;
};
