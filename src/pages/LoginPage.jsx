import React, { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { supabase } from '../lib/supabase';
import { demoArtisan, demoCustomer } from '../data/mockData';

export const LoginPage = () => {
  const { loginAs } = useAuth();
  const { lang, t } = useLanguage();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  // Initial role from query param
  // ?role=artisan or ?role=customer
  const initialRole =
    searchParams.get('role') === 'artisan' ? 'artisan' : 'customer';

  const [activeTab, setActiveTab] = useState(initialRole);

  // password login is the real Supabase login method
  const [authMethod, setAuthMethod] = useState('password');

  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');

  // OTP UI is kept for now, but is not connected to Supabase yet
  const [otpValue, setOtpValue] = useState('');
  const [otpSent, setOtpSent] = useState(false);

  const [toastMessage, setToastMessage] = useState('');
  const [loading, setLoading] = useState(false);

  // ---------------------------------------------------------
  // CHANGE ROLE TAB
  // ---------------------------------------------------------
  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setIdentifier('');
    setPassword('');
    setOtpValue('');
    setOtpSent(false);
    setAuthMethod('password');
  };

  // ---------------------------------------------------------
  // OTP - UI ONLY FOR NOW
  // ---------------------------------------------------------
  const handleSendOtp = (e) => {
    e.preventDefault();

    setOtpSent(true);
    setAuthMethod('otp');

    setToastMessage(
      t(
        'auth.otpSentSuccess',
        'OTP feature will be connected later.'
      )
    );

    setTimeout(() => {
      setToastMessage('');
    }, 4000);
  };

  // ---------------------------------------------------------
  // REAL SUPABASE LOGIN
  // ---------------------------------------------------------
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (authMethod === 'otp') {
      setToastMessage(
        'OTP login is not connected yet. Please use email and password.'
      );

      setTimeout(() => {
        setToastMessage('');
      }, 4000);

      return;
    }

    const email = identifier.trim();

    if (!email) {
      setToastMessage('Please enter your email address.');

      setTimeout(() => {
        setToastMessage('');
      }, 3000);

      return;
    }

    if (!password) {
      setToastMessage('Please enter your password.');

      setTimeout(() => {
        setToastMessage('');
      }, 3000);

      return;
    }

    try {
      setLoading(true);

      console.log('LOGIN STARTED');
      console.log('LOGIN EMAIL:', email);

      // -----------------------------------------------------
      // SIGN IN WITH SUPABASE AUTH
      // -----------------------------------------------------
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email,
        password: password
      });

      console.log('LOGIN DATA:', data);
      console.log('LOGIN ERROR:', error);

      if (error) {
        console.error('SUPABASE LOGIN ERROR:', error);

        setToastMessage(error.message);

        setTimeout(() => {
          setToastMessage('');
        }, 5000);

        return;
      }

      if (!data.user) {
        setToastMessage('Login failed. Please try again.');

        setTimeout(() => {
          setToastMessage('');
        }, 4000);

        return;
      }

      // -----------------------------------------------------
      // FETCH USER PROFILE FROM DATABASE
      // -----------------------------------------------------
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', data.user.id)
        .single();

      console.log('USER PROFILE:', profile);
      console.log('PROFILE ERROR:', profileError);

      if (profileError) {
        console.error('PROFILE FETCH ERROR:', profileError);

        setToastMessage(
          'Login successful, but your profile could not be loaded.'
        );

        setTimeout(() => {
          setToastMessage('');
        }, 5000);

        return;
      }

      if (!profile) {
        setToastMessage(
          'Profile not found. Please contact the administrator.'
        );

        setTimeout(() => {
          setToastMessage('');
        }, 5000);

        return;
      }

      // -----------------------------------------------------
      // CHECK ROLE FROM DATABASE
      // -----------------------------------------------------
      const userRole = profile.role;

      console.log('USER ROLE:', userRole);

      // -----------------------------------------------------
      // KEEP EXISTING AUTH CONTEXT UPDATED
      // -----------------------------------------------------
      const loggedInUser = {
        id: data.user.id,
        name: profile.full_name,
        email: profile.email || data.user.email,
        phone: profile.phone,
        role: userRole,
        village: profile.village,
        district: profile.district,
        craft: profile.craft,
        shgName: profile.shg_name
      };

      loginAs(userRole, loggedInUser);

      // -----------------------------------------------------
      // SUCCESS MESSAGE
      // -----------------------------------------------------
      setToastMessage('Login successful!');

      // -----------------------------------------------------
      // ROLE-BASED REDIRECT
      // -----------------------------------------------------
      setTimeout(() => {
        if (userRole === 'artisan') {
          navigate('/entrepreneur/dashboard');
        } else if (userRole === 'customer') {
          navigate('/marketplace');
        } else {
          console.warn('Unknown role:', userRole);
          navigate('/');
        }
      }, 700);

    } catch (error) {
      console.error('LOGIN EXCEPTION:', error);

      setToastMessage(
        'Something went wrong while logging in. Please try again.'
      );

      setTimeout(() => {
        setToastMessage('');
      }, 5000);

    } finally {
      setLoading(false);
    }
  };

  // ---------------------------------------------------------
  // DEMO LOGIN
  // ---------------------------------------------------------
  // These buttons still use the old local/demo AuthContext.
  // They are NOT real Supabase authentication.
  const handleOneClickLogin = (role) => {
    const demoUser = role === 'artisan' ? demoArtisan : demoCustomer;
    loginAs(role, demoUser);

    if (role === 'artisan') {
      navigate('/entrepreneur/dashboard');
    } else {
      navigate('/marketplace');
    }
  };

  // ---------------------------------------------------------
  // LOCALIZED WELCOME TEXT
  // ---------------------------------------------------------
  const welcomeSub =
    lang === 'mr'
      ? '(स्वागत आहे)'
      : lang === 'hi'
      ? '(स्वागत है)'
      : '(Welcome)';

  return (
    <div
      style={{
        width: '100%',
        minHeight: 'calc(100vh - 72px)',
        backgroundColor: '#f7f4ee',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '2.5rem 1.25rem',
        boxSizing: 'border-box'
      }}
    >
      {/* =====================================================
          TOAST
         ===================================================== */}
      {toastMessage && (
        <div
          style={{
            position: 'fixed',
            top: '80px',
            right: '24px',
            backgroundColor: '#0f382a',
            color: '#ffffff',
            padding: '0.75rem 1.25rem',
            borderRadius: '10px',
            boxShadow: '0 8px 24px rgba(0,0,0,0.15)',
            zIndex: 1000,
            fontSize: '0.875rem',
            fontWeight: '600',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem'
          }}
        >
          <span
            className="material-symbols-outlined"
            style={{
              color: '#bdecb5',
              fontSize: '18px'
            }}
          >
            check_circle
          </span>

          <span>{toastMessage}</span>
        </div>
      )}

      {/* =====================================================
          MAIN CARD
         ===================================================== */}
      <div
        style={{
          width: '100%',
          maxWidth: '960px',
          backgroundColor: '#ffffff',
          borderRadius: '24px',
          overflow: 'hidden',
          boxShadow:
            '0 20px 45px -12px rgba(15, 56, 42, 0.12), 0 4px 16px rgba(0,0,0,0.04)',
          border: '1px solid #e7e0d3',
          display: 'grid',
          gridTemplateColumns:
            'minmax(320px, 1fr) minmax(360px, 1.2fr)'
        }}
        className="gramudyam-login-grid"
      >
        {/* ===================================================
            LEFT COLUMN
           =================================================== */}
        <div
          style={{
            position: 'relative',
            backgroundColor: '#10382a',
            backgroundImage:
              'radial-gradient(circle at 20% 30%, #174d3a 0%, #0d2e22 100%)',
            color: '#ffffff',
            padding: '2.75rem 2.5rem',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            minHeight: '520px',
            overflow: 'hidden'
          }}
        >
          {/* Background Texture */}
          <div
            style={{
              position: 'absolute',
              inset: 0,
              backgroundImage:
                "url('https://lh3.googleusercontent.com/aida-public/AB6AXuCF--_fSU3Qo5qkIawYREQT_9Q90Mo35XlHKhTXSa9rTiq8IFxCFjn0JHna0zOgeEF24YbFO8FdJ0dm6cNlUNBjAnZneR2VOEVMTFCkn4D_OSs2jNy-PukP0mtDsa7CxNlJrJlLJmL0DgC6dCaBFSWtgp1NkaBsd0ScRmkNPQ2-WcJhFATZiaQ3tO14WqEqyZ_eizplSVv5SM0-p31qsW-0g8DkXT8qNonr5mCGc3Y2DOJmeEFOrXadNg')",
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              mixBlendMode: 'overlay',
              opacity: 0.28,
              pointerEvents: 'none'
            }}
          />

          {/* Brand Header */}
          <div
            style={{
              position: 'relative',
              zIndex: 2,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '0.75rem'
            }}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem'
              }}
            >
              <img
                src="/logo.png"
                alt="GRAMUDYAM"
                style={{
                  width: '42px',
                  height: '42px',
                  objectFit: 'contain',
                  borderRadius: '50%',
                  backgroundColor: '#ffffff',
                  padding: '2px',
                  flexShrink: 0,
                  boxShadow: '0 2px 8px rgba(0,0,0,0.15)'
                }}
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = '/logo.svg';
                }}
              />

              <div>
                <span
                  style={{
                    fontFamily:
                      'var(--font-serif, "Playfair Display", Georgia, serif)',
                    fontSize: '1.05rem',
                    fontWeight: '800',
                    color: '#ffffff',
                    display: 'block',
                    letterSpacing: '0.04em',
                    lineHeight: 1.1
                  }}
                >
                  GRAMUDYAM
                </span>

                <span
                  style={{
                    fontSize: '0.7rem',
                    color: '#98ceb8',
                    fontWeight: '500',
                    display: 'block',
                    marginTop: '2px'
                  }}
                >
                  {t(
                    'navigation.brandSubtitleMr',
                    'महाराष्ट्र ग्रामीण मंच'
                  )}
                </span>
              </div>
            </div>

            {/* Certification Badge */}
            <div
              style={{
                border: '1px solid rgba(255, 255, 255, 0.22)',
                backgroundColor: 'rgba(255, 255, 255, 0.09)',
                backdropFilter: 'blur(6px)',
                color: '#ffffff',
                fontSize: '0.625rem',
                fontWeight: '700',
                letterSpacing: '0.06em',
                padding: '0.35rem 0.75rem',
                borderRadius: '9999px',
                textTransform: 'uppercase',
                whiteSpace: 'nowrap'
              }}
            >
              {t('auth.giShgCertified', 'GI & SHG CERTIFIED')}
            </div>
          </div>

          {/* Hero */}
          <div
            style={{
              position: 'relative',
              zIndex: 2,
              margin: '2.5rem 0 2rem 0'
            }}
          >
            <h2
              style={{
                fontFamily:
                  'var(--font-serif, "Playfair Display", Georgia, serif)',
                fontSize: 'clamp(1.85rem, 3vw, 2.35rem)',
                fontWeight: '700',
                color: '#ffffff',
                lineHeight: 1.22,
                margin: 0
              }}
            >
              {t('auth.heroTitle1', 'Crafted by hands.')}{' '}

              <span
                style={{
                  display: 'block',
                  fontStyle: 'italic',
                  fontWeight: '400',
                  color: '#9fd4bf',
                  marginTop: '2px'
                }}
              >
                {t(
                  'auth.heroTitle2',
                  'Empowered by technology.'
                )}
              </span>
            </h2>

            <p
              style={{
                fontSize: '0.875rem',
                color: 'rgba(255, 255, 255, 0.75)',
                lineHeight: 1.6,
                marginTop: '1.25rem',
                maxWidth: '360px'
              }}
            >
              {t(
                'auth.heroSubtitle',
                'Direct village-to-doorstep fair trade bridging regional Maharashtra heritage with mindful patrons.'
              )}
            </p>
          </div>
        </div>

        {/* ===================================================
            RIGHT COLUMN
           =================================================== */}
        <div
          style={{
            padding: '2.75rem 2.5rem',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            backgroundColor: '#ffffff'
          }}
        >
          <div>
            {/* Top Bar */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: '1.5rem',
                gap: '0.5rem'
              }}
            >
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.4rem',
                  fontSize: '0.8rem',
                  color: '#52665b',
                  fontWeight: '600'
                }}
              >
                <span
                  className="material-symbols-outlined"
                  style={{
                    color: '#0f382a',
                    fontSize: '18px'
                  }}
                >
                  shield
                </span>

                <span>
                  {t(
                    'auth.govtVerified',
                    'Government Verified Gateway'
                  )}
                </span>
              </div>

              <Link
                to="/register"
                style={{
                  fontSize: '0.825rem',
                  fontWeight: '700',
                  color: '#984a2b',
                  textDecoration: 'none',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '2px'
                }}
              >
                <span>
                  {t(
                    'auth.newUserRegister',
                    'New User? Register →'
                  )}
                </span>
              </Link>
            </div>

            {/* Title */}
            <h1
              style={{
                fontFamily:
                  'var(--font-serif, "Playfair Display", Georgia, serif)',
                fontSize: 'clamp(1.75rem, 2.5vw, 2.15rem)',
                fontWeight: '700',
                color: '#0f382a',
                lineHeight: 1.2,
                margin: '0 0 0.4rem 0'
              }}
            >
              {t('auth.welcomeBack', 'Welcome Back')}{' '}

              <span
                style={{
                  color: '#a0522d',
                  fontWeight: '600',
                  fontSize: 'clamp(1.2rem, 1.8vw, 1.45rem)'
                }}
              >
                {welcomeSub}
              </span>
            </h1>

            {/* Subtitle */}
            <p
              style={{
                fontSize: '0.85rem',
                color: '#607268',
                lineHeight: 1.5,
                margin: '0 0 1.5rem 0'
              }}
            >
              {t(
                'auth.loginSubtitle',
                'Login to access your orders, fair-trade craft traceability, or your rural enterprise dashboard.'
              )}
            </p>

            {/* Role Tabs */}
            <div
              style={{
                display: 'flex',
                padding: '4px',
                backgroundColor: '#ede7db',
                borderRadius: '12px',
                marginBottom: '1.4rem'
              }}
            >
              {/* Customer */}
              <button
                type="button"
                onClick={() => handleTabChange('customer')}
                style={{
                  flex: 1,
                  padding: '0.65rem 0.75rem',
                  borderRadius: '9px',
                  fontSize: '0.85rem',
                  fontWeight:
                    activeTab === 'customer' ? '700' : '600',
                  backgroundColor:
                    activeTab === 'customer'
                      ? '#ffffff'
                      : 'transparent',
                  color:
                    activeTab === 'customer'
                      ? '#0f382a'
                      : '#57675e',
                  boxShadow:
                    activeTab === 'customer'
                      ? '0 2px 6px rgba(0,0,0,0.06)'
                      : 'none',
                  border: 'none',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.45rem'
                }}
              >
                <span
                  className="material-symbols-outlined"
                  style={{ fontSize: '18px' }}
                >
                  shopping_bag
                </span>

                <span>
                  {t(
                    'auth.roleCustomer',
                    'Buyer / Patron'
                  )}
                </span>
              </button>

              {/* Artisan */}
              <button
                type="button"
                onClick={() => handleTabChange('artisan')}
                style={{
                  flex: 1,
                  padding: '0.65rem 0.75rem',
                  borderRadius: '9px',
                  fontSize: '0.85rem',
                  fontWeight:
                    activeTab === 'artisan' ? '700' : '600',
                  backgroundColor:
                    activeTab === 'artisan'
                      ? '#ffffff'
                      : 'transparent',
                  color:
                    activeTab === 'artisan'
                      ? '#0f382a'
                      : '#57675e',
                  boxShadow:
                    activeTab === 'artisan'
                      ? '0 2px 6px rgba(0,0,0,0.06)'
                      : 'none',
                  border: 'none',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.45rem'
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
                    'auth.roleArtisan',
                    'Rural Artisan (उद्योजक)'
                  )}
                </span>
              </button>
            </div>

            {/* =================================================
                LOGIN FORM
               ================================================= */}
            <form
              onSubmit={handleSubmit}
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '1rem'
              }}
            >
              {/* Email */}
              <div>
                <label
                  style={{
                    display: 'block',
                    fontSize: '0.825rem',
                    fontWeight: '700',
                    color: '#1a2e24',
                    marginBottom: '0.4rem'
                  }}
                >
                  {t(
                    'auth.phoneEmailLabel',
                    'Email Address'
                  )}
                </label>

                <input
                  type="email"
                  value={identifier}
                  onChange={(e) =>
                    setIdentifier(e.target.value)
                  }
                  placeholder="Enter your email"
                  style={{
                    width: '100%',
                    boxSizing: 'border-box',
                    padding: '0.8rem 1rem',
                    borderRadius: '10px',
                    border: '1px solid #ebdccb',
                    backgroundColor: '#f7f2e7',
                    fontSize: '0.925rem',
                    fontWeight: '600',
                    color: '#1a2e24',
                    outline: 'none'
                  }}
                  required
                />
              </div>

              {/* Password */}
              <div>
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    marginBottom: '0.4rem'
                  }}
                >
                  <label
                    style={{
                      fontSize: '0.825rem',
                      fontWeight: '700',
                      color: '#1a2e24'
                    }}
                  >
                    {t(
                      'auth.passwordOtpLabel',
                      'Password'
                    )}
                  </label>

                  <button
                    type="button"
                    onClick={handleSendOtp}
                    style={{
                      background: 'none',
                      border: 'none',
                      padding: 0,
                      color: '#984a2b',
                      fontWeight: '700',
                      fontSize: '0.8rem',
                      cursor: 'pointer'
                    }}
                  >
                    {otpSent
                      ? t(
                          'auth.resendOtp',
                          'Resend OTP'
                        )
                      : t(
                          'auth.sendOtp',
                          'Use OTP'
                        )}
                  </button>
                </div>

                <input
                  type="password"
                  value={password}
                  onChange={(e) =>
                    setPassword(e.target.value)
                  }
                  placeholder="Enter your password"
                  style={{
                    width: '100%',
                    boxSizing: 'border-box',
                    padding: '0.8rem 1rem',
                    borderRadius: '10px',
                    border: '1px solid #ebdccb',
                    backgroundColor: '#f7f2e7',
                    fontSize: '0.925rem',
                    fontWeight: '600',
                    color: '#1a2e24',
                    outline: 'none'
                  }}
                  required
                />
              </div>

              {/* Login Button */}
              <button
                type="submit"
                disabled={loading}
                style={{
                  width: '100%',
                  marginTop: '0.35rem',
                  padding: '0.9rem 1.25rem',
                  borderRadius: '10px',
                  backgroundColor: loading
                    ? '#6d8479'
                    : '#0d3829',
                  color: '#ffffff',
                  fontSize: '0.95rem',
                  fontWeight: '700',
                  border: 'none',
                  cursor: loading
                    ? 'not-allowed'
                    : 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.5rem',
                  boxShadow:
                    '0 4px 12px rgba(13, 56, 41, 0.25)'
                }}
              >
                {loading ? (
                  <span>Logging in...</span>
                ) : (
                  <span>
                    {activeTab === 'customer'
                      ? t(
                          'auth.loginAsPatron',
                          'Login as Conscious Patron'
                        )
                      : t(
                          'auth.loginAsArtisan',
                          'Login as Rural Artisan'
                        )}
                  </span>
                )}
              </button>
            </form>
          </div>

          {/* =================================================
              DEMO LOGIN SECTION
             ================================================= */}
          <div
            style={{
              backgroundColor: '#f4ede0',
              borderRadius: '14px',
              padding: '1rem 1.15rem',
              marginTop: '1.5rem',
              border: '1px solid #e7ddca'
            }}
          >
            <div
              style={{
                fontSize: '0.72rem',
                fontWeight: '800',
                color: '#7b7366',
                letterSpacing: '0.06em',
                textTransform: 'uppercase',
                marginBottom: '0.65rem'
              }}
            >
              {t(
                'auth.oneClickLogins',
                'ONE-CLICK EVALUATOR LOGINS:'
              )}
            </div>

            <div
              style={{
                display: 'flex',
                flexWrap: 'wrap',
                gap: '0.6rem'
              }}
            >
              {/* Demo Customer */}
              <button
                type="button"
                onClick={() =>
                  handleOneClickLogin('customer')
                }
                style={{
                  backgroundColor: '#ffffff',
                  color: '#1a2e24',
                  border: '1px solid #ded4bf',
                  borderRadius: '8px',
                  padding: '0.45rem 0.85rem',
                  fontSize: '0.8rem',
                  fontWeight: '700',
                  cursor: 'pointer'
                }}
              >
                {t(
                  'auth.demoPatron',
                  'Demo: Patron (Ananya)'
                )}
              </button>

              {/* Demo Artisan */}
              <button
                type="button"
                onClick={() =>
                  handleOneClickLogin('artisan')
                }
                style={{
                  backgroundColor: '#ffffff',
                  color: '#1a2e24',
                  border: '1px solid #ded4bf',
                  borderRadius: '8px',
                  padding: '0.45rem 0.85rem',
                  fontSize: '0.8rem',
                  fontWeight: '700',
                  cursor: 'pointer'
                }}
              >
                {t(
                  'auth.demoArtisan',
                  'Demo: Artisan (Savita)'
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Responsive */}
      <style>{`
        @media (max-width: 768px) {
          .gramudyam-login-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
};