import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';

const GetStartedPage = () => {
  const navigate = useNavigate();
  const { t } = useLanguage();

  const roles = [
    {
      id: 'artisan',
      title: t('getStarted.artisanTitle', 'Rural Artisan'),
      badge: t('getStarted.artisanBadge', 'ग्रामीण उद्योजक / Producer'),
      icon: 'handshake',
      iconColor: 'var(--secondary)',
      iconBg: 'rgba(150, 72, 38, 0.1)',
      tagline: t('getStarted.artisanTagline', 'Makers, Weavers & SHG Collectives'),
      description: t('getStarted.artisanDesc', 'Sell handcrafted goods, manage digital stalls, use AI vernacular voice tools, and track direct village remittances.'),
      features: [
        t('getStarted.artisanFeat1', 'Vernacular Marathi AI Voice Studio'),
        t('getStarted.artisanFeat2', 'Automated QR TrustTag Generation'),
        t('getStarted.artisanFeat3', 'Zero-Middlemen Fair Trade Margin Analytics')
      ],
      ctaText: t('getStarted.continueArtisan', 'Continue as Rural Artisan'),
      route: '/login?role=artisan',
      accentColor: 'var(--secondary)',
      popular: true,
      popularBadge: t('getStarted.grassrootsProducers', 'Grassroots Producers')
    },
    {
      id: 'customer',
      title: t('getStarted.patronTitle', 'Conscious Patron'),
      badge: t('getStarted.patronBadge', 'ग्राहक / Craft Patron'),
      icon: 'shopping_bag',
      iconColor: '#2D6A4F',
      iconBg: 'rgba(45, 106, 79, 0.1)',
      tagline: t('getStarted.patronTagline', 'Mindful Urban Homes & Art Enthusiasts'),
      description: t('getStarted.patronDesc', 'Discover 100% authentic GI-certified handcrafted heritage, directly support rural artisan families, and verify traceability.'),
      features: [
        t('getStarted.patronFeat1', '100% Verified Authentic Maharashtra Craft'),
        t('getStarted.patronFeat2', 'Interactive Provenance Verification & Traceability'),
        t('getStarted.patronFeat3', 'Direct Fair-Trade Remittance Impact')
      ],
      ctaText: t('getStarted.continuePatron', 'Continue as Patron'),
      route: '/login?role=customer',
      accentColor: 'var(--primary)',
      popular: false
    }
  ];

  return (
    <div
      style={{
        minHeight: 'calc(100vh - 72px)',
        backgroundColor: '#f7f4ee',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        padding: '3rem 1.5rem',
        position: 'relative'
      }}
    >
      {/* Subtle Background Ornamentation */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: '50%',
          transform: 'translateX(-50%)',
          width: '100%',
          maxWidth: '1200px',
          height: '240px',
          background: 'radial-gradient(ellipse at top, rgba(150, 72, 38, 0.06), transparent 70%)',
          pointerEvents: 'none'
        }}
      />

      <div style={{ maxWidth: '980px', margin: '0 auto', width: '100%', position: 'relative', zIndex: 1 }}>
        {/* Navigation Breadcrumb / Back to Home */}
        <div style={{ marginBottom: '2rem' }}>
          <Link
            to="/"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.4rem',
              color: 'var(--on-surface-variant)',
              fontSize: '0.875rem',
              fontWeight: '500',
              textDecoration: 'none',
              transition: 'color 0.2s ease'
            }}
            onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--primary)')}
            onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--on-surface-variant)')}
          >
            <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>arrow_back</span>
            <span>{t('getStarted.backToHome', 'Back to Home')}</span>
          </Link>
        </div>

        {/* Page Header */}
        <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              backgroundColor: '#eee8da',
              border: '1px solid #e5dac6',
              borderRadius: 'var(--radius-full)',
              padding: '0.35rem 1rem',
              fontSize: '0.8rem',
              fontWeight: '700',
              color: 'var(--secondary)',
              textTransform: 'uppercase',
              letterSpacing: '0.08em',
              marginBottom: '1rem'
            }}
          >
            <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>hub</span>
            <span>{t('getStarted.gatewayBadge', 'GRAMUDYAM Gateway')}</span>
          </div>

          <h1
            style={{
              fontFamily: 'var(--font-serif)',
              fontSize: 'clamp(2rem, 3.5vw, 2.75rem)',
              color: 'var(--primary)',
              fontWeight: '700',
              letterSpacing: '-0.02em',
              marginBottom: '0.75rem'
            }}
          >
            {t('getStarted.title', 'Welcome to GRAMUDYAM')}
          </h1>
          <p
            style={{
              fontSize: 'clamp(1rem, 1.3vw, 1.15rem)',
              color: 'var(--on-surface-variant)',
              maxWidth: '600px',
              margin: '0 auto',
              lineHeight: 1.6
            }}
          >
            {t('getStarted.subtitle', 'Choose how you want to continue. Access your rural craft collective or discover artisanal treasures.')}
          </p>
        </div>

        {/* 2 Role Selection Cards */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: '2rem',
            alignItems: 'stretch',
            marginBottom: '3rem'
          }}
        >
          {roles.map((role) => (
            <div
              key={role.id}
              onClick={() => navigate(role.route)}
              style={{
                backgroundColor: '#ffffff',
                borderRadius: '24px',
                border: role.popular
                  ? '2px solid var(--secondary)'
                  : '1px solid #e7e0d3',
                boxShadow: role.popular ? '0 12px 30px rgba(150, 72, 38, 0.12)' : '0 4px 20px rgba(0,0,0,0.05)',
                padding: '2.5rem 2rem',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                cursor: 'pointer',
                position: 'relative',
                transition: 'all 0.28s cubic-bezier(0.16, 1, 0.3, 1)',
                overflow: 'hidden'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-6px)';
                e.currentTarget.style.boxShadow = '0 20px 40px rgba(15, 56, 42, 0.12)';
                e.currentTarget.style.borderColor = role.accentColor;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = role.popular ? '0 12px 30px rgba(150, 72, 38, 0.12)' : '0 4px 20px rgba(0,0,0,0.05)';
                e.currentTarget.style.borderColor = role.popular ? 'var(--secondary)' : '#e7e0d3';
              }}
            >
              {/* Popular / Recommended Badge */}
              {role.popular && (
                <div
                  style={{
                    position: 'absolute',
                    top: '1.25rem',
                    right: '1.25rem',
                    backgroundColor: 'var(--secondary)',
                    color: 'white',
                    fontSize: '0.7rem',
                    fontWeight: '700',
                    padding: '0.25rem 0.75rem',
                    borderRadius: 'var(--radius-full)',
                    letterSpacing: '0.04em',
                    textTransform: 'uppercase'
                  }}
                >
                  {role.popularBadge}
                </div>
              )}

              <div>
                {/* Icon & Badge Header */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.25rem' }}>
                  <div
                    style={{
                      width: '54px',
                      height: '54px',
                      borderRadius: '14px',
                      backgroundColor: role.iconBg,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0
                    }}
                  >
                    <span
                      className="material-symbols-outlined"
                      style={{ fontSize: '30px', color: role.iconColor }}
                    >
                      {role.icon}
                    </span>
                  </div>
                  <div>
                    <span
                      style={{
                        display: 'block',
                        fontSize: '0.72rem',
                        fontWeight: '700',
                        color: role.iconColor,
                        letterSpacing: '0.05em',
                        textTransform: 'uppercase'
                      }}
                    >
                      {role.badge}
                    </span>
                    <h2
                      style={{
                        fontFamily: 'var(--font-serif)',
                        fontSize: '1.75rem',
                        color: 'var(--primary)',
                        fontWeight: '700',
                        margin: 0,
                        lineHeight: 1.2
                      }}
                    >
                      {role.title}
                    </h2>
                  </div>
                </div>

                {/* Tagline & Description */}
                <p
                  style={{
                    fontSize: '0.925rem',
                    color: 'var(--on-surface-variant)',
                    lineHeight: 1.55,
                    marginBottom: '1.5rem',
                    minHeight: '60px'
                  }}
                >
                  {role.description}
                </p>

                {/* Micro Feature Bullet Points */}
                <div
                  style={{
                    borderTop: '1px solid #ede7db',
                    paddingTop: '1.25rem',
                    marginBottom: '1.75rem',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '0.65rem'
                  }}
                >
                  {role.features.map((feat, idx) => (
                    <div
                      key={idx}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                        fontSize: '0.825rem',
                        color: 'var(--on-surface)'
                      }}
                    >
                      <span
                        className="material-symbols-outlined"
                        style={{ fontSize: '18px', color: role.iconColor }}
                      >
                        check_circle
                      </span>
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Action Button */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  navigate(role.route);
                }}
                className={role.popular ? 'btn-secondary' : 'btn-primary'}
                style={{
                  width: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.5rem',
                  padding: '0.85rem 1.25rem',
                  borderRadius: '12px',
                  fontWeight: '700',
                  fontSize: '0.95rem',
                  cursor: 'pointer'
                }}
              >
                <span>{role.ctaText}</span>
                <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>
                  arrow_forward
                </span>
              </button>
            </div>
          ))}
        </div>

        {/* Footer Alternative Link */}
        <div
          style={{
            textAlign: 'center',
            padding: '1.5rem',
            backgroundColor: '#ffffff',
            borderRadius: '16px',
            border: '1px solid #e7e0d3'
          }}
        >
          <span style={{ fontSize: '0.9rem', color: 'var(--on-surface-variant)' }}>
            {t('getStarted.browsePrompt', 'Just looking to browse handcrafted rural treasures?')}{' '}
          </span>
          <Link
            to="/marketplace"
            style={{
              fontSize: '0.9rem',
              color: 'var(--secondary)',
              fontWeight: '700',
              textDecoration: 'none',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.25rem',
              marginLeft: '0.25rem'
            }}
          >
            <span>{t('getStarted.exploreGuest', 'Explore Marketplace as Guest')}</span>
            <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>open_in_new</span>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default GetStartedPage;
