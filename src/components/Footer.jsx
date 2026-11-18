import React from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';

export const Footer = () => {
  const { lang, t } = useLanguage();

  return (
    <footer style={{ backgroundColor: 'var(--tertiary)', color: 'var(--surface-container-high)', paddingTop: '4rem', paddingBottom: '2.5rem', marginTop: 'auto' }}>
      <div className="container">
        {/* Top Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '2.5rem', marginBottom: '3rem' }}>
          {/* Column 1: Brand & Cultural Mission */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <div style={{ width: '42px', height: '42px', borderRadius: '50%', backgroundColor: 'var(--surface)', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
                <img src="/logo.png" alt="Emblem" style={{ width: '100%', height: '100%', objectFit: 'contain' }} onError={(e) => { e.target.onerror = null; e.target.src = "/logo.svg"; }} />
              </div>
              <div>
                <span style={{ fontFamily: 'var(--font-serif)', fontSize: '1.25rem', fontWeight: '700', color: 'var(--surface)', display: 'block', lineHeight: 1 }}>
                  GRAMUDYAM
                </span>
                <span style={{ fontSize: '0.7rem', color: 'var(--primary-fixed)', letterSpacing: '0.05em', textTransform: 'uppercase' }}>
                  {t('navigation.brandSubtitle', 'Rural Enterprise Network')}
                </span>
              </div>
            </div>
            <p style={{ fontSize: '0.85rem', lineHeight: '1.6', color: 'var(--outline-variant)' }}>
              {t('footer.brandDescription', 'Synthesizing timeless Maharashtra craftsmanship with generative AI voice listing, fair-trade transparency, and immutable QR TrustTag verification for rural micro-entrepreneurs.')}
            </p>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', backgroundColor: 'rgba(255,255,255,0.08)', padding: '0.4rem 0.8rem', borderRadius: 'var(--radius-full)', width: 'fit-content' }}>
              <span className="material-symbols-outlined" style={{ color: 'var(--secondary-fixed)', fontSize: '16px' }}>verified</span>
              <span style={{ fontSize: '0.75rem', color: 'var(--primary-fixed)' }}>{t('common.govtAffiliated', 'Affiliated with TRIFED & Rural SHGs')}</span>
            </div>
          </div>

          {/* Column 2: Living Heritage Clusters */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            <h4 style={{ fontFamily: 'var(--font-sans)', fontSize: '0.9rem', color: 'var(--secondary-fixed)', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: '700' }}>
              {t('landing.clustersTitle', 'Artisanal Clusters')}
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.85rem' }}>
              <Link to="/marketplace" style={{ color: 'var(--surface-container-high)', opacity: 0.85 }}>Palghar (Warli Tribal Art)</Link>
              <Link to="/marketplace" style={{ color: 'var(--surface-container-high)', opacity: 0.85 }}>Yeola, Nashik (Paithani Silk)</Link>
              <Link to="/marketplace" style={{ color: 'var(--surface-container-high)', opacity: 0.85 }}>Kolhapur (Artisanal Leather Guild)</Link>
              <Link to="/marketplace" style={{ color: 'var(--surface-container-high)', opacity: 0.85 }}>Paithan (Heritage Handlooms)</Link>
              <Link to="/marketplace" style={{ color: 'var(--surface-container-high)', opacity: 0.85 }}>Satpura (Van Dhan Forest Honey)</Link>
              <Link to="/marketplace" style={{ color: 'var(--surface-container-high)', opacity: 0.85 }}>Chandgad (Konkan Bamboo Society)</Link>
            </div>
          </div>

          {/* Column 3: Platform Navigation */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            <h4 style={{ fontFamily: 'var(--font-sans)', fontSize: '0.9rem', color: 'var(--secondary-fixed)', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: '700' }}>
              {t('footer.quickLinks', 'Platform & Trust')}
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.85rem' }}>
              <Link to="/marketplace" style={{ color: 'var(--surface-container-high)', opacity: 0.85 }}>{t('navigation.marketplace', 'Discover Marketplace')}</Link>
              <Link to="/about" style={{ color: 'var(--surface-container-high)', opacity: 0.85 }}>{t('navigation.about', 'Our Rural Mission')}</Link>
              <Link to="/verify/GM-TRUST-0001" style={{ color: 'var(--surface-container-high)', opacity: 0.85 }}>{t('trustTag', 'Verify QR TrustTag')}</Link>
              <Link to="/orders" style={{ color: 'var(--surface-container-high)', opacity: 0.85 }}>{t('customer.trackOrder', 'Track Your Order')}</Link>
              <Link to="/entrepreneur/dashboard" style={{ color: 'var(--surface-container-high)', opacity: 0.85 }}>{t('navigation.dashboard', 'Artisan Portal')}</Link>
              <Link to="/entrepreneur/voice-create" style={{ color: 'var(--surface-container-high)', opacity: 0.85 }}>{t('entrepreneur.voiceStudioTitle', 'Voice Studio')}</Link>
            </div>
          </div>

          {/* Column 4: Vernacular Support & Contact */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            <h4 style={{ fontFamily: 'var(--font-sans)', fontSize: '0.9rem', color: 'var(--secondary-fixed)', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: '700' }}>
              {t('common.contactUs', 'Support & Helpline')}
            </h4>
            <div style={{ backgroundColor: 'rgba(255, 255, 255, 0.06)', padding: '1rem', borderRadius: 'var(--radius-lg)', border: '1px solid rgba(255,255,255,0.1)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
                <span className="material-symbols-outlined" style={{ color: 'var(--secondary-fixed)' }}>support_agent</span>
                <span style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--secondary-fixed)', fontWeight: '700' }}>{t('common.helpline', 'Toll Free Helpline')}</span>
              </div>
              <div style={{ fontFamily: 'var(--font-serif)', fontSize: '1.25rem', fontWeight: '700', color: 'var(--surface)' }}>
                1800-200-8899
              </div>
              <div style={{ fontSize: '0.75rem', color: 'var(--primary-fixed)', marginTop: '0.25rem' }}>
                सकाळी ९ ते संध्याकाळी ६ (मराठी/हिंदी/English)
              </div>
            </div>
            <p style={{ fontSize: '0.8rem', color: 'var(--outline-variant)' }}>
              Gramudyam Foundation, Vidyanagari, Kalina, Mumbai & Rural Hub, Dahanu, Maharashtra.
            </p>
          </div>
        </div>

        {/* Bottom Bar: Direct Remittance & Copyright */}
        <div style={{ borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '1.5rem', display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '1rem', fontSize: '0.75rem', color: 'var(--outline-variant)' }}>
          <div>
            {t('footer.copyright', '© 2026 GRAMUDYAM. All rights reserved.')}
          </div>
          <div style={{ display: 'flex', gap: '1rem' }}>
            <span>{t('landing.metricLeakageLabel', 'Zero Middlemen')}</span>
            <span>•</span>
            <span>{t('landing.metricProvenanceLabel', 'Immutable Provenance')}</span>
            <span>•</span>
            <span>Made in Maharashtra</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
