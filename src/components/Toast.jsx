import React from 'react';
import { useCart } from '../context/CartContext';

export const Toast = () => {
  const { toastMessage } = useCart();

  if (!toastMessage) return null;

  return (
    <div className="toast-container">
      <div className="toast">
        <span className="material-symbols-outlined" style={{ color: 'var(--primary)', fontSize: '20px' }}>
          check_circle
        </span>
        <span style={{ fontSize: '0.85rem', fontWeight: '500', color: 'var(--on-surface)' }}>
          {toastMessage}
        </span>
      </div>
    </div>
  );
};
