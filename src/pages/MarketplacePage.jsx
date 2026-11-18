import React, { useState } from 'react';
import { useProducts } from '../context/ProductContext';
import { useLanguage } from '../context/LanguageContext';
import { categoriesList, villageClustersList } from '../data/mockData';
import { ProductGrid } from '../components/ProductGrid';
import { useNavigate } from 'react-router-dom';

export const MarketplacePage = () => {
  const {
    filteredProducts,
    searchTerm,
    setSearchTerm,
    selectedCategory,
    setSelectedCategory,
    selectedClusters,
    setSelectedClusters,
    maxPrice,
    setMaxPrice,
    sortBy,
    setSortBy
  } = useProducts();

  const { lang, t } = useLanguage();
  const navigate = useNavigate();
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  const toggleCluster = (cluster) => {
    setSelectedClusters((prev) =>
      prev.includes(cluster) ? prev.filter((c) => c !== cluster) : [...prev, cluster]
    );
  };

  const handleResetFilters = () => {
    setSearchTerm('');
    setSelectedCategory('all');
    setSelectedClusters([]);
    setMaxPrice(20000);
    setSortBy('featured');
  };

  return (
    <div className="content-top-spacer" style={{ width: '100%', paddingBottom: '4rem' }}>
      <div className="container" style={{ paddingTop: '2rem' }}>
        {/* ================= HERO INTRO BANNER ================= */}
        <div
          className="card-cream"
          style={{
            position: 'relative',
            overflow: 'hidden',
            padding: '2.5rem 2rem',
            marginBottom: '2rem',
            boxShadow: 'var(--shadow-sm)'
          }}
        >
          {/* Ambient Glows */}
          <div
            style={{
              position: 'absolute',
              top: '-40px',
              right: '-40px',
              width: '240px',
              height: '240px',
              borderRadius: '50%',
              backgroundColor: 'rgba(201, 111, 74, 0.1)',
              filter: 'blur(50px)',
              pointerEvents: 'none'
            }}
          />

          <div style={{ position: 'relative', zIndex: 1, maxWidth: '760px' }}>
            <div className="badge-pill badge-secondary" style={{ marginBottom: '0.75rem' }}>
              <span className="material-symbols-outlined" style={{ fontSize: '15px' }}>eco</span>
              <span>{t('marketplace.giCertified', 'GI Certified')} • {t('navigation.brandSubtitleMr', 'महाराष्ट्र ग्रामीण उपक्रम')}</span>
            </div>

            <h1 className="display-lg" style={{ color: 'var(--primary)', lineHeight: 1.15, marginBottom: '0.75rem' }}>
              {t('marketplace.title', 'Artisanal Marketplace')}{' '}
              <span style={{ display: 'block', color: 'var(--secondary)', fontStyle: 'italic', fontWeight: '400', fontSize: '0.85em' }}>
                ({t('landing.eyebrow', 'स्थानिक कला आणि उत्पादने')})
              </span>
            </h1>

            <p className="body-lg" style={{ color: 'var(--on-surface-variant)', marginBottom: '1.5rem' }}>
              {t('marketplace.subtitle', 'Shop authentic, GI-tagged crafts, handlooms, and organic produce directly from verified rural entrepreneurs, tribal collectives, and women-led SHGs across Maharashtra.')}
            </p>

            {/* Search Bar + Voice Input CTA */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem', alignItems: 'center', marginBottom: '1rem' }}>
              <div style={{ position: 'relative', flex: '1 1 280px' }}>
                <span
                  className="material-symbols-outlined"
                  style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--outline)' }}
                >
                  search
                </span>
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder={t('marketplace.searchPlaceholder', t('searchPlaceholder'))}
                  className="input-base"
                  style={{ paddingLeft: '2.75rem', paddingRight: '1rem', height: '48px', borderRadius: 'var(--radius-md)' }}
                />
              </div>

              <button
                type="button"
                onClick={() => navigate('/entrepreneur/voice-create')}
                className="btn-secondary"
                style={{ height: '48px', padding: '0 1.25rem', gap: '0.5rem' }}
                title={t('marketplace.speakSearchBtn', 'Speak to Search')}
              >
                <span className="material-symbols-outlined">mic</span>
                <span>{t('marketplace.speakSearchBtn', 'Speak to Search')}</span>
              </button>
            </div>

            {/* Popular Search Tags */}
            <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '0.5rem', fontSize: '0.75rem' }}>
              <span style={{ color: 'var(--outline)', fontWeight: '700', textTransform: 'uppercase' }}>
                {t('common.filter', 'Popular')}:
              </span>
              {['Warli Tarpa', 'Yeola Silk', 'Terracotta Pots', 'Wild Honey', 'Kolhapuri Leather'].map((tag) => (
                <button
                  key={tag}
                  onClick={() => setSearchTerm(tag)}
                  style={{
                    backgroundColor: 'var(--surface-container-lowest)',
                    padding: '3px 10px',
                    borderRadius: 'var(--radius-full)',
                    color: 'var(--on-surface-variant)',
                    border: '1px solid var(--border-subtle)',
                    fontSize: '0.75rem'
                  }}
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* ================= CATEGORIES HORIZONTAL TABS ================= */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.6rem',
            overflowX: 'auto',
            paddingBottom: '0.75rem',
            marginBottom: '2rem'
          }}
        >
          {categoriesList.map((cat) => {
            const isSelected = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.4rem',
                  padding: '0.6rem 1.1rem',
                  borderRadius: 'var(--radius-md)',
                  fontSize: '0.85rem',
                  fontWeight: isSelected ? '700' : '500',
                  whiteSpace: 'nowrap',
                  backgroundColor: isSelected ? 'var(--primary)' : 'var(--surface-container)',
                  color: isSelected ? 'var(--on-primary)' : 'var(--on-surface-variant)',
                  border: isSelected ? 'none' : '1px solid var(--border-subtle)',
                  boxShadow: isSelected ? 'var(--shadow-sm)' : 'none',
                  transition: 'all 0.15s ease'
                }}
              >
                <span
                  className="material-symbols-outlined"
                  style={{ fontSize: '18px', color: isSelected ? 'var(--on-primary)' : 'var(--secondary)' }}
                >
                  {cat.icon}
                </span>
                <span>{lang === 'mr' ? cat.labelMr : lang === 'hi' ? (cat.labelHi || cat.label) : cat.label}</span>
              </button>
            );
          })}
        </div>

        {/* ================= MAIN CONTENT: SIDEBAR + PRODUCT GRID ================= */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(12, 1fr)', gap: '2rem', alignItems: 'flex-start' }}>
          {/* Filter Trigger on Mobile */}
          <div style={{ gridColumn: '1 / -1', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }} className="filter-mobile-toggle">
            <button
              onClick={() => setMobileFilterOpen(!mobileFilterOpen)}
              className="btn-cream"
              style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}
            >
              <span className="material-symbols-outlined">tune</span>
              <span>{t('common.filter', 'Filter Crafts')} ({selectedClusters.length + (selectedCategory !== 'all' ? 1 : 0)})</span>
            </button>

            {/* Sorting Dropdown */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span style={{ fontSize: '0.8rem', color: 'var(--on-surface-variant)' }}>{t('common.sortBy', 'Sort')}:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="select-base"
                style={{ padding: '0.4rem 0.75rem', width: 'auto', fontSize: '0.8rem' }}
              >
                <option value="featured">{t('marketplace.sortRecommended', 'Featured Artisanal')}</option>
                <option value="price-low">{t('marketplace.sortPriceAsc', 'Price: Low to High')}</option>
                <option value="price-high">{t('marketplace.sortPriceDesc', 'Price: High to Low')}</option>
                <option value="rating">{t('marketplace.sortNewest', 'Highest Rated')}</option>
              </select>
            </div>
          </div>

          {/* Left Sidebar Filter Panel (Col 1-3) */}
          <aside
            className={`marketplace-sidebar ${mobileFilterOpen ? 'mobile-show' : ''}`}
            style={{
              backgroundColor: 'var(--surface-container-low)',
              borderRadius: 'var(--radius-lg)',
              padding: '1.5rem',
              border: '1px solid var(--border-subtle)',
              display: 'flex',
              flexDirection: 'column',
              gap: '1.5rem'
            }}
          >
            {/* Header & Reset Button */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span className="material-symbols-outlined" style={{ color: 'var(--primary)' }}>tune</span>
                <span style={{ fontFamily: 'var(--font-serif)', fontSize: '1.1rem', fontWeight: '700', color: 'var(--primary)' }}>
                  {t('common.filter', 'Filters')}
                </span>
              </div>
              <button
                onClick={handleResetFilters}
                style={{ fontSize: '0.75rem', fontWeight: '700', color: 'var(--secondary)', textTransform: 'uppercase' }}
              >
                {t('marketplace.clearFilters', 'Reset All')}
              </button>
            </div>

            {/* Price Range Slider */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', fontWeight: '600', marginBottom: '0.5rem' }}>
                <span style={{ color: 'var(--on-surface)' }}>{t('marketplace.priceRange', 'Max Price')}</span>
                <span style={{ color: 'var(--secondary)' }}>₹{maxPrice.toLocaleString('en-IN')}</span>
              </div>
              <input
                type="range"
                min="500"
                max="20000"
                step="500"
                value={maxPrice}
                onChange={(e) => setMaxPrice(Number(e.target.value))}
                style={{ width: '100%', accentColor: 'var(--primary)', cursor: 'pointer' }}
              />
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: 'var(--outline)', marginTop: '4px' }}>
                <span>₹500</span>
                <span>₹20,000+</span>
              </div>
            </div>

            {/* Regional Village Cluster Filters */}
            <div>
              <span style={{ display: 'block', fontSize: '0.9rem', fontWeight: '700', color: 'var(--primary)', marginBottom: '0.75rem' }}>
                {t('product.originDistrict', 'Craft Cluster / Village')}
              </span>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                {villageClustersList.map((cluster) => (
                  <label
                    key={cluster}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.6rem',
                      fontSize: '0.85rem',
                      color: 'var(--on-surface-variant)',
                      cursor: 'pointer'
                    }}
                  >
                    <input
                      type="checkbox"
                      checked={selectedClusters.includes(cluster)}
                      onChange={() => toggleCluster(cluster)}
                      style={{ accentColor: 'var(--primary)', width: '16px', height: '16px' }}
                    />
                    <span>{cluster}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Certified Trust Guarantee Card */}
            <div
              style={{
                backgroundColor: 'var(--surface-container)',
                padding: '1rem',
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--border-subtle)',
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem'
              }}
            >
              <span className="material-symbols-outlined" style={{ color: 'var(--secondary)', fontSize: '24px' }}>
                verified_user
              </span>
              <div style={{ fontSize: '0.75rem', color: 'var(--on-surface-variant)' }}>
                <strong>{t('marketplace.dbtVerified', '100% Direct Remittance')}</strong>
                <div>{t('product.trustTagVerified', 'Every product includes verifiable QR TrustTag code.')}</div>
              </div>
            </div>
          </aside>

          {/* Right Product Grid Area (Col 4-12) */}
          <section className="marketplace-grid-area" style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--primary)', fontWeight: '600', fontSize: '0.9rem' }}>
                <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>verified</span>
                <span>{t('marketplace.craftsFound', { count: filteredProducts.length })}</span>
              </div>
            </div>

            <ProductGrid products={filteredProducts} />
          </section>
        </div>
      </div>

      <style>{`
        @media (min-width: 900px) {
          .marketplace-sidebar {
            grid-column: span 3;
            display: flex !important;
          }
          .marketplace-grid-area {
            grid-column: span 9;
          }
          .filter-mobile-toggle {
            display: none !important;
          }
        }
        @media (max-width: 899px) {
          .marketplace-sidebar {
            display: none;
            grid-column: 1 / -1;
          }
          .marketplace-sidebar.mobile-show {
            display: flex !important;
          }
          .marketplace-grid-area {
            grid-column: 1 / -1;
          }
        }
      `}</style>
    </div>
  );
};
