import React from 'react';
import { useLanguage } from '../../context/LanguageContext';

export const Analytics = () => {
  const { lang, t } = useLanguage();

  const monthlyData = [
    { month: 'Apr', sales: 18200, height: '42%' },
    { month: 'May', sales: 22400, height: '52%' },
    { month: 'Jun', sales: 26800, height: '62%' },
    { month: 'Jul', sales: 31500, height: '74%' },
    { month: 'Aug', sales: 35960, height: '84%' },
    { month: 'Sep (Now)', sales: 42580, height: '100%' },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      {/* Header */}
      <div>
        <div className="badge-pill badge-primary" style={{ marginBottom: '0.35rem' }}>
          <span className="material-symbols-outlined" style={{ fontSize: '15px' }}>insights</span>
          <span>{t('navigation.analytics', 'Performance Analytics')}</span>
        </div>
        <h1 className="headline-lg" style={{ color: 'var(--primary)' }}>
          {t('navigation.analytics', 'Enterprise Growth & Fair-Trade Impact')}
        </h1>
        <p style={{ fontSize: '0.875rem', color: 'var(--on-surface-variant)' }}>
          {t('landing.heroSubtitle', 'Detailed visibility into gross revenue, craft popularity, and community dividend distributions.')}
        </p>
      </div>

      {/* Top Bento Metrics */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.25rem' }}>
        <div className="card-base" style={{ padding: '1.5rem', backgroundColor: 'var(--surface-container-lowest)' }}>
          <div style={{ fontSize: '0.75rem', color: 'var(--outline)', textTransform: 'uppercase', fontWeight: '700' }}>
            Total Revenue (YTD)
          </div>
          <div style={{ fontFamily: 'var(--font-serif)', fontSize: '1.8rem', fontWeight: '700', color: 'var(--primary)', marginTop: '4px' }}>
            ₹1,77,440
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--success)', marginTop: '4px', fontWeight: '600' }}>
            +24.8% YoY growth
          </div>
        </div>

        <div className="card-base" style={{ padding: '1.5rem', backgroundColor: 'var(--surface-container-lowest)' }}>
          <div style={{ fontSize: '0.75rem', color: 'var(--outline)', textTransform: 'uppercase', fontWeight: '700' }}>
            Direct SHG Margin
          </div>
          <div style={{ fontFamily: 'var(--font-serif)', fontSize: '1.8rem', fontWeight: '700', color: 'var(--secondary)', marginTop: '4px' }}>
            86.2%
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--on-surface-variant)', marginTop: '4px' }}>
            Zero middleman deductions
          </div>
        </div>

        <div className="card-base" style={{ padding: '1.5rem', backgroundColor: 'var(--surface-container-lowest)' }}>
          <div style={{ fontSize: '0.75rem', color: 'var(--outline)', textTransform: 'uppercase', fontWeight: '700' }}>
            Total Units Shipped
          </div>
          <div style={{ fontFamily: 'var(--font-serif)', fontSize: '1.8rem', fontWeight: '700', color: 'var(--primary)', marginTop: '4px' }}>
            142 Crafts
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--on-surface-variant)', marginTop: '4px' }}>
            Across 14 Indian states
          </div>
        </div>

        <div className="card-base" style={{ padding: '1.5rem', backgroundColor: 'var(--surface-container-lowest)' }}>
          <div style={{ fontSize: '0.75rem', color: 'var(--outline)', textTransform: 'uppercase', fontWeight: '700' }}>
            TrustTag Scans
          </div>
          <div style={{ fontFamily: 'var(--font-serif)', fontSize: '1.8rem', fontWeight: '700', color: 'var(--primary)', marginTop: '4px' }}>
            14,280
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--success)', marginTop: '4px', fontWeight: '600' }}>
            100% Verified Authentic
          </div>
        </div>
      </div>

      {/* Visual Charts Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '2rem' }}>
        {/* Monthly Revenue Chart */}
        <div className="card-base" style={{ padding: '2rem', backgroundColor: 'var(--surface-container-lowest)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
            <div>
              <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.25rem', color: 'var(--primary)' }}>
                Monthly Revenue Growth (₹)
              </h3>
              <div style={{ fontSize: '0.75rem', color: 'var(--outline)' }}>April - September 2026</div>
            </div>
            <span className="badge-pill badge-primary">+18.4% this month</span>
          </div>

          {/* Responsive Bar Chart Visualization */}
          <div style={{ height: '220px', display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: '1rem', paddingTop: '1rem', borderBottom: '1px solid var(--border-subtle)' }}>
            {monthlyData.map((d, i) => (
              <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', height: '100%', justifyContent: 'flex-end' }}>
                <div style={{ fontSize: '0.7rem', fontWeight: '700', color: 'var(--primary)', marginBottom: '4px' }}>
                  ₹{(d.sales / 1000).toFixed(1)}k
                </div>
                <div
                  style={{
                    width: '100%',
                    maxWidth: '40px',
                    height: d.height,
                    backgroundColor: i === monthlyData.length - 1 ? 'var(--secondary)' : 'var(--primary)',
                    borderRadius: 'var(--radius-sm) var(--radius-sm) 0 0',
                    transition: 'height 0.4s ease'
                  }}
                />
                <span style={{ fontSize: '0.75rem', color: 'var(--on-surface-variant)', marginTop: '8px' }}>
                  {d.month}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Category & Regional Distribution */}
        <div className="card-cream" style={{ padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div>
            <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.25rem', color: 'var(--primary)', marginBottom: '0.25rem' }}>
              Sales by Craft Category
            </h3>
            <div style={{ fontSize: '0.75rem', color: 'var(--outline)' }}>Distribution of customer orders</div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '4px' }}>
                <span>Warli Tribal Art</span>
                <strong>48% (₹20,438)</strong>
              </div>
              <div style={{ width: '100%', height: '8px', backgroundColor: 'var(--surface-container-high)', borderRadius: '4px', overflow: 'hidden' }}>
                <div style={{ width: '48%', height: '100%', backgroundColor: 'var(--primary)' }} />
              </div>
            </div>

            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '4px' }}>
                <span>Paithani Textiles & Silks</span>
                <strong>32% (₹13,625)</strong>
              </div>
              <div style={{ width: '100%', height: '8px', backgroundColor: 'var(--surface-container-high)', borderRadius: '4px', overflow: 'hidden' }}>
                <div style={{ width: '32%', height: '100%', backgroundColor: 'var(--secondary)' }} />
              </div>
            </div>

            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '4px' }}>
                <span>Clay & Terracotta Pottery</span>
                <strong>20% (₹8,517)</strong>
              </div>
              <div style={{ width: '100%', height: '8px', backgroundColor: 'var(--surface-container-high)', borderRadius: '4px', overflow: 'hidden' }}>
                <div style={{ width: '20%', height: '100%', backgroundColor: 'var(--surface-tint)' }} />
              </div>
            </div>
          </div>

          <div style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: '1rem' }}>
            <h4 style={{ fontSize: '0.85rem', fontWeight: '700', color: 'var(--primary)', marginBottom: '0.5rem', textTransform: 'uppercase' }}>
              Top Buyer Locations
            </h4>
            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', fontSize: '0.75rem' }}>
              <span className="badge-pill badge-primary">Pune (42%)</span>
              <span className="badge-pill badge-secondary">Mumbai (35%)</span>
              <span className="badge-pill badge-primary">Bengaluru (12%)</span>
              <span className="badge-pill badge-secondary">Delhi NCR (11%)</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
