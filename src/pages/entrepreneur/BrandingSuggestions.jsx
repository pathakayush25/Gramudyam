import React, { useState } from 'react';
import { useProducts } from '../../context/ProductContext';
import { useCart } from '../../context/CartContext';
import { useLanguage } from '../../context/LanguageContext';
import { aiService } from '../../services/aiService';

export const BrandingSuggestions = () => {
  const { products } = useProducts();
  const { addToCart } = useCart(); // to trigger toast
  const { lang, t } = useLanguage();

  const [selectedProductId, setSelectedProductId] = useState(products[0]?.id || '1');
  const [copyToast, setCopyToast] = useState(null);

  const activeProduct = products.find((p) => String(p.id) === String(selectedProductId)) || products[0];
  const [suggestions, setSuggestions] = useState(() => aiService.generateBrandingSuggestions(activeProduct));

  const handleRegenerate = () => {
    setSuggestions(aiService.generateBrandingSuggestions(activeProduct));
    setCopyToast('Generated fresh branding ideas!');
    setTimeout(() => setCopyToast(null), 2500);
  };

  const copyToClipboard = (text, label) => {
    navigator.clipboard.writeText(text);
    setCopyToast(`Copied ${label} to clipboard!`);
    setTimeout(() => setCopyToast(null), 2500);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      {/* Header */}
      <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'flex-start', justifyContent: 'space-between', gap: '1.5rem' }}>
        <div>
          <div className="badge-pill badge-secondary" style={{ marginBottom: '0.35rem' }}>
            <span className="material-symbols-outlined" style={{ fontSize: '15px' }}>auto_awesome</span>
            <span>{t('brandingSuggestions', 'Generative AI Branding Assistant')}</span>
          </div>
          <h1 className="headline-lg" style={{ color: 'var(--primary)' }}>
            {t('brandingSuggestions', 'AI Branding & Marketing Suggestions')}
          </h1>
          <p style={{ fontSize: '0.875rem', color: 'var(--on-surface-variant)' }}>
            {t('landing.heroSubtitle', 'Empowering rural makers with polished headlines, cultural taglines, and social media captions ready for Instagram & WhatsApp.')}
          </p>
        </div>

        {/* Product selector & Regenerate */}
        <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-end', flexWrap: 'wrap' }}>
          <div>
            <label className="label-field">Craft Listing:</label>
            <select
              value={selectedProductId}
              onChange={(e) => {
                setSelectedProductId(e.target.value);
                const prod = products.find((p) => String(p.id) === String(e.target.value));
                setSuggestions(aiService.generateBrandingSuggestions(prod));
              }}
              className="select-base"
              style={{ minWidth: '240px' }}
            >
              {products.map((p) => (
                <option key={p.id} value={p.id}>{p.name}</option>
              ))}
            </select>
          </div>

          <button onClick={handleRegenerate} className="btn-secondary">
            <span className="material-symbols-outlined">refresh</span>
            <span>Regenerate (पुन्हा बनवा)</span>
          </button>
        </div>
      </div>

      {copyToast && (
        <div style={{ backgroundColor: 'var(--primary-container)', color: 'white', padding: '0.75rem 1.25rem', borderRadius: 'var(--radius-md)', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <span className="material-symbols-outlined">check_circle</span>
          <span>{copyToast}</span>
        </div>
      )}

      {/* Branding Bento Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.75rem' }}>
        {/* 1. Evocative Product Titles */}
        <div className="card-base" style={{ padding: '1.75rem', backgroundColor: 'var(--surface-container-lowest)' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
            <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.2rem', color: 'var(--primary)' }}>
              Marketplace Titles
            </h3>
            <span className="badge-pill badge-primary">High SEO</span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {suggestions.titles?.map((title, i) => (
              <div key={i} style={{ backgroundColor: 'var(--surface-container-low)', padding: '0.75rem 1rem', borderRadius: 'var(--radius-md)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '0.85rem', fontWeight: '600', color: 'var(--on-surface)' }}>{title}</span>
                <button
                  onClick={() => copyToClipboard(title, 'Title')}
                  className="btn-cream btn-sm"
                  title="Copy Title"
                >
                  <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>content_copy</span>
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* 2. Cultural Taglines */}
        <div className="card-base" style={{ padding: '1.75rem', backgroundColor: 'var(--surface-container-lowest)' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
            <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.2rem', color: 'var(--primary)' }}>
              Brand Taglines
            </h3>
            <span className="badge-pill badge-secondary">Emotional Hook</span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {suggestions.taglines?.map((tagline, i) => (
              <div key={i} style={{ backgroundColor: 'var(--surface-container-low)', padding: '0.75rem 1rem', borderRadius: 'var(--radius-md)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '0.85rem', fontStyle: 'italic', color: 'var(--primary)' }}>"{tagline}"</span>
                <button
                  onClick={() => copyToClipboard(tagline, 'Tagline')}
                  className="btn-cream btn-sm"
                  title="Copy Tagline"
                >
                  <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>content_copy</span>
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* 3. Instagram & WhatsApp Social Post */}
        <div className="card-cream" style={{ padding: '1.75rem', gridColumn: '1 / -1' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span className="material-symbols-outlined" style={{ color: 'var(--secondary)' }}>share</span>
              <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.25rem', color: 'var(--primary)' }}>
                Social Media Caption (Instagram / WhatsApp Broadcast)
              </h3>
            </div>
            <button
              onClick={() => copyToClipboard(suggestions.socialCaption, 'Social Caption')}
              className="btn-primary btn-sm"
            >
              <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>content_copy</span>
              <span>Copy Full Caption</span>
            </button>
          </div>

          <div style={{ backgroundColor: 'var(--surface-container-lowest)', padding: '1.25rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)', fontSize: '0.9rem', color: 'var(--on-surface)', lineHeight: 1.7 }}>
            {suggestions.socialCaption}
          </div>
        </div>

        {/* 4. Packaging Thank You Note */}
        <div className="card-base" style={{ padding: '1.75rem', backgroundColor: 'var(--surface-container-lowest)', gridColumn: '1 / -1' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span className="material-symbols-outlined" style={{ color: 'var(--primary)' }}>inventory_2</span>
              <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.25rem', color: 'var(--primary)' }}>
                Printed Packaging Inserts Note
              </h3>
            </div>
            <button
              onClick={() => copyToClipboard(suggestions.packagingNote, 'Packaging Note')}
              className="btn-cream btn-sm"
            >
              <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>content_copy</span>
              <span>Copy Note</span>
            </button>
          </div>

          <p style={{ fontStyle: 'italic', fontSize: '0.95rem', color: 'var(--on-surface-variant)', lineHeight: 1.6 }}>
            "{suggestions.packagingNote}"
          </p>
        </div>
      </div>
    </div>
  );
};
