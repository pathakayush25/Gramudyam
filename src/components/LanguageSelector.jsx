import React, { useState, useRef, useEffect } from 'react';
import { useLanguage } from '../hooks/useLanguage';

export const LanguageSelector = ({ compact = false, variant = 'dropdown', className = '' }) => {
  const { language, setLanguage, languages, t } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('touchstart', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
    };
  }, [isOpen]);

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) {
        setIsOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  // Render Inline Toggle (English | हिंदी | मराठी) if variant === 'inline'
  if (variant === 'inline') {
    return (
      <div
        className={`language-selector-inline ${className}`}
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '0.25rem',
          backgroundColor: 'var(--surface-container-high)',
          padding: '3px 4px',
          borderRadius: 'var(--radius-full)',
          border: '1px solid var(--border-subtle)'
        }}
        role="group"
        aria-label={t('navigation.selectLanguage', 'Select language')}
      >
        {languages.map((langOption, index) => {
          const isSelected = langOption.code === language;
          return (
            <React.Fragment key={langOption.code}>
              {index > 0 && <span style={{ color: 'var(--outline-variant)', fontSize: '0.75rem', userSelect: 'none' }}>|</span>}
              <button
                type="button"
                onClick={() => setLanguage(langOption.code)}
                aria-pressed={isSelected}
                aria-label={`Switch language to ${langOption.nativeName}`}
                style={{
                  padding: '0.25rem 0.65rem',
                  borderRadius: 'var(--radius-full)',
                  backgroundColor: isSelected ? 'var(--primary)' : 'transparent',
                  color: isSelected ? '#ffffff' : 'var(--on-surface)',
                  fontWeight: isSelected ? '700' : '500',
                  fontSize: '0.8rem',
                  border: 'none',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  whiteSpace: 'nowrap',
                  boxShadow: isSelected ? 'var(--shadow-sm)' : 'none'
                }}
              >
                {langOption.nativeName}
              </button>
            </React.Fragment>
          );
        })}
      </div>
    );
  }

  const currentLang = languages.find((l) => l.code === language) || languages[0];

  const handleSelect = (code) => {
    setLanguage(code);
    setIsOpen(false);
  };

  return (
    <div
      ref={dropdownRef}
      className={`language-selector-container ${className}`}
      style={{ position: 'relative', display: 'inline-block' }}
    >
      {/* Trigger Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
        aria-haspopup="listbox"
        aria-label={`Select language. Currently selected: ${currentLang.nativeName}`}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.4rem',
          padding: compact ? '0.35rem 0.65rem' : '0.4rem 0.75rem',
          backgroundColor: isOpen ? 'var(--surface-container-highest)' : 'var(--surface-container-high)',
          color: 'var(--primary)',
          border: '1px solid var(--border-subtle)',
          borderRadius: 'var(--radius-full)',
          fontSize: '0.8125rem',
          fontWeight: '600',
          cursor: 'pointer',
          transition: 'all 0.2s ease',
          boxShadow: isOpen ? 'var(--shadow-sm)' : 'none',
          whiteSpace: 'nowrap'
        }}
      >
        <span
          style={{
            fontSize: '1rem',
            lineHeight: 1,
            display: 'inline-flex',
            alignItems: 'center'
          }}
          aria-hidden="true"
        >
          🌐
        </span>
        <span style={{ fontFamily: 'inherit', fontWeight: '600' }}>
          {currentLang.nativeName}
        </span>
        <span
          className="material-symbols-outlined"
          style={{
            fontSize: '16px',
            transition: 'transform 0.2s ease',
            transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
            color: 'var(--outline)'
          }}
          aria-hidden="true"
        >
          expand_more
        </span>
      </button>

      {/* Accessible Dropdown Menu */}
      {isOpen && (
        <div
          role="listbox"
          aria-label="Available languages"
          style={{
            position: 'absolute',
            top: 'calc(100% + 6px)',
            right: 0,
            zIndex: 1000,
            minWidth: '170px',
            backgroundColor: 'var(--surface-container-lowest)',
            border: '1px solid var(--border-subtle)',
            borderRadius: 'var(--radius-lg)',
            boxShadow: 'var(--shadow-lg)',
            padding: '0.4rem',
            animation: 'fadeIn 0.15s ease-out',
            overflow: 'hidden'
          }}
        >
          {/* Header Label */}
          <div
            style={{
              padding: '0.4rem 0.65rem 0.35rem',
              fontSize: '0.7rem',
              fontWeight: '700',
              textTransform: 'uppercase',
              letterSpacing: '0.06em',
              color: 'var(--secondary)',
              borderBottom: '1px solid var(--border-subtle)',
              marginBottom: '0.25rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.35rem'
            }}
          >
            <span>🌐</span>
            <span>{t('navigation.selectLanguage', 'Language')}</span>
          </div>

          {/* Options */}
          {languages.map((langOption) => {
            const isSelected = langOption.code === language;
            return (
              <button
                key={langOption.code}
                role="option"
                aria-selected={isSelected}
                onClick={() => handleSelect(langOption.code)}
                style={{
                  width: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '0.5rem 0.65rem',
                  borderRadius: 'var(--radius-md)',
                  backgroundColor: isSelected ? 'var(--primary-container)' : 'transparent',
                  color: isSelected ? 'var(--on-primary)' : 'var(--on-surface)',
                  border: 'none',
                  textAlign: 'left',
                  cursor: 'pointer',
                  fontSize: '0.85rem',
                  fontWeight: isSelected ? '700' : '500',
                  transition: 'background-color 0.15s ease',
                  outline: 'none'
                }}
                onMouseEnter={(e) => {
                  if (!isSelected) {
                    e.currentTarget.style.backgroundColor = 'var(--surface-container-high)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isSelected) {
                    e.currentTarget.style.backgroundColor = 'transparent';
                  }
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <span style={{ fontSize: '1rem' }} aria-hidden="true">
                    {langOption.flag}
                  </span>
                  <span>{langOption.nativeName}</span>
                  {langOption.code !== 'en' && (
                    <span
                      style={{
                        fontSize: '0.7rem',
                        color: isSelected ? 'rgba(255,255,255,0.8)' : 'var(--outline)',
                        fontWeight: 'normal'
                      }}
                    >
                      ({langOption.label})
                    </span>
                  )}
                </div>

                {isSelected && (
                  <span
                    className="material-symbols-outlined"
                    style={{ fontSize: '18px', color: 'var(--on-primary)' }}
                    aria-hidden="true"
                  >
                    check
                  </span>
                )}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default LanguageSelector;
