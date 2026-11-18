import React from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';

export const AboutPage = () => {
  const { lang, t } = useLanguage();

  return (
    <div className="content-top-spacer" style={{ width: '100%', paddingBottom: '4rem' }}>
      {/* Hero Banner */}
      <section
        style={{
          backgroundColor: 'var(--surface-container-low)',
          padding: '4rem 0 3rem',
          borderBottom: '1px solid var(--border-subtle)'
        }}
      >
        <div className="container">
          <div style={{ maxWidth: '800px', margin: '0 auto', textAlign: 'center' }}>
            <div className="badge-pill badge-primary" style={{ marginBottom: '1rem' }}>
              <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>handshake</span>
              <span>{t('aboutPage.title', 'About GRAMUDYAM')}</span>
            </div>
            <h1 className="display-lg" style={{ color: 'var(--primary)', marginBottom: '1.25rem' }}>
              {t('landing.heroTitle', 'Technology with a Human Touch')}
            </h1>
            <p className="body-lg" style={{ color: 'var(--on-surface-variant)', lineHeight: '1.7' }}>
              {t('aboutPage.subtitle', 'GRAMUDYAM is a dedicated rural enterprise platform conceived to uplift micro-entrepreneurs, self-help groups (SHGs), and indigenous tribal artisans across Maharashtra. We combine vernacular generative AI with cryptographic TrustTag verification so centuries-old craft traditions thrive in the digital age.')}
            </p>
          </div>
        </div>
      </section>

      {/* 4 Core Pillars */}
      <section style={{ padding: '4.5rem 0' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: '700', textTransform: 'uppercase', color: 'var(--secondary)', letterSpacing: '0.05em' }}>
              {t('aboutPage.sovereignPillars', 'The Four Foundations')}
            </span>
            <h2 className="headline-lg" style={{ color: 'var(--primary)', marginTop: '0.35rem' }}>
              {t('landing.pillarsTitle', 'How We Create Sustainable Village Wealth')}
            </h2>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '2rem' }}>
            {/* Pillar 1 */}
            <div className="card-base" style={{ padding: '1.75rem' }}>
              <div style={{ width: '48px', height: '48px', borderRadius: 'var(--radius-md)', backgroundColor: 'var(--primary-fixed)', color: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.25rem' }}>
                <span className="material-symbols-outlined" style={{ fontSize: '24px' }}>mic</span>
              </div>
              <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.2rem', color: 'var(--primary)', marginBottom: '0.5rem' }}>
                {t('landing.pillar1Title', 'Voice-First Digital Access')}
              </h3>
              <p style={{ fontSize: '0.875rem', color: 'var(--on-surface-variant)', lineHeight: '1.6' }}>
                {t('landing.pillar1Desc', 'Literacy barriers disappear when artisans can speak naturally in Marathi or Hindi. Our GraminNLP engine translates dialect speech into fully formatted catalog listings without any computer training needed.')}
              </p>
            </div>

            {/* Pillar 2 */}
            <div className="card-base" style={{ padding: '1.75rem' }}>
              <div style={{ width: '48px', height: '48px', borderRadius: 'var(--radius-md)', backgroundColor: 'var(--secondary-fixed)', color: 'var(--secondary)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.25rem' }}>
                <span className="material-symbols-outlined" style={{ fontSize: '24px' }}>account_balance</span>
              </div>
              <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.2rem', color: 'var(--primary)', marginBottom: '0.5rem' }}>
                {t('landing.pillar2Title', 'Zero Middlemen Margins')}
              </h3>
              <p style={{ fontSize: '0.875rem', color: 'var(--on-surface-variant)', lineHeight: '1.6' }}>
                {t('landing.pillar2Desc', "Traditional broker cartels keep up to 80% of handicraft profits. On Gramudyam, over 86% of consumer spend is routed instantly to the maker's bank account or SHG Bachat Gat ledger via Aadhaar-linked UPI.")}
              </p>
            </div>

            {/* Pillar 3 */}
            <div className="card-base" style={{ padding: '1.75rem' }}>
              <div style={{ width: '48px', height: '48px', borderRadius: 'var(--radius-md)', backgroundColor: 'var(--tertiary-fixed)', color: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.25rem' }}>
                <span className="material-symbols-outlined" style={{ fontSize: '24px' }}>qr_code_2</span>
              </div>
              <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.2rem', color: 'var(--primary)', marginBottom: '0.5rem' }}>
                {t('landing.pillar3Title', 'QR TrustTag Provenance')}
              </h3>
              <p style={{ fontSize: '0.875rem', color: 'var(--on-surface-variant)', lineHeight: '1.6' }}>
                {t('landing.pillar3Desc', 'Counterfeit factory prints harm rural weavers. Our cryptographic QR labels provide permanent proof of village origin, artisan identity, and genuine GI certification for every item shipped.')}
              </p>
            </div>

            {/* Pillar 4 */}
            <div className="card-base" style={{ padding: '1.75rem' }}>
              <div style={{ width: '48px', height: '48px', borderRadius: 'var(--radius-md)', backgroundColor: 'var(--warning-container)', color: 'var(--warning)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.25rem' }}>
                <span className="material-symbols-outlined" style={{ fontSize: '24px' }}>eco</span>
              </div>
              <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.2rem', color: 'var(--primary)', marginBottom: '0.5rem' }}>
                {t('landing.pillar4Title', 'Ecological Craft Stewardship')}
              </h3>
              <p style={{ fontSize: '0.875rem', color: 'var(--on-surface-variant)', lineHeight: '1.6' }}>
                {t('landing.pillar4Desc', 'From unglazed river clay to hand-foraged wild mountain honey and natural vegetable leather tanning, we champion slow, restorative practices that honor Western Ghats ecosystems.')}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Impact Numbers */}
      <section style={{ backgroundColor: 'var(--primary)', color: 'white', padding: '4rem 0' }}>
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '2rem', textAlign: 'center' }}>
            <div>
              <div style={{ fontFamily: 'var(--font-serif)', fontSize: '2.5rem', fontWeight: '700', color: 'var(--primary-fixed)' }}>
                12,000+
              </div>
              <div style={{ fontSize: '0.85rem', color: 'var(--surface-container-high)', marginTop: '4px' }}>
                {t('auth.ruralMakersConnected', 'Registered Rural Makers')}
              </div>
            </div>
            <div>
              <div style={{ fontFamily: 'var(--font-serif)', fontSize: '2.5rem', fontWeight: '700', color: 'var(--secondary-fixed)' }}>
                48
              </div>
              <div style={{ fontSize: '0.85rem', color: 'var(--surface-container-high)', marginTop: '4px' }}>
                {t('landing.clustersTitle', 'Women SHG Clusters')}
              </div>
            </div>
            <div>
              <div style={{ fontFamily: 'var(--font-serif)', fontSize: '2.5rem', fontWeight: '700', color: 'var(--primary-fixed)' }}>
                ₹4.8 Cr
              </div>
              <div style={{ fontSize: '0.85rem', color: 'var(--surface-container-high)', marginTop: '4px' }}>
                {t('landing.metricEarningsLabel', 'Direct Artisan Earnings')}
              </div>
            </div>
            <div>
              <div style={{ fontFamily: 'var(--font-serif)', fontSize: '2.5rem', fontWeight: '700', color: 'var(--secondary-fixed)' }}>
                100%
              </div>
              <div style={{ fontSize: '0.85rem', color: 'var(--surface-container-high)', marginTop: '4px' }}>
                {t('landing.metricProvenanceLabel', 'Authentic GI & Provenance')}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Join Call to Action */}
      <section style={{ padding: '4rem 0' }}>
        <div className="container">
          <div
            className="card-cream"
            style={{
              padding: '3rem 2rem',
              textAlign: 'center',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '1.25rem'
            }}
          >
            <h2 className="headline-lg" style={{ color: 'var(--primary)' }}>
              {t('landing.ctaTitle', 'Are You a Rural Maker or Self-Help Group?')}
            </h2>
            <p style={{ maxWidth: '600px', color: 'var(--on-surface-variant)', fontSize: '1rem' }}>
              {t('landing.ctaSubtitle', 'Join the Gramudyam network today. Setup your digital storefront in under 5 minutes using our voice assistant.')}
            </p>
            <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', justifyContent: 'center' }}>
              <Link to="/entrepreneur/onboarding" className="btn-secondary btn-lg">
                <span>{t('landing.registerBtn', 'Start Free Onboarding')}</span>
                <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>arrow_forward</span>
              </Link>
              <Link to="/marketplace" className="btn-outline btn-lg">
                <span>{t('marketplace.title', 'Explore Current Catalog')}</span>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
