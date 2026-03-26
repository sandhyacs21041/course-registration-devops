import React, { useEffect } from 'react';

export default function Toast({ toasts, remove }) {
  return (
    <div className="toast-container">
      {toasts.map(t => (
        <ToastItem key={t.id} toast={t} remove={remove} />
      ))}
    </div>
  );
}

function ToastItem({ toast, remove }) {
  useEffect(() => {
    const timer = setTimeout(() => remove(toast.id), 3500);
    return () => clearTimeout(timer);
  }, [toast.id, remove]);

  return (
    <div className={`toast toast-${toast.type}`}>
      <span>{toast.type === 'success' ? '✓' : '✕'}</span>
      {toast.message}
    </div>
  );
}
