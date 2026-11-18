import React from 'react';
import { ProductCard } from './ProductCard';

export const ProductGrid = ({ products = [] }) => {
  if (products.length === 0) {
    return (
      <div
        className="card-cream"
        style={{
          padding: '3rem 2rem',
          textAlign: 'center',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '1rem',
          width: '100%'
        }}
      >
        <span className="material-symbols-outlined" style={{ fontSize: '48px', color: 'var(--outline)' }}>
          search_off
        </span>
        <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.25rem', color: 'var(--primary)' }}>
          No artisanal crafts match your filters
        </h3>
        <p style={{ fontSize: '0.875rem', color: 'var(--on-surface-variant)', maxWidth: '400px' }}>
          Try clearing search terms or selecting another craft cluster or category to explore more verified products.
        </p>
      </div>
    );
  }

  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
        gap: '1.5rem',
        width: '100%'
      }}
    >
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
};
