'use client';

// ============================================================
// QueryProvider
// ============================================================
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useState, createContext, useContext, useCallback, ReactNode } from 'react';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: { retry: 1, staleTime: 30_000 },
  },
});

export function QueryProvider({ children }: { children: ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
}

// ============================================================
// Toast system
// ============================================================
interface Toast {
  id: string;
  message: string;
  type: 'success' | 'error' | 'info';
}

interface ToastCtx {
  toasts: Toast[];
  toast: (msg: string, type?: Toast['type']) => void;
}

const ToastContext = createContext<ToastCtx>({ toasts: [], toast: () => {} });
export const useToast = () => useContext(ToastContext);

export function Toaster() {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const toast = useCallback((message: string, type: Toast['type'] = 'success') => {
    const id = Math.random().toString(36).slice(2);
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 4000);
  }, []);

  const colors: Record<Toast['type'], string> = {
    success: 'bg-green-600',
    error: 'bg-red-600',
    info: 'bg-primary-600',
  };
  const icons: Record<Toast['type'], string> = {
    success: '✓',
    error: '✕',
    info: 'ℹ',
  };

  return (
    <ToastContext.Provider value={{ toasts, toast }}>
      <div className="fixed bottom-6 right-6 z-[9999] flex flex-col gap-2 max-w-xs">
        {toasts.map(t => (
          <div
            key={t.id}
            className={`${colors[t.type]} text-white px-4 py-3 rounded-xl shadow-xl flex items-center gap-3 animate-slide-up`}
          >
            <span className="font-bold text-lg">{icons[t.type]}</span>
            <span className="text-sm font-medium">{t.message}</span>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

// ============================================================
// Spinner
// ============================================================
export function Spinner({ size = 'md' }: { size?: 'sm' | 'md' | 'lg' }) {
  const sz = { sm: 'w-4 h-4', md: 'w-8 h-8', lg: 'w-12 h-12' }[size];
  return (
    <div className={`${sz} border-2 border-primary-200 border-t-primary rounded-full animate-spin`} />
  );
}

export function LoadingCenter() {
  return (
    <div className="flex items-center justify-center py-20">
      <Spinner size="lg" />
    </div>
  );
}

// ============================================================
// StarRating
// ============================================================
export function StarRating({ rating, max = 5, size = 'md' }: { rating: number; max?: number; size?: 'sm' | 'md' }) {
  const sz = size === 'sm' ? 'text-sm' : 'text-lg';
  return (
    <div className={`flex items-center gap-0.5 ${sz}`} dir="ltr">
      {Array.from({ length: max }).map((_, i) => (
        <span key={i} className={i < Math.round(rating) ? 'text-amber-400' : 'text-slate-200'}>★</span>
      ))}
    </div>
  );
}

// ============================================================
// Badge
// ============================================================
interface BadgeProps {
  children: ReactNode;
  variant?: 'default' | 'success' | 'warning' | 'danger' | 'gold';
}

export function Badge({ children, variant = 'default' }: BadgeProps) {
  const variants = {
    default: 'bg-slate-100 text-slate-600',
    success: 'bg-green-100 text-green-700',
    warning: 'bg-amber-100 text-amber-700',
    danger: 'bg-red-100 text-red-700',
    gold: 'bg-amber-500 text-white',
  };
  return (
    <span className={`badge ${variants[variant]}`}>{children}</span>
  );
}

// ============================================================
// Modal
// ============================================================
interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
}

export function Modal({ isOpen, onClose, title, children }: ModalProps) {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto animate-scale-in">
        <div className="flex items-center justify-between p-6 border-b border-slate-100">
          <h2 className="text-lg font-bold text-slate-800">{title}</h2>
          <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-lg transition-colors">
            <svg className="w-5 h-5 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <div className="p-6">{children}</div>
      </div>
    </div>
  );
}

// ============================================================
// Empty State
// ============================================================
export function EmptyState({ icon, title, desc, action }: {
  icon: ReactNode;
  title: string;
  desc?: string;
  action?: ReactNode;
}) {
  return (
    <div className="text-center py-16 px-4">
      <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 16, color: 'var(--gray-300)' }}>{icon}</div>
      <h3 style={{ fontSize: 15, fontWeight: 500, color: 'var(--gray-800)', marginBottom: 6 }}>{title}</h3>
      {desc && <p style={{ fontSize: 13, color: 'var(--gray-500)', marginBottom: 24, maxWidth: 280, margin: '0 auto 24px' }}>{desc}</p>}
      {action}
    </div>
  );
}
