import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const LoginForm = ({
  role = 'customer',
  title = 'Sign In',
  subtitle = 'Enter your credentials to continue',
  roleBadge = 'Portal',
  roleIcon = 'login',
  defaultIdentifier = '',
  defaultPassword = '',
  identifierLabel = 'Email Address',
  identifierType = 'email',
  identifierPlaceholder = 'you@example.com',
  destinationRoute = '/marketplace',
  accentColor = 'var(--primary)',
  demoAccountHint = null
}) => {
  const navigate = useNavigate();
  const { loginAs } = useAuth();

  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');

  // Client-side Validation
  const validate = () => {
    const errs = {};

    if (!identifier.trim()) {
      errs.identifier = `${identifierLabel} is required`;
    } else if (identifierType === 'email') {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(identifier.trim())) {
        errs.identifier = 'Please enter a valid email address';
      }
    } else if (identifier.trim().length < 3) {
      errs.identifier = `${identifierLabel} must be at least 3 characters`;
    }

    if (!password) {
      errs.password = 'Password is required';
    } else if (password.length < 6) {
      errs.password = 'Password must be at least 6 characters long';
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleQuickFill = () => {
    setIdentifier(defaultIdentifier);
    setPassword(defaultPassword);
    setErrors({});
    setSubmitError('');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitError('');

    if (!validate()) {
      return;
    }

    setIsSubmitting(true);

    // Simulate authentication delay for realistic UX
    setTimeout(() => {
      try {
        // Log in as role with mock session persistence
        loginAs(role);

        // Also ensure explicit localStorage key per prompt requirements:
        // localStorage.setItem("gramudyam_user_role", role);
        localStorage.setItem('gramudyam_user_role', role);

        setIsSubmitting(false);
        navigate(destinationRoute);
      } catch (err) {
        setIsSubmitting(false);
        setSubmitError('Failed to authenticate. Please check credentials.');
      }
    }, 450);
  };

  return (
    <div
      style={{
        minHeight: 'calc(100vh - 72px)',
        backgroundColor: 'var(--background)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '2.5rem 1.25rem',
        position: 'relative'
      }}
    >
      {/* Decorative subtle background wash */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: '280px',
          background: `radial-gradient(ellipse at top, ${accentColor === 'var(--secondary)' ? 'rgba(150, 72, 38, 0.08)' : 'rgba(7, 56, 39, 0.08)'}, transparent 70%)`,
          pointerEvents: 'none'
        }}
      />

      <div style={{ maxWidth: '480px', width: '100%', position: 'relative', zIndex: 1 }}>
        {/* Back Button: ← Back to role selection */}
        <div style={{ marginBottom: '1.5rem' }}>
          <button
            onClick={() => navigate('/get-started')}
            type="button"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.4rem',
              color: 'var(--on-surface-variant)',
              backgroundColor: 'transparent',
              border: 'none',
              cursor: 'pointer',
              fontSize: '0.875rem',
              fontWeight: '600',
              padding: '0.4rem 0.5rem',
              borderRadius: 'var(--radius-sm)',
              transition: 'all 0.2s ease'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.color = 'var(--primary)';
              e.currentTarget.style.backgroundColor = 'var(--surface-container)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color = 'var(--on-surface-variant)';
              e.currentTarget.style.backgroundColor = 'transparent';
            }}
          >
            <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>
              arrow_back
            </span>
            <span>Back to role selection</span>
          </button>
        </div>

        {/* Card Box */}
        <div
          style={{
            backgroundColor: 'var(--surface)',
            borderRadius: 'var(--radius-xl)',
            border: '1px solid var(--border-subtle)',
            boxShadow: 'var(--shadow-lg)',
            padding: '2.5rem 2rem',
            position: 'relative',
            overflow: 'hidden'
          }}
        >
          {/* Top colored accent line */}
          <div
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              height: '5px',
              backgroundColor: accentColor
            }}
          />

          {/* Header */}
          <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
            <div
              style={{
                width: '56px',
                height: '56px',
                borderRadius: '50%',
                backgroundColor: 'var(--surface-container-high)',
                color: accentColor,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 1rem',
                border: '1px solid var(--border-subtle)'
              }}
            >
              <span className="material-symbols-outlined" style={{ fontSize: '28px' }}>
                {roleIcon}
              </span>
            </div>

            <div
              style={{
                display: 'inline-block',
                fontSize: '0.75rem',
                fontWeight: '700',
                color: accentColor,
                backgroundColor: 'var(--surface-container-high)',
                padding: '0.2rem 0.65rem',
                borderRadius: 'var(--radius-full)',
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
                marginBottom: '0.5rem'
              }}
            >
              {roleBadge}
            </div>

            <h1
              style={{
                fontFamily: 'var(--font-serif)',
                fontSize: '1.85rem',
                color: 'var(--primary)',
                fontWeight: '700',
                margin: '0 0 0.5rem 0'
              }}
            >
              {title}
            </h1>
            <p
              style={{
                fontSize: '0.9rem',
                color: 'var(--on-surface-variant)',
                margin: 0,
                lineHeight: 1.5
              }}
            >
              {subtitle}
            </p>
          </div>

          {/* Demo Credentials Quick Fill Banner */}
          {demoAccountHint && (
            <div
              style={{
                backgroundColor: 'rgba(243, 237, 223, 0.75)',
                border: '1px dashed var(--border-subtle)',
                borderRadius: 'var(--radius-md)',
                padding: '0.85rem 1rem',
                marginBottom: '1.75rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: '0.75rem'
              }}
            >
              <div style={{ fontSize: '0.8rem', color: 'var(--on-surface)' }}>
                <div style={{ fontWeight: '700', color: 'var(--primary)' }}>Demo Account:</div>
                <div style={{ color: 'var(--on-surface-variant)' }}>
                  {demoAccountHint.label || defaultIdentifier}
                </div>
              </div>

              <button
                type="button"
                onClick={handleQuickFill}
                style={{
                  padding: '0.35rem 0.75rem',
                  fontSize: '0.75rem',
                  fontWeight: '700',
                  color: 'white',
                  backgroundColor: accentColor,
                  border: 'none',
                  borderRadius: 'var(--radius-sm)',
                  cursor: 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.25rem',
                  flexShrink: 0
                }}
              >
                <span className="material-symbols-outlined" style={{ fontSize: '14px' }}>
                  auto_fix_high
                </span>
                <span>Fill Demo</span>
              </button>
            </div>
          )}

          {/* Submission Error Banner */}
          {submitError && (
            <div
              style={{
                backgroundColor: 'rgba(186, 26, 26, 0.08)',
                border: '1px solid var(--error)',
                borderRadius: 'var(--radius-md)',
                padding: '0.75rem 1rem',
                marginBottom: '1.5rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                color: 'var(--error)',
                fontSize: '0.85rem'
              }}
            >
              <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>
                error
              </span>
              <span>{submitError}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} noValidate>
            {/* Identifier Field */}
            <div style={{ marginBottom: '1.25rem' }}>
              <label
                htmlFor="identifier"
                style={{
                  display: 'block',
                  fontSize: '0.85rem',
                  fontWeight: '600',
                  color: 'var(--on-surface)',
                  marginBottom: '0.4rem'
                }}
              >
                {identifierLabel} <span style={{ color: 'var(--error)' }}>*</span>
              </label>

              <div style={{ position: 'relative' }}>
                <input
                  id="identifier"
                  type={identifierType}
                  value={identifier}
                  onChange={(e) => {
                    setIdentifier(e.target.value);
                    if (errors.identifier) setErrors({ ...errors, identifier: null });
                  }}
                  placeholder={identifierPlaceholder}
                  style={{
                    width: '100%',
                    padding: '0.75rem 1rem',
                    borderRadius: 'var(--radius-md)',
                    border: errors.identifier ? '1.5px solid var(--error)' : '1px solid var(--border-subtle)',
                    backgroundColor: 'var(--surface-container-lowest)',
                    fontSize: '0.925rem',
                    color: 'var(--on-surface)',
                    outline: 'none',
                    transition: 'border-color 0.2s ease'
                  }}
                  onFocus={(e) => {
                    if (!errors.identifier) e.target.style.borderColor = accentColor;
                  }}
                  onBlur={(e) => {
                    if (!errors.identifier) e.target.style.borderColor = 'var(--border-subtle)';
                  }}
                />
              </div>

              {errors.identifier && (
                <div
                  style={{
                    fontSize: '0.78rem',
                    color: 'var(--error)',
                    marginTop: '0.35rem',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.25rem'
                  }}
                >
                  <span className="material-symbols-outlined" style={{ fontSize: '14px' }}>
                    warning
                  </span>
                  <span>{errors.identifier}</span>
                </div>
              )}
            </div>

            {/* Password Field */}
            <div style={{ marginBottom: '1.5rem' }}>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: '0.4rem'
                }}
              >
                <label
                  htmlFor="password"
                  style={{
                    fontSize: '0.85rem',
                    fontWeight: '600',
                    color: 'var(--on-surface)'
                  }}
                >
                  Password <span style={{ color: 'var(--error)' }}>*</span>
                </label>

                <span
                  style={{
                    fontSize: '0.75rem',
                    color: 'var(--on-surface-variant)'
                  }}
                >
                  Min. 6 characters
                </span>
              </div>

              <div style={{ position: 'relative' }}>
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    if (errors.password) setErrors({ ...errors, password: null });
                  }}
                  placeholder="Enter your password"
                  style={{
                    width: '100%',
                    padding: '0.75rem 2.75rem 0.75rem 1rem',
                    borderRadius: 'var(--radius-md)',
                    border: errors.password ? '1.5px solid var(--error)' : '1px solid var(--border-subtle)',
                    backgroundColor: 'var(--surface-container-lowest)',
                    fontSize: '0.925rem',
                    color: 'var(--on-surface)',
                    outline: 'none',
                    transition: 'border-color 0.2s ease'
                  }}
                  onFocus={(e) => {
                    if (!errors.password) e.target.style.borderColor = accentColor;
                  }}
                  onBlur={(e) => {
                    if (!errors.password) e.target.style.borderColor = 'var(--border-subtle)';
                  }}
                />

                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{
                    position: 'absolute',
                    right: '0.75rem',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    color: 'var(--on-surface-variant)',
                    display: 'flex',
                    alignItems: 'center',
                    padding: '0.2rem'
                  }}
                  title={showPassword ? 'Hide password' : 'Show password'}
                >
                  <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>
                    {showPassword ? 'visibility_off' : 'visibility'}
                  </span>
                </button>
              </div>

              {errors.password && (
                <div
                  style={{
                    fontSize: '0.78rem',
                    color: 'var(--error)',
                    marginTop: '0.35rem',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.25rem'
                  }}
                >
                  <span className="material-symbols-outlined" style={{ fontSize: '14px' }}>
                    warning
                  </span>
                  <span>{errors.password}</span>
                </div>
              )}
            </div>

            {/* Remember Me & Help Links */}
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '1.75rem',
                fontSize: '0.825rem'
              }}
            >
              <label style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', cursor: 'pointer', color: 'var(--on-surface-variant)' }}>
                <input type="checkbox" defaultChecked style={{ accentColor }} />
                <span>Remember this device</span>
              </label>

              <span
                style={{
                  color: 'var(--primary)',
                  fontWeight: '600',
                  cursor: 'pointer'
                }}
                onClick={() => alert('Demo Mode: In production, password reset instructions are sent via SMS/OTP.')}
              >
                Forgot Password?
              </span>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className={accentColor === 'var(--secondary)' ? 'btn-secondary' : 'btn-primary'}
              style={{
                width: '100%',
                padding: '0.9rem',
                fontSize: '0.95rem',
                fontWeight: '700',
                borderRadius: 'var(--radius-md)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.5rem',
                cursor: isSubmitting ? 'not-allowed' : 'pointer',
                opacity: isSubmitting ? 0.8 : 1,
                boxShadow: 'var(--shadow-md)'
              }}
            >
              {isSubmitting ? (
                <>
                  <span
                    className="material-symbols-outlined"
                    style={{
                      fontSize: '18px',
                      animation: 'spin 1s linear infinite'
                    }}
                  >
                    progress_activity
                  </span>
                  <span>Signing In...</span>
                </>
              ) : (
                <>
                  <span>Sign In as {role.charAt(0).toUpperCase() + role.slice(1)}</span>
                  <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>
                    arrow_forward
                  </span>
                </>
              )}
            </button>
          </form>
        </div>

        {/* Footer info: security pledge */}
        <div
          style={{
            textAlign: 'center',
            marginTop: '1.5rem',
            fontSize: '0.8rem',
            color: 'var(--on-surface-variant)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.4rem'
          }}
        >
          <span className="material-symbols-outlined" style={{ fontSize: '16px', color: 'var(--secondary)' }}>
            verified_user
          </span>
          <span>Secured by GRAMUDYAM Trust Protocol • Maharashtra Rural Nodal Network</span>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;
