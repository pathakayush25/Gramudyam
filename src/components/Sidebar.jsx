import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';

export const Sidebar = ({ mobileOpen, setMobileOpen }) => {
  const location = useLocation();
  const { user, logout } = useAuth();
  const { lang, t } = useLanguage();

  const navItems = [
    { path: '/entrepreneur/dashboard', key: 'navigation.dashboard', label: 'Dashboard', labelHi: 'डैशबोर्ड', labelMr: 'डॅशबोर्ड', icon: 'grid_view' },
    { path: '/entrepreneur/onboarding', key: 'entrepreneur.onboarding', label: 'Onboarding', labelHi: 'पंजीकरण / सत्यापन', labelMr: 'नोंदणी / पडताळणी', icon: 'how_to_reg' },
    { path: '/entrepreneur/voice-create', key: 'entrepreneur.voiceStudioBtn', label: 'Voice Product Creation', labelHi: 'बोलकर उत्पाद निर्माण', labelMr: 'बोलून उत्पादन नोंदणी', icon: 'mic', highlight: true },
    { path: '/entrepreneur/product-preview', key: 'entrepreneur.productPreview', label: 'Product Preview', labelHi: 'उत्पाद पूर्वावलोकन', labelMr: 'उत्पादन पूर्वावलोकन', icon: 'visibility' },
    { path: '/entrepreneur/quality-score', key: 'qualityScore', label: 'AI Quality Score', labelHi: 'AI गुणवत्ता स्कोर', labelMr: 'AI गुणवत्ता गुण', icon: 'verified' },
    { path: '/entrepreneur/branding', key: 'brandingSuggestions', label: 'AI Branding', labelHi: 'AI ब्रांडिंग', labelMr: 'AI ब्रँडिंग सूचना', icon: 'auto_awesome' },
    { path: '/entrepreneur/trusttag', key: 'trustTag', label: 'QR TrustTag', labelHi: 'QR ट्रस्टटैग', labelMr: 'QR ट्रस्टटॅग निर्मिती', icon: 'qr_code_2' },
    { path: '/entrepreneur/products', key: 'entrepreneur.myProductsTitle', label: 'My Products', labelHi: 'मेरी शिल्प सूची', labelMr: 'माझी उत्पादने', icon: 'inventory_2' },
    { path: '/entrepreneur/orders', key: 'navigation.orders', label: 'Orders', labelHi: 'ऑर्डर्स व्यवस्थापन', labelMr: 'ऑर्डर्स व्यवस्थापन', icon: 'local_shipping' },
    { path: '/entrepreneur/logistics', key: 'navigation.logistics', label: 'Logistics', labelHi: 'लॉजिस्टिक्स व ट्रैकिंग', labelMr: 'लॉजिस्टिक्स व ट्रॅकिंग', icon: 'route' },
    { path: '/entrepreneur/analytics', key: 'navigation.analytics', label: 'Analytics', labelHi: 'व्यवसाय विश्लेषण', labelMr: 'व्यवसाय विश्लेषण', icon: 'insights' },
  ];

  const isActive = (p) => location.pathname === p;

  return (
    <aside className={`sidebar-panel ${mobileOpen ? 'open' : ''}`}>
      {/* Brand Header */}
      <div style={{ padding: '1.25rem 1.5rem', display: 'flex', alignItems: 'center', gap: '0.75rem', borderBottom: '1px solid var(--border-subtle)' }}>
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', textDecoration: 'none' }}>
          <img
            src="/logo.png"
            alt="Emblem"
            style={{ width: '36px', height: '36px', objectFit: 'contain', borderRadius: '50%' }}
            onError={(e) => { e.target.onerror = null; e.target.src = "/logo.svg"; }}
          />
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <span style={{ fontFamily: 'var(--font-serif)', fontSize: '1.2rem', fontWeight: '700', color: 'var(--primary)', lineHeight: 1 }}>
              GRAMUDYAM
            </span>
            <span style={{ fontSize: '0.65rem', color: 'var(--secondary)', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: '700', marginTop: '2px' }}>
              ग्रामीण उद्यम मंच
            </span>
          </div>
        </Link>
      </div>

      {/* Navigation Links */}
      <div style={{ flex: 1, padding: '0.75rem', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
        {navItems.map((item) => {
          const active = isActive(item.path);
          return (
            <Link
              key={item.path}
              to={item.path}
              onClick={() => setMobileOpen && setMobileOpen(false)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem',
                padding: '0.6rem 0.85rem',
                borderRadius: 'var(--radius-md)',
                fontSize: '0.85rem',
                fontWeight: active ? '600' : '500',
                backgroundColor: active ? 'var(--primary-container)' : 'transparent',
                color: active ? 'var(--on-primary)' : 'var(--on-surface-variant)',
                boxShadow: active ? 'var(--shadow-sm)' : 'none',
                transition: 'all 0.15s ease',
                textDecoration: 'none'
              }}
              onMouseOver={(e) => {
                if (!active) {
                  e.currentTarget.style.backgroundColor = 'var(--surface-container-high)';
                  e.currentTarget.style.color = 'var(--on-surface)';
                }
              }}
              onMouseOut={(e) => {
                if (!active) {
                  e.currentTarget.style.backgroundColor = 'transparent';
                  e.currentTarget.style.color = 'var(--on-surface-variant)';
                }
              }}
            >
              <span className="material-symbols-outlined" style={{ fontSize: '19px', color: active ? 'var(--on-primary)' : item.highlight ? 'var(--secondary)' : 'inherit' }}>
                {item.icon}
              </span>
              <span>{t(item.key, lang === 'mr' ? item.labelMr : lang === 'hi' ? item.labelHi : item.label)}</span>
              {item.highlight && !active && (
                <span style={{ marginLeft: 'auto', width: '6px', height: '6px', borderRadius: '50%', backgroundColor: 'var(--secondary)' }}></span>
              )}
            </Link>
          );
        })}
      </div>

      {/* Bottom Helpline & Artisan Profile */}
      <div style={{ padding: '1rem', borderTop: '1px solid var(--border-subtle)', backgroundColor: 'var(--surface-container-low)', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
        {/* Helpline Widget */}
        <div
          style={{
            backgroundColor: 'var(--surface-container)',
            padding: '0.65rem 0.75rem',
            borderRadius: 'var(--radius-md)',
            display: 'flex',
            alignItems: 'center',
            gap: '0.6rem',
            border: '1px solid var(--border-subtle)'
          }}
        >
          <span className="material-symbols-outlined" style={{ color: 'var(--secondary)', fontSize: '22px' }}>
            support_agent
          </span>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <span style={{ fontSize: '0.65rem', color: 'var(--secondary)', textTransform: 'uppercase', fontWeight: '700' }}>
              {t('common.helpline', 'Helpline')}
            </span>
            <span style={{ fontFamily: 'var(--font-serif)', fontSize: '0.9rem', fontWeight: '700', color: 'var(--primary)' }}>
              1800-200-8899
            </span>
          </div>
        </div>

        {/* Profile Details & Switch to Customer */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: '0.25rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <img
              src={user?.avatar || "https://lh3.googleusercontent.com/aida/AEtjO1XRwNEh1sIoYoap7omZBOmDfpIcCfCyz0UIisvmJmW7V2kngPo7lGUxUe2kjXBDL-92wbXTjdsvwnGhAlIOk5p5WYIcI4B37OzvyHr0iW-pFAL50WN61iJTGgVIi2l2840gkhYTMNyhgpQwg5_iNh2UrLvE_-gk1ZElQ5nnQynNfdWuhk9SELGVtqBFRiAmsn6UNl21T1XEQZT0s_Fs92VuBU9DSGm7TvTZMkNmoYCpi8oX3QptAWzEb2uK"}
              alt="Artisan Profile"
              style={{ width: '32px', height: '32px', borderRadius: '50%', objectFit: 'cover' }}
            />
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <span style={{ fontSize: '0.8rem', fontWeight: '600', color: 'var(--on-surface)' }}>
                {user?.name || "Savita Patil"}
              </span>
              <span style={{ fontSize: '0.7rem', color: 'var(--secondary)' }}>
                {user?.cluster?.split(' ')[0] || "Dahanu SHG"}
              </span>
            </div>
          </div>

          <Link
            to="/marketplace"
            style={{
              padding: '6px',
              borderRadius: 'var(--radius-md)',
              color: 'var(--on-surface-variant)',
              display: 'flex',
              alignItems: 'center'
            }}
            title="Switch to Marketplace View"
          >
            <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>storefront</span>
          </Link>
        </div>
      </div>
    </aside>
  );
};
