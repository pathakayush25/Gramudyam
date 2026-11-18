import React from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { useProducts } from '../context/ProductContext';
import { ProductCard } from '../components/ProductCard';

export const LandingPage = () => {
  const { t } = useLanguage();
  const { products } = useProducts();
  const featuredProducts = products.filter((p) => p.isPublished !== false && p.is_available !== false).slice(0, 4);

  return (
    <div className="content-top-spacer" style={{ width: '100%' }}>
      {/* ================= HERO SECTION ================= */}
      <section
        style={{
          position: 'relative',
          backgroundColor: 'var(--surface-container-low)',
          paddingTop: '3rem',
          paddingBottom: '4.5rem',
          overflow: 'hidden'
        }}
      >
        {/* Ambient Organic Glows */}
        <div
          style={{
            position: 'absolute',
            top: '-50px',
            right: '-50px',
            width: '400px',
            height: '400px',
            borderRadius: '50%',
            backgroundColor: 'rgba(201, 111, 74, 0.08)',
            filter: 'blur(70px)',
            pointerEvents: 'none'
          }}
        />
        <div
          style={{
            position: 'absolute',
            bottom: '0',
            left: '50px',
            width: '350px',
            height: '350px',
            borderRadius: '50%',
            backgroundColor: 'rgba(35, 79, 61, 0.07)',
            filter: 'blur(70px)',
            pointerEvents: 'none'
          }}
        />

        <div className="container">
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
              gap: '3rem',
              alignItems: 'center'
            }}
          >
            {/* Left Text Column */}
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
              {/* Eyebrow Pill Badge */}
              <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '0.75rem', marginBottom: '1.25rem' }}>
                <div
                  className="badge-pill"
                  style={{
                    backgroundColor: 'var(--tertiary-fixed)',
                    color: 'var(--primary)',
                    padding: '0.35rem 0.85rem'
                  }}
                >
                  <span className="material-symbols-outlined" style={{ fontSize: '16px', color: 'var(--primary)', fontVariationSettings: "'FILL' 1" }}>
                    spa
                  </span>
                  <span style={{ fontSize: '0.75rem', fontWeight: '700', letterSpacing: '0.04em' }}>
                    {t('landing.eyebrow', 'महाराष्ट्र ग्रामीण उद्योजकता मंच • Empowering Village Economies')}
                  </span>
                </div>
              </div>

              {/* Headline */}
              <h1 className="display-lg" style={{ color: 'var(--primary)', marginBottom: '1.25rem' }}>
                {t('landing.heroTitle', 'Empowering Rural Entrepreneurs.')}{' '}
                <span style={{ display: 'block', fontStyle: 'italic', fontWeight: '400', color: 'var(--secondary)' }}>
                  {t('landing.heroTitleEmphasis', 'Building Digital Futures.')}
                </span>
              </h1>

              {/* Subtitle */}
              <p className="body-lg" style={{ color: 'var(--on-surface-variant)', maxWidth: '580px', marginBottom: '2rem' }}>
                {t('landing.heroSubtitle', 'GRAMUDYAM equips grassroots artisans, organic farmers, and micro-producers across Maharashtra with generative AI voice tools, digital storefronts, and verified QR TrustTag packaging to bring authentic craft directly to conscious patrons worldwide.')}
              </p>

              {/* Dual CTAs */}
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', width: '100%', marginBottom: '2.5rem' }}>
                <Link to="/marketplace" className="btn-secondary btn-lg" style={{ textDecoration: 'none' }}>
                  <span>{t('landing.exploreBtn', 'Explore Marketplace')}</span>
                  <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>arrow_forward</span>
                </Link>

                <Link to="/get-started" className="btn-cream btn-lg" style={{ textDecoration: 'none' }}>
                  <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>rocket_launch</span>
                  <span>{t('landing.getStartedBtn', 'Get Started')}</span>
                </Link>
              </div>

              {/* Live Metrics Ticker Banner */}
              <div
                style={{
                  width: '100%',
                  backgroundColor: 'rgba(243, 237, 223, 0.9)',
                  backdropFilter: 'blur(8px)',
                  borderRadius: 'var(--radius-lg)',
                  padding: '0.85rem 1.25rem',
                  border: '1px solid var(--border-subtle)',
                  boxShadow: 'var(--shadow-sm)'
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: '1rem'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <span className="material-symbols-outlined" style={{ color: 'var(--secondary)', fontSize: '20px' }}>
                      currency_rupee
                    </span>
                    <div>
                      <span style={{ fontSize: '0.95rem', fontWeight: '700', color: 'var(--primary)' }}>
                        {t('landing.metricEarnings', '₹4.8 Cr+')}
                      </span>
                      <span style={{ fontSize: '0.75rem', color: 'var(--on-surface-variant)', display: 'block' }}>
                        {t('landing.metricEarningsLabel', 'Direct Artisan Earnings')}
                      </span>
                    </div>
                  </div>

                  <span style={{ color: 'var(--outline-variant)' }}>•</span>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <span className="material-symbols-outlined" style={{ color: 'var(--primary)', fontSize: '20px' }}>
                      verified_user
                    </span>
                    <div>
                      <span style={{ fontSize: '0.95rem', fontWeight: '700', color: 'var(--primary)' }}>
                        {t('landing.metricLeakage', '0%')}
                      </span>
                      <span style={{ fontSize: '0.75rem', color: 'var(--on-surface-variant)', display: 'block' }}>
                        {t('landing.metricLeakageLabel', 'Middleman Leakage')}
                      </span>
                    </div>
                  </div>

                  <span style={{ color: 'var(--outline-variant)' }}>•</span>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <span className="material-symbols-outlined" style={{ color: 'var(--secondary)', fontSize: '20px' }}>
                      workspace_premium
                    </span>
                    <div>
                      <span style={{ fontSize: '0.95rem', fontWeight: '700', color: 'var(--primary)' }}>
                        {t('landing.metricProvenance', '100%')}
                      </span>
                      <span style={{ fontSize: '0.75rem', color: 'var(--on-surface-variant)', display: 'block' }}>
                        {t('landing.metricProvenanceLabel', 'Verified Provenance')}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Visual Frame with Floating Badges */}
            <div style={{ position: 'relative' }}>
              <div
                style={{
                  position: 'relative',
                  borderRadius: 'var(--radius-xl)',
                  overflow: 'hidden',
                  boxShadow: 'var(--shadow-xl)',
                  backgroundColor: 'var(--surface-container-high)',
                  aspectRatio: '4/3'
                }}
              >
                <img
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuDuBg0Lw55mblc95K-b7YQsvxfjjx8pF9iOOufNB75rLpHEN8Gpl9cMJp_qutqPhCU4dXB0kl92R-xWRjX6-5LbccV5V_yX96InG5RyjO2bNN-M_bWvHnWIDY__iV2AC2bPBOsVdKoShhH2t7UuOq-jWh9HFFSQ1YdmlZCvEDMRatVjKVdGj7UWZJTHA6yY9ORofjr2aHCV7l7qfF16Zub3QqWeKAlb5qPEC29Aj585dhtOfOizA-aJgw"
                  alt="Rural artisan working with traditional pottery and digital tablet"
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />

                {/* Scrim */}
                <div
                  style={{
                    position: 'absolute',
                    inset: 0,
                    background: 'linear-gradient(to top, rgba(7, 56, 39, 0.6) 0%, transparent 60%)'
                  }}
                />

                {/* Floating Pill Top-Left */}
                <div
                  style={{
                    position: 'absolute',
                    top: '1rem',
                    left: '1rem',
                    backgroundColor: 'rgba(255, 249, 235, 0.94)',
                    backdropFilter: 'blur(8px)',
                    padding: '0.4rem 0.85rem',
                    borderRadius: 'var(--radius-full)',
                    boxShadow: 'var(--shadow-md)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem'
                  }}
                >
                  <span className="pulse-dot" />
                  <span className="material-symbols-outlined" style={{ color: 'var(--primary)', fontSize: '16px' }}>location_on</span>
                  <span style={{ fontSize: '0.75rem', fontWeight: '600', color: 'var(--primary)' }}>
                    {t('landing.producerBadge', 'Verified Producer • Paithani Handlooms & Terracotta, Satara')}
                  </span>
                </div>

                {/* Floating Card Bottom-Right */}
                <div
                  style={{
                    position: 'absolute',
                    bottom: '1rem',
                    right: '1rem',
                    backgroundColor: 'rgba(255, 249, 235, 0.95)',
                    backdropFilter: 'blur(8px)',
                    borderRadius: 'var(--radius-lg)',
                    padding: '0.85rem 1rem',
                    boxShadow: 'var(--shadow-lg)',
                    maxWidth: '260px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '0.35rem'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                      <div
                        style={{
                          width: '26px',
                          height: '26px',
                          borderRadius: '50%',
                          backgroundColor: 'var(--secondary-fixed)',
                          color: 'var(--secondary)',
                          fontSize: '11px',
                          fontWeight: '700',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center'
                        }}
                      >
                        LS
                      </div>
                      <span style={{ fontSize: '0.75rem', fontWeight: '700', color: 'var(--on-surface)' }}>
                        Laxmi's SHG Cluster
                      </span>
                    </div>
                    <span style={{ fontSize: '0.65rem', color: 'var(--secondary)', backgroundColor: 'var(--secondary-fixed)', padding: '2px 6px', borderRadius: '4px', fontWeight: '700' }}>
                      {t('common.live', 'Live')}
                    </span>
                  </div>

                  <div style={{ fontFamily: 'var(--font-sans)', fontSize: '1rem', fontWeight: '700', color: 'var(--primary)' }}>
                    {t('landing.liveOrdersToday', '+142 orders today')}
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.7rem', color: 'var(--on-surface-variant)' }}>
                    <span>{t('landing.liveDispatched', 'Dispatched to Pune & Mumbai')}</span>
                    <span className="material-symbols-outlined" style={{ color: 'var(--secondary)', fontSize: '16px' }}>trending_up</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ================= FEATURED CRAFTS SECTION ================= */}
      <section style={{ backgroundColor: 'var(--surface)', padding: '4.5rem 0' }}>
        <div className="container">
          <div
            style={{
              display: 'flex',
              flexDirection: 'row',
              flexWrap: 'wrap',
              alignItems: 'flex-end',
              justifyContent: 'space-between',
              marginBottom: '2.5rem',
              gap: '1rem'
            }}
          >
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--secondary)', fontSize: '0.75rem', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.35rem' }}>
                <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>verified</span>
                <span>{t('directFromArtisan', 'Direct From Producer Clusters')}</span>
              </div>
              <h2 className="headline-lg" style={{ color: 'var(--primary)' }}>
                {t('landing.featuredTitle', 'Featured Handcrafted Creations')}
              </h2>
              <p className="body-md" style={{ color: 'var(--on-surface-variant)', marginTop: '0.35rem' }}>
                {t('landing.featuredSubtitle', 'Every single piece is verified for authentic provenance, fair wages, and non-toxic native materials.')}
              </p>
            </div>

            <Link
              to="/marketplace"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.5rem',
                color: 'var(--primary)',
                fontWeight: '600',
                fontSize: '0.875rem'
              }}
            >
              <span>{t('landing.viewAllCrafts', 'View All 1,420+ Crafts')}</span>
              <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>arrow_forward</span>
            </Link>
          </div>

          {/* 4 Cards Grid */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
              gap: '1.5rem'
            }}
          >
            {featuredProducts.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </div>
      </section>

      {/* ================= VOICE AI HERO BANNER ================= */}
      <section style={{ backgroundColor: 'var(--surface-container)', padding: '4rem 0', borderTop: '1px solid var(--border-subtle)', borderBottom: '1px solid var(--border-subtle)' }}>
        <div className="container">
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
              gap: '2.5rem',
              alignItems: 'center'
            }}
          >
            <div>
              <div className="badge-pill badge-secondary" style={{ marginBottom: '1rem' }}>
                <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>mic</span>
                <span>GraminNLP Voice Studio v3.2</span>
              </div>
              <h2 className="headline-lg" style={{ color: 'var(--primary)', marginBottom: '1rem' }}>
                {t('landing.pillar1Title', 'Voice-First Vernacular AI')}
              </h2>
              <p className="body-md" style={{ color: 'var(--on-surface-variant)', lineHeight: '1.7', marginBottom: '1.5rem' }}>
                {t('landing.pillar1Desc', 'Rural artisans simply speak in Marathi, Hindi, or local Konkan dialects. Our voice AI extracts product titles, regional provenance, fair pricing, and ancestral stories to publish an instant e-commerce listing ready for national buyers.')}
              </p>
              <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                <Link to="/entrepreneur/voice-create" className="btn-primary">
                  <span className="material-symbols-outlined">mic</span>
                  <span>{t('entrepreneur.voiceStudioBtn', 'Try Voice Product Studio')}</span>
                </Link>
                <Link to="/entrepreneur/dashboard" className="btn-outline">
                  <span>{t('navigation.dashboard', 'Enter Artisan Portal')}</span>
                </Link>
              </div>
            </div>

            <div
              className="card-base"
              style={{
                padding: '1.75rem',
                backgroundColor: 'var(--surface-container-lowest)',
                display: 'flex',
                flexDirection: 'column',
                gap: '1rem'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '0.75rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <span className="pulse-dot" />
                  <span style={{ fontSize: '0.75rem', fontWeight: '700', textTransform: 'uppercase', color: 'var(--primary)' }}>
                    {t('landing.voiceStudioPrompt', 'Live Dialect Voice Recognition')}
                  </span>
                </div>
                <span style={{ fontSize: '0.75rem', color: 'var(--secondary)', fontWeight: '600' }}>
                  Marathi (Dahanu / Konkan)
                </span>
              </div>

              {/* Sample Voice Recording Simulation */}
              <div style={{ backgroundColor: 'var(--surface-container-low)', padding: '1rem', borderRadius: 'var(--radius-md)', borderLeft: '4px solid var(--secondary)' }}>
                <div style={{ fontSize: '0.7rem', color: 'var(--outline)', marginBottom: '4px', textTransform: 'uppercase' }}>
                  {t('entrepreneur.listeningState', 'Artisan Spoken Input:')}
                </div>
                <div style={{ fontStyle: 'italic', fontSize: '0.9rem', color: 'var(--on-surface)' }}>
                  "हे डहाणूचे हस्तनिर्मित वारली चित्र आहे, किंमत बाराशे रुपये."
                </div>
              </div>

              {/* Real-time Extracted Data Bento */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '0.75rem' }}>
                <div style={{ backgroundColor: 'var(--surface-container-high)', padding: '0.65rem', borderRadius: 'var(--radius-sm)' }}>
                  <div style={{ fontSize: '0.65rem', color: 'var(--outline)', textTransform: 'uppercase' }}>{t('entrepreneur.extractedTitle', 'Extracted Title')}</div>
                  <div style={{ fontSize: '0.8rem', fontWeight: '700', color: 'var(--primary)' }}>Warli Tribal Art</div>
                </div>
                <div style={{ backgroundColor: 'var(--surface-container-high)', padding: '0.65rem', borderRadius: 'var(--radius-sm)' }}>
                  <div style={{ fontSize: '0.65rem', color: 'var(--outline)', textTransform: 'uppercase' }}>{t('product.retailPrice', 'Direct Price')}</div>
                  <div style={{ fontSize: '0.8rem', fontWeight: '700', color: 'var(--primary)' }}>₹1,200</div>
                </div>
                <div style={{ backgroundColor: 'var(--surface-container-high)', padding: '0.65rem', borderRadius: 'var(--radius-sm)' }}>
                  <div style={{ fontSize: '0.65rem', color: 'var(--outline)', textTransform: 'uppercase' }}>{t('product.originDistrict', 'Cluster Origin')}</div>
                  <div style={{ fontSize: '0.8rem', fontWeight: '700', color: 'var(--primary)' }}>Dahanu, Palghar</div>
                </div>
                <div style={{ backgroundColor: 'var(--surface-container-high)', padding: '0.65rem', borderRadius: 'var(--radius-sm)' }}>
                  <div style={{ fontSize: '0.65rem', color: 'var(--outline)', textTransform: 'uppercase' }}>{t('qualityScore', 'AI Quality Score')}</div>
                  <div style={{ fontSize: '0.8rem', fontWeight: '700', color: 'var(--success)' }}>96 / 100 ✓</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ================= SOVEREIGN TRUSTTAG SECTION ================= */}
      <section style={{ backgroundColor: 'var(--surface)', padding: '4.5rem 0' }}>
        <div className="container">
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
              gap: '3rem',
              alignItems: 'center'
            }}
          >
            <div style={{ position: 'relative' }}>
              <div
                className="card-base"
                style={{
                  padding: '2rem',
                  backgroundColor: 'var(--surface-container-lowest)',
                  textAlign: 'center',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '1rem'
                }}
              >
                <div className="badge-pill badge-primary">
                  <span className="material-symbols-outlined" style={{ fontSize: '15px' }}>qr_code_2</span>
                  <span>{t('product.trustTagVerified', 'Physical + Digital Authentication')}</span>
                </div>
                <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.5rem', color: 'var(--primary)' }}>
                  {t('trustTag', 'QR TrustTag Certificate')}
                </h3>
                <p style={{ fontSize: '0.85rem', color: 'var(--on-surface-variant)', maxWidth: '360px' }}>
                  {t('landing.pillar2Desc', 'Every product shipped features an immutable TrustTag QR label linking directly to the artisan biography, village GPS coordinates, and bank deposit ledger.')}
                </p>
                <Link to="/verify/GM-TRUST-0001" className="btn-secondary" style={{ marginTop: '0.5rem' }}>
                  <span>{t('common.viewDetails', 'Verify Sample TrustTag #0001')}</span>
                  <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>arrow_forward</span>
                </Link>
              </div>
            </div>

            <div>
              <div style={{ color: 'var(--secondary)', fontSize: '0.75rem', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.5rem' }}>
                {t('landing.pillar3Title', 'Zero Middleman DBT Escrow')}
              </div>
              <h2 className="headline-lg" style={{ color: 'var(--primary)', marginBottom: '1.25rem' }}>
                {t('landing.pillarsTitle', 'Empowering 36 Districts of Maharashtra')}
              </h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                <div style={{ display: 'flex', gap: '1rem' }}>
                  <div style={{ width: '36px', height: '36px', borderRadius: '50%', backgroundColor: 'var(--primary-fixed)', color: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <span className="material-symbols-outlined">fingerprint</span>
                  </div>
                  <div>
                    <h4 style={{ fontSize: '1rem', fontWeight: '700', color: 'var(--primary)' }}>{t('product.artisanStory', 'Artisan Identification')}</h4>
                    <p style={{ fontSize: '0.85rem', color: 'var(--on-surface-variant)' }}>{t('directFromArtisan', 'Directly links to the maker self-help group and district cluster.')}</p>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '1rem' }}>
                  <div style={{ width: '36px', height: '36px', borderRadius: '50%', backgroundColor: 'var(--secondary-fixed)', color: 'var(--secondary)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <span className="material-symbols-outlined">payments</span>
                  </div>
                  <div>
                    <h4 style={{ fontSize: '1rem', fontWeight: '700', color: 'var(--primary)' }}>{t('product.retailPrice', 'Transparent Fair-Trade Margins')}</h4>
                    <p style={{ fontSize: '0.85rem', color: 'var(--on-surface-variant)' }}>{t('landing.pillar3Desc', 'Patrons can inspect the exact breakdown of the remittance delivered to the village producer.')}</p>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '1rem' }}>
                  <div style={{ width: '36px', height: '36px', borderRadius: '50%', backgroundColor: 'var(--tertiary-fixed)', color: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <span className="material-symbols-outlined">shield</span>
                  </div>
                  <div>
                    <h4 style={{ fontSize: '1rem', fontWeight: '700', color: 'var(--primary)' }}>{t('marketplace.giCertified', 'Geographical Indication (GI) Proof')}</h4>
                    <p style={{ fontSize: '0.85rem', color: 'var(--on-surface-variant)' }}>{t('product.governmentGuarantee', 'Verified protection for Yeola Paithani silk, Warli paintings, and Kolhapuri craft.')}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
