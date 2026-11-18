import React from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useLanguage } from '../context/LanguageContext';

export const ProductCard = ({ product }) => {
  const { addToCart } = useCart();
  const { lang, t } = useLanguage();

  const title = (lang === 'mr' && product.nameMr) ? product.nameMr : (lang === 'hi' && product.nameHi) ? product.nameHi : product.name;
  const artisanName = (lang === 'mr' && product.artisan?.nameMr) ? product.artisan.nameMr : (lang === 'hi' && product.artisan?.nameHi) ? product.artisan.nameHi : product.artisan?.name;
  const giLabel = (lang === 'mr' && product.giTagLabelMr) ? product.giTagLabelMr : (lang === 'hi' && product.giTagLabelHi) ? product.giTagLabelHi : (product.giTagLabel || 'Artisan Direct');
  const villageCluster = `${product.artisan?.village || ''} (${product.artisan?.district || ''})`.trim();

  return (
    <div
      className="card-base card-hover"
      style={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        padding: '1rem',
        height: '100%'
      }}
    >
      <div>
        {/* Visual Image Container with Pill Badges */}
        <div
          style={{
            position: 'relative',
            aspectRatio: '1/1',
            borderRadius: 'var(--radius-md)',
            overflow: 'hidden',
            backgroundColor: 'var(--surface-container)',
            marginBottom: '0.85rem'
          }}
        >
          <img
            src={product.image}
            alt={product.name}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              transition: 'transform 0.4s ease'
            }}
            onMouseOver={(e) => (e.currentTarget.style.transform = 'scale(1.05)')}
            onMouseOut={(e) => (e.currentTarget.style.transform = 'scale(1)')}
          />

          {/* Top-left GI Tag / Provenance Chip */}
          <div
            style={{
              position: 'absolute',
              top: '8px',
              left: '8px',
              backgroundColor: 'rgba(255, 249, 235, 0.95)',
              backdropFilter: 'blur(4px)',
              padding: '2px 8px',
              borderRadius: 'var(--radius-full)',
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              boxShadow: 'var(--shadow-sm)'
            }}
          >
            <span className="material-symbols-outlined" style={{ fontSize: '13px', color: 'var(--secondary)' }}>
              local_offer
            </span>
            <span style={{ fontSize: '0.68rem', fontWeight: '600', color: 'var(--primary)' }}>
              {giLabel}
            </span>
          </div>

          {/* Bottom-right TrustTag pill linking to verification */}
          <Link
            to={`/verify/${product.trustTagId || product.id}`}
            title="Verify Authentic Provenance"
            style={{
              position: 'absolute',
              bottom: '8px',
              right: '8px',
              backgroundColor: 'var(--tertiary-fixed)',
              color: 'var(--primary)',
              padding: '3px 8px',
              borderRadius: 'var(--radius-sm)',
              fontSize: '0.68rem',
              fontWeight: '700',
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              boxShadow: 'var(--shadow-sm)',
              textDecoration: 'none'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <span className="material-symbols-outlined" style={{ fontSize: '14px' }}>
              qr_code_scanner
            </span>
            <span>TrustTag</span>
          </Link>
        </div>

        {/* Artisan Attribution Row */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginBottom: '0.35rem', color: 'var(--on-surface-variant)', fontSize: '0.75rem' }}>
          <span className="material-symbols-outlined" style={{ fontSize: '14px', color: 'var(--secondary)' }}>
            person
          </span>
          <span style={{ fontWeight: '500' }}>
            {artisanName} • {villageCluster}
          </span>
        </div>

        {/* Product Title */}
        <Link to={`/product/${product.id}`} style={{ textDecoration: 'none' }}>
          <h3
            style={{
              fontFamily: 'var(--font-serif)',
              fontSize: '1.05rem',
              fontWeight: '700',
              color: 'var(--primary)',
              lineHeight: '1.35',
              marginBottom: '0.5rem',
              transition: 'color 0.2s ease'
            }}
            onMouseOver={(e) => (e.currentTarget.style.color = 'var(--secondary)')}
            onMouseOut={(e) => (e.currentTarget.style.color = 'var(--primary)')}
          >
            {title}
          </h3>
        </Link>

        {/* Ratings Row */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', marginBottom: '0.75rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', color: 'var(--secondary)' }}>
            <span className="material-symbols-outlined" style={{ fontSize: '16px', fontVariationSettings: "'FILL' 1" }}>
              star
            </span>
            <span style={{ fontSize: '0.75rem', fontWeight: '700', marginLeft: '2px' }}>
              {product.rating}
            </span>
          </div>
          <span style={{ fontSize: '0.75rem', color: 'var(--outline)' }}>
            ({product.reviewsCount || 42} {t('product.reviews', 'reviews')})
          </span>
        </div>
      </div>

      {/* Bottom Row: Price & Action */}
      <div
        style={{
          borderTop: '1px solid var(--border-subtle)',
          paddingTop: '0.75rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '0.5rem'
        }}
      >
        <div>
          <div style={{ fontSize: '0.68rem', color: 'var(--on-surface-variant)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
            {t('product.retailPrice', 'Direct Price')}
          </div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.35rem' }}>
            <span style={{ fontFamily: 'var(--font-serif)', fontSize: '1.25rem', fontWeight: '700', color: 'var(--primary)' }}>
              ₹{product.price?.toLocaleString('en-IN')}
            </span>
            {product.originalPrice && product.originalPrice > product.price && (
              <span style={{ fontSize: '0.8rem', color: 'var(--outline)', textDecoration: 'line-through' }}>
                ₹{product.originalPrice?.toLocaleString('en-IN')}
              </span>
            )}
          </div>
        </div>

        {/* Add To Cart Quick Action */}
        <button
          onClick={() => addToCart(product, 1)}
          className="btn-secondary btn-sm"
          style={{ padding: '0.5rem 0.85rem' }}
          title="Add to Shopping Cart"
        >
          <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>add_shopping_cart</span>
          <span>{t('addToCart')}</span>
        </button>
      </div>
    </div>
  );
};
