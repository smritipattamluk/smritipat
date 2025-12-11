'use client';

import { useEffect, useState } from 'react';
import { CheckCircle, XCircle, Info, AlertTriangle, X } from 'lucide-react';

type ToastType = 'success' | 'error' | 'info' | 'warning';

interface Toast {
  id: string;
  type: ToastType;
  message: string;
  duration?: number;
}

let toastCounter = 0;
const listeners = new Set<(toasts: Toast[]) => void>();
let toasts: Toast[] = [];

function notifyListeners() {
  listeners.forEach((listener) => listener([...toasts]));
}

export const toast = {
  success: (message: string, duration = 5000) => {
    addToast({ type: 'success', message, duration });
  },
  error: (message: string, duration = 5000) => {
    addToast({ type: 'error', message, duration });
  },
  info: (message: string, duration = 5000) => {
    addToast({ type: 'info', message, duration });
  },
  warning: (message: string, duration = 5000) => {
    addToast({ type: 'warning', message, duration });
  },
};

function addToast(toast: Omit<Toast, 'id'>) {
  const id = `toast-${++toastCounter}`;
  const newToast = { ...toast, id };
  toasts = [...toasts, newToast];
  notifyListeners();

  if (toast.duration && toast.duration > 0) {
    setTimeout(() => {
      removeToast(id);
    }, toast.duration);
  }
}

function removeToast(id: string) {
  toasts = toasts.filter((t) => t.id !== id);
  notifyListeners();
}

export function Toaster() {
  const [toastList, setToastList] = useState<Toast[]>([]);

  useEffect(() => {
    listeners.add(setToastList);
    return () => {
      listeners.delete(setToastList);
    };
  }, []);

  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2 max-w-sm">
      {toastList.map((toast) => (
        <ToastItem key={toast.id} toast={toast} onClose={() => removeToast(toast.id)} />
      ))}
    </div>
  );
}

function ToastItem({ toast, onClose }: { toast: Toast; onClose: () => void }) {
  const config = {
    success: {
      icon: CheckCircle,
      className: 'bg-green-50 border-green-200 text-green-800',
      iconClassName: 'text-green-600',
    },
    error: {
      icon: XCircle,
      className: 'bg-red-50 border-red-200 text-red-800',
      iconClassName: 'text-red-600',
    },
    info: {
      icon: Info,
      className: 'bg-blue-50 border-blue-200 text-blue-800',
      iconClassName: 'text-blue-600',
    },
    warning: {
      icon: AlertTriangle,
      className: 'bg-yellow-50 border-yellow-200 text-yellow-800',
      iconClassName: 'text-yellow-600',
    },
  };

  const { icon: Icon, className, iconClassName } = config[toast.type];

  return (
    <div
      className={`flex items-start gap-3 p-4 rounded-lg border shadow-lg animate-in slide-in-from-right ${className}`}
    >
      <Icon className={`w-5 h-5 flex-shrink-0 ${iconClassName}`} />
      <p className="flex-1 text-sm font-medium">{toast.message}</p>
      <button
        onClick={onClose}
        className="flex-shrink-0 hover:opacity-70 transition-opacity"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
}
