import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';

import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { LanguageSelector } from './LanguageSelector';

export const Navbar = () => {
  const { lang, t } = useLanguage();
  const { user, role, loginAs, logout } = useAuth();
  const { totalCount } = useCart();

  const location = useLocation();
  const navigate = useNavigate();

  const [mobileOpen, setMobileOpen] = useState(false);
  const [authDropdownOpen, setAuthDropdownOpen] = useState(false);

  const isActive = (path) => location.pathname === path;

  // Safely get the user's display name.
  // This prevents undefined.split() errors when nobody is logged in.
  const displayName =
    user?.full_name ||
    user?.name ||
    'Guest';

  const firstName = displayName.split(' ')[0];

  const avatarLetter =
    displayName !== 'Guest'
      ? displayName.charAt(0).toUpperCase()
      : 'G';

  return (
    <header className="header-glass">
      <div
        className="container"
        style={{
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '1rem'
        }}
      >

        {/* Brand Logo & Title */}
        <Link
          to="/"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem',
            textDecoration: 'none'
          }}
        >
          <img
            src="/logo.png"
            alt="GRAMUDYAM"
            style={{
              width: '2.6rem',
              height: '2.6rem',
              objectFit: 'contain',
              borderRadius: '50%'
            }}
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = '/logo.svg';
            }}
          />

          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <span
              style={{
                fontFamily: 'var(--font-serif)',
                fontSize: '1.25rem',
                fontWeight: '700',
                color: 'var(--primary)',
                letterSpacing: '-0.01em',
                lineHeight: 1
              }}
            >
              GRAMUDYAM
            </span>

            <span
              style={{
                fontSize: '0.65rem',
                color: 'var(--secondary)',
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
                fontWeight: '600',
                marginTop: '2px'
              }}
            >
              {t(
                'navigation.brandSubtitle',
                'Rural Enterprise Network'
              )}
            </span>
          </div>
        </Link>

        {/* Desktop Navigation Links */}
        <nav
          style={{
            display: 'none',
            gap: '0.5rem',
            alignItems: 'center'
          }}
          className="desktop-nav"
        >

          <Link
            to="/"
            style={{
              padding: '0.4rem 0.85rem',
              borderRadius: 'var(--radius-md)',
              fontSize: '0.875rem',
              fontWeight: isActive('/') ? '600' : '500',
              backgroundColor: isActive('/')
                ? 'var(--primary-container)'
                : 'transparent',
              color: isActive('/')
                ? 'var(--on-primary)'
                : 'var(--on-surface-variant)'
            }}
          >
            {t('home', 'Home')}
          </Link>

          <Link
            to="/marketplace"
            style={{
              padding: '0.4rem 0.85rem',
              borderRadius: 'var(--radius-md)',
              fontSize: '0.875rem',
              fontWeight: isActive('/marketplace')
                ? '600'
                : '500',
              backgroundColor: isActive('/marketplace')
                ? 'var(--primary-container)'
                : 'transparent',
              color: isActive('/marketplace')
                ? 'var(--on-primary)'
                : 'var(--on-surface-variant)'
            }}
          >
            {t('marketplace', 'Marketplace')}
          </Link>

          <Link
            to="/about"
            style={{
              padding: '0.4rem 0.85rem',
              borderRadius: 'var(--radius-md)',
              fontSize: '0.875rem',
              fontWeight: isActive('/about')
                ? '600'
                : '500',
              backgroundColor: isActive('/about')
                ? 'var(--primary-container)'
                : 'transparent',
              color: isActive('/about')
                ? 'var(--on-primary)'
                : 'var(--on-surface-variant)'
            }}
          >
            {t('about', 'About')}
          </Link>

          <Link
            to="/orders"
            style={{
              padding: '0.4rem 0.85rem',
              borderRadius: 'var(--radius-md)',
              fontSize: '0.875rem',
              fontWeight: isActive('/orders')
                ? '600'
                : '500',
              backgroundColor: isActive('/orders')
                ? 'var(--primary-container)'
                : 'transparent',
              color: isActive('/orders')
                ? 'var(--on-primary)'
                : 'var(--on-surface-variant)'
            }}
          >
            {t('myOrders', 'My Orders')}
          </Link>

          {role === 'artisan' && (
            <Link
              to="/entrepreneur/dashboard"
              style={{
                padding: '0.4rem 0.85rem',
                borderRadius: 'var(--radius-md)',
                fontSize: '0.875rem',
                fontWeight: '600',
                backgroundColor: 'var(--secondary-fixed)',
                color: 'var(--on-secondary-fixed)',
                display: 'flex',
                alignItems: 'center',
                gap: '0.35rem'
              }}
            >
              <span
                className="material-symbols-outlined"
                style={{ fontSize: '16px' }}
              >
                dashboard
              </span>

              <span>
                {t('dashboard', 'Dashboard')}
              </span>
            </Link>
          )}
        </nav>

        {/* Right Actions */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem'
          }}
        >

          {/* Language Selector */}
          <LanguageSelector />

          {/* Cart */}
          <Link
            to="/cart"
            style={{
              position: 'relative',
              padding: '0.5rem',
              borderRadius: 'var(--radius-md)',
              backgroundColor: 'var(--surface-container)',
              color: 'var(--primary)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
            title={t('cart', 'Cart')}
          >
            <span className="material-symbols-outlined">
              shopping_bag
            </span>

            {totalCount > 0 && (
              <span
                style={{
                  position: 'absolute',
                  top: '-4px',
                  right: '-4px',
                  backgroundColor: 'var(--secondary)',
                  color: 'white',
                  fontSize: '0.65rem',
                  fontWeight: '700',
                  width: '18px',
                  height: '18px',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                {totalCount}
              </span>
            )}
          </Link>

          {/* User Auth Profile */}
          <div style={{ position: 'relative' }}>

            <button
              onClick={() =>
                setAuthDropdownOpen(!authDropdownOpen)
              }
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                padding: '0.35rem 0.6rem',
                borderRadius: 'var(--radius-full)',
                backgroundColor: 'var(--surface-container-high)',
                border: '1px solid var(--border-subtle)',
                cursor: 'pointer'
              }}
            >

              {/* Avatar */}
              <div
                style={{
                  width: '28px',
                  height: '28px',
                  borderRadius: '50%',
                  backgroundColor: 'var(--primary)',
                  color: 'white',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '12px',
                  fontWeight: '700'
                }}
              >
                {avatarLetter}
              </div>

              {/* Username */}
              <span
                style={{
                  fontSize: '0.8rem',
                  fontWeight: '600',
                  color: 'var(--on-surface)'
                }}
                className="hide-on-mobile"
              >
                {user
                  ? firstName
                  : t('common.guest', 'Guest')}
              </span>

              <span
                className="material-symbols-outlined"
                style={{
                  fontSize: '16px',
                  color: 'var(--outline)'
                }}
              >
                arrow_drop_down
              </span>

            </button>

            {/* Dropdown */}
            {authDropdownOpen && (
              <div
                style={{
                  position: 'absolute',
                  right: 0,
                  top: '115%',
                  backgroundColor:
                    'var(--surface-container-lowest)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: 'var(--radius-lg)',
                  boxShadow: 'var(--shadow-lg)',
                  width: '230px',
                  padding: '0.75rem',
                  zIndex: 100,
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.5rem'
                }}
              >

                {/* User Information */}
                <div
                  style={{
                    borderBottom:
                      '1px solid var(--border-subtle)',
                    paddingBottom: '0.5rem'
                  }}
                >
                  <div
                    style={{
                      fontWeight: '700',
                      fontSize: '0.875rem',
                      color: 'var(--primary)'
                    }}
                  >
                    {user
                      ? (
                          lang === 'mr' && user.nameMr
                            ? user.nameMr
                            : lang === 'hi' && user.nameHi
                              ? user.nameHi
                              : user.full_name ||
                                user.name ||
                                'User'
                        )
                      : t(
                          'common.guest',
                          'Guest User'
                        )}
                  </div>

                  <div
                    style={{
                      fontSize: '0.75rem',
                      color: 'var(--secondary)'
                    }}
                  >
                    {role === 'artisan'
                      ? t(
                          'auth.roleArtisan',
                          'Artisan / उद्योजक'
                        )
                      : t(
                          'auth.roleCustomer',
                          'Rural Patron'
                        )}
                  </div>
                </div>

                {/* Demo Persona */}
                <div
                  style={{
                    fontSize: '0.75rem',
                    color: 'var(--outline)',
                    fontWeight: '600',
                    textTransform: 'uppercase'
                  }}
                >
                  {t(
                    'auth.switchPersona',
                    'Switch Demo Persona'
                  )}
                </div>

                {/* Customer */}
                <button
                  onClick={() => {
                    loginAs('customer');
                    setAuthDropdownOpen(false);
                    navigate('/marketplace');
                  }}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'flex-start',
                    gap: '0.5rem',
                    padding: '0.4rem 0.5rem',
                    borderRadius: 'var(--radius-md)',
                    backgroundColor:
                      role === 'customer'
                        ? 'var(--primary-container)'
                        : 'transparent',
                    color:
                      role === 'customer'
                        ? 'white'
                        : 'var(--on-surface)',
                    fontSize: '0.8rem',
                    border: 'none',
                    cursor: 'pointer',
                    width: '100%',
                    textAlign: 'left'
                  }}
                >
                  <span
                    className="material-symbols-outlined"
                    style={{ fontSize: '18px' }}
                  >
                    shopping_basket
                  </span>

                  <span>
                    {t(
                      'auth.demoPatron',
                      'Customer (Ananya Sharma)'
                    )}
                  </span>
                </button>

                {/* Artisan */}
                <button
                  onClick={() => {
                    loginAs('artisan');
                    setAuthDropdownOpen(false);
                    navigate('/entrepreneur/dashboard');
                  }}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'flex-start',
                    gap: '0.5rem',
                    padding: '0.4rem 0.5rem',
                    borderRadius: 'var(--radius-md)',
                    backgroundColor:
                      role === 'artisan'
                        ? 'var(--primary-container)'
                        : 'transparent',
                    color:
                      role === 'artisan'
                        ? 'white'
                        : 'var(--on-surface)',
                    fontSize: '0.8rem',
                    border: 'none',
                    cursor: 'pointer',
                    width: '100%',
                    textAlign: 'left'
                  }}
                >
                  <span
                    className="material-symbols-outlined"
                    style={{ fontSize: '18px' }}
                  >
                    handshake
                  </span>

                  <span>
                    {t(
                      'auth.demoArtisan',
                      'Artisan (Savita Patil)'
                    )}
                  </span>
                </button>

                {/* Bottom Actions */}
                <div
                  style={{
                    borderTop:
                      '1px solid var(--border-subtle)',
                    paddingTop: '0.5rem',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                  }}
                >

                  <Link
                    to="/get-started"
                    onClick={() =>
                      setAuthDropdownOpen(false)
                    }
                    style={{
                      fontSize: '0.8rem',
                      color: 'var(--secondary)',
                      fontWeight: '700'
                    }}
                  >
                    {t(
                      'auth.selectRole',
                      'Select Role →'
                    )}
                  </Link>

                  {/* LOGOUT - UPDATED */}
                  <button
                    onClick={async () => {
                      await logout();
                      setAuthDropdownOpen(false);
                      navigate('/');
                    }}
                    style={{
                      fontSize: '0.8rem',
                      color: 'var(--error)',
                      background: 'none',
                      border: 'none',
                      cursor: 'pointer',
                      padding: 0
                    }}
                  >
                    {t(
                      'common.logout',
                      'Logout'
                    )}
                  </button>

                </div>
              </div>
            )}
          </div>

          {/* Become an Entrepreneur */}
          <Link
            to="/entrepreneur/onboarding"
            className="btn-secondary btn-sm hide-on-mobile"
            style={{ textDecoration: 'none' }}
          >
            {t(
              'register',
              'Become an Entrepreneur'
            )}
          </Link>

          {/* Mobile Menu */}
          <button
            onClick={() =>
              setMobileOpen(!mobileOpen)
            }
            className="mobile-menu-btn"
            style={{
              padding: '0.4rem',
              color: 'var(--primary)',
              background: 'none',
              border: 'none',
              cursor: 'pointer'
            }}
            aria-label="Toggle Navigation Menu"
          >
            <span className="material-symbols-outlined">
              {mobileOpen ? 'close' : 'menu'}
            </span>
          </button>

        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileOpen && (
        <div
          style={{
            backgroundColor: 'var(--surface)',
            borderBottom:
              '1px solid var(--border-subtle)',
            padding: '1.25rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '0.75rem',
            boxShadow: 'var(--shadow-md)'
          }}
        >

          <Link
            to="/"
            onClick={() => setMobileOpen(false)}
            style={{
              fontSize: '1rem',
              fontWeight: '600',
              color: 'var(--primary)'
            }}
          >
            {t('home', 'Home')}
          </Link>

          <Link
            to="/marketplace"
            onClick={() => setMobileOpen(false)}
            style={{
              fontSize: '1rem',
              fontWeight: '600',
              color: 'var(--primary)'
            }}
          >
            {t('marketplace', 'Marketplace')}
          </Link>

          <Link
            to="/about"
            onClick={() => setMobileOpen(false)}
            style={{
              fontSize: '1rem',
              fontWeight: '600',
              color: 'var(--primary)'
            }}
          >
            {t('about', 'About')}
          </Link>

          <Link
            to="/orders"
            onClick={() => setMobileOpen(false)}
            style={{
              fontSize: '1rem',
              fontWeight: '600',
              color: 'var(--primary)'
            }}
          >
            {t('myOrders', 'My Orders')}
          </Link>

          <Link
            to="/entrepreneur/dashboard"
            onClick={() => setMobileOpen(false)}
            style={{
              fontSize: '1rem',
              fontWeight: '600',
              color: 'var(--secondary)'
            }}
          >
            {t('dashboard', 'Dashboard')} (
            {t(
              'auth.roleArtisan',
              'उद्योजक'
            )}
            )
          </Link>

          {/* Mobile Language */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '0.5rem 0',
              borderBottom:
                '1px solid var(--border-subtle)'
            }}
          >
            <span
              style={{
                fontSize: '0.85rem',
                fontWeight: '600',
                color: 'var(--outline)'
              }}
            >
              🌐 {t(
                'navigation.selectLanguage',
                'Language'
              )}:
            </span>

            <LanguageSelector compact={true} />
          </div>

          {/* Mobile Entrepreneur CTA */}
          <Link
            to="/entrepreneur/onboarding"
            onClick={() => setMobileOpen(false)}
            className="btn-secondary"
            style={{
              marginTop: '0.5rem',
              textAlign: 'center',
              justifyContent: 'center'
            }}
          >
            {t(
              'register',
              'Become an Entrepreneur'
            )}
          </Link>

        </div>
      )}

      {/* Responsive Styles */}
      <style>{`
        @media (min-width: 900px) {
          .desktop-nav {
            display: flex !important;
          }

          .mobile-menu-btn {
            display: none !important;
          }
        }

        @media (max-width: 640px) {
          .hide-on-mobile {
            display: none !important;
          }
        }
      `}</style>

    </header>
  );
};