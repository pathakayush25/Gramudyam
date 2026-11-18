import React, { useState } from 'react';
import { useProducts } from '../../context/ProductContext';
import { useLanguage } from '../../context/LanguageContext';
import { aiService } from '../../services/aiService';

export const AIQualityScore = () => {
  const { products } = useProducts();
  const { lang, t, getLocalizedField } = useLanguage();
  const [selectedProductId, setSelectedProductId] = useState(products[0]?.id || '1');

  const activeProduct = products.find((p) => String(p.id) === String(selectedProductId)) || products[0];
  const audit = aiService.calculateQualityScore(activeProduct);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      {/* Header & Product Selector */}
      <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'flex-start', justifyContent: 'space-between', gap: '1.5rem' }}>
        <div>
          <div className="badge-pill badge-primary" style={{ marginBottom: '0.35rem' }}>
            <span className="material-symbols-outlined" style={{ fontSize: '15px' }}>verified</span>
            <span>{t('qualityScore', 'AI Product Quality Score')} • गुणवत्ता विश्लेषण</span>
          </div>
          <h1 className="headline-lg" style={{ color: 'var(--primary)' }}>
            {t('qualityScore', 'AI Product Quality Score')}
          </h1>
          <p style={{ fontSize: '0.875rem', color: 'var(--on-surface-variant)' }}>
            {t('product.craftDetails', 'Evaluates your craft title, photos, fair pricing, and ancestral story to maximize conversion and buyer trust.')}
          </p>
        </div>

        {/* Product selector dropdown */}
        <div style={{ minWidth: '260px' }}>
          <label className="label-field">Select Product to Audit:</label>
          <select
            value={selectedProductId}
            onChange={(e) => setSelectedProductId(e.target.value)}
            className="select-base"
          >
            {products.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Main Bento Score Layout */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '2rem', alignItems: 'flex-start' }}>
        {/* Score Gauge Card */}
        <div
          className="card-base"
          style={{
            padding: '2.5rem',
            backgroundColor: 'var(--surface-container-lowest)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            textAlign: 'center',
            gap: '1.25rem'
          }}
        >
          {/* Big Circular Score Display */}
          <div
            style={{
              width: '140px',
              height: '140px',
              borderRadius: '50%',
              border: '6px solid var(--success)',
              backgroundColor: 'var(--success-container)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: 'var(--shadow-md)'
            }}
          >
            <span style={{ fontFamily: 'var(--font-serif)', fontSize: '2.75rem', fontWeight: '700', color: 'var(--primary)', lineHeight: 1 }}>
              {audit.score}
            </span>
            <span style={{ fontSize: '0.8rem', color: 'var(--outline)', fontWeight: '700' }}>
              / {audit.maxScore}
            </span>
          </div>

          <div>
            <span className="badge-pill badge-success" style={{ fontSize: '0.85rem', padding: '0.35rem 1rem' }}>
              {audit.level} Quality Rating
            </span>
            <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.25rem', color: 'var(--primary)', marginTop: '0.75rem' }}>
              {activeProduct?.name}
            </h3>
            <div style={{ fontSize: '0.85rem', color: 'var(--on-surface-variant)', marginTop: '2px' }}>
              {activeProduct?.artisan?.village} • {activeProduct?.category}
            </div>
          </div>

          <div style={{ backgroundColor: 'var(--surface-container-low)', padding: '0.85rem', borderRadius: 'var(--radius-md)', fontSize: '0.8rem', color: 'var(--on-surface-variant)', width: '100%' }}>
            High-scoring products receive automatic featured placement on the Gramudyam homepage and partner exhibitions.
          </div>
        </div>

        {/* Checklist & Actionable Recommendations */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {/* Compliance Checklist */}
          <div className="card-base" style={{ padding: '1.75rem', backgroundColor: 'var(--surface-container-lowest)' }}>
            <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.15rem', color: 'var(--primary)', marginBottom: '1rem' }}>
              Quality Factor Checklist
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {audit.checks.map((c, idx) => (
                <div key={idx} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem' }}>
                  <span
                    className="material-symbols-outlined"
                    style={{
                      color: c.passed ? 'var(--success)' : 'var(--warning)',
                      fontSize: '20px',
                      marginTop: '2px'
                    }}
                  >
                    {c.passed ? 'check_circle' : 'warning'}
                  </span>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: '0.9rem', fontWeight: '700', color: 'var(--on-surface)' }}>
                      {c.title}
                    </div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--on-surface-variant)' }}>
                      {c.note}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* AI Improvement Suggestions */}
          <div className="card-cream" style={{ padding: '1.75rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
              <span className="material-symbols-outlined" style={{ color: 'var(--secondary)' }}>lightbulb</span>
              <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.15rem', color: 'var(--primary)' }}>
                AI Recommendations to Boost Conversion
              </h3>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem', fontSize: '0.85rem', color: 'var(--on-surface-variant)' }}>
              {audit.suggestions.map((s, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <span className="material-symbols-outlined" style={{ color: 'var(--secondary)', fontSize: '16px' }}>arrow_right</span>
                  <span>{s}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
