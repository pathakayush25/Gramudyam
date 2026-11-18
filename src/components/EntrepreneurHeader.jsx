import React from 'react';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { LanguageSelector } from './LanguageSelector';

export const EntrepreneurHeader = ({ onToggleMobile }) => {
  const { lang, t } = useLanguage();
  const { user } = useAuth();
  const navigate = useNavigate();

  return (
    <header
      style={{
        height: '5rem',
        backgroundColor: 'rgba(255, 249, 235, 0.88)',
        backdropFilter: 'blur(12px)',
        borderBottom: '1px solid var(--border-subtle)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 1.5rem',
        position: 'sticky',
        top: 0,
        zIndex: 30
      }}
    >
      {/* Left: Mobile Toggle & Cluster Location Pill */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
        <button
          onClick={onToggleMobile}
          style={{
            display: 'inline-flex',
            padding: '6px',
            borderRadius: 'var(--radius-md)',
            backgroundColor: 'var(--surface-container)'
          }}
          className="lg-hidden"
          aria-label="Open Sidebar"
        >
          <span className="material-symbols-outlined">menu</span>
        </button>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem' }}>
          <span className="material-symbols-outlined" style={{ color: 'var(--primary)', fontSize: '20px' }}>
            nature_people
          </span>
          <span style={{ fontFamily: 'var(--font-serif)', fontWeight: '600', color: 'var(--primary)' }}>
            Dahanu Village Cluster
          </span>
          <span style={{ color: 'var(--outline-variant)' }}>•</span>
          <span style={{ color: 'var(--on-surface-variant)' }}>Palghar District</span>
        </div>
      </div>

      {/* Right: Language, Voice Assistance Button, Notifications, Avatar */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
        {/* Vernacular Language Switcher */}
        <LanguageSelector compact={true} />

        {/* Voice Assistant Shortcut Button */}
        <button
          onClick={() => navigate('/entrepreneur/voice-create', { state: { isNew: true } })}
          className="btn-secondary btn-sm"
          style={{ padding: '0.45rem 0.85rem', display: 'flex', alignItems: 'center', gap: '4px' }}
          title={t('entrepreneur.voiceStudioBtn', 'Voice Product Creation')}
        >
          <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>mic</span>
          <span className="hide-on-small">{t('entrepreneur.voiceStudioBtn', 'Voice Studio')}</span>
        </button>

        {/* Notification Bell */}
        <div style={{ position: 'relative' }}>
          <button
            style={{
              padding: '0.5rem',
              borderRadius: '50%',
              backgroundColor: 'var(--surface-container)',
              color: 'var(--on-surface-variant)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
            title="3 new order updates"
          >
            <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>notifications</span>
            <span
              style={{
                position: 'absolute',
                top: '2px',
                right: '2px',
                width: '16px',
                height: '16px',
                backgroundColor: 'var(--error)',
                color: 'white',
                fontSize: '10px',
                fontWeight: '700',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              3
            </span>
          </button>
        </div>

        {/* Profile Avatar */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <img
            src={user?.avatar || "https://lh3.googleusercontent.com/aida/AEtjO1XRwNEh1sIoYoap7omZBOmDfpIcCfCyz0UIisvmJmW7V2kngPo7lGUxUe2kjXBDL-92wbXTjdsvwnGhAlIOk5p5WYIcI4B37OzvyHr0iW-pFAL50WN61iJTGgVIi2l2840gkhYTMNyhgpQwg5_iNh2UrLvE_-gk1ZElQ5nnQynNfdWuhk9SELGVtqBFRiAmsn6UNl21T1XEQZT0s_Fs92VuBU9DSGm7TvTZMkNmoYCpi8oX3QptAWzEb2uK"}
            alt="Artisan"
            style={{ width: '34px', height: '34px', borderRadius: '50%', objectFit: 'cover', border: '2px solid var(--secondary)' }}
          />
        </div>
      </div>

      <style>{`
        @media (min-width: 1025px) {
          .lg-hidden { display: none !important; }
        }
        @media (max-width: 640px) {
          .hide-on-small { display: none !important; }
        }
      `}</style>
    </header>
  );
};
