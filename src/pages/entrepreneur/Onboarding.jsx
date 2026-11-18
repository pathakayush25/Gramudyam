import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import confetti from 'canvas-confetti';

export const Onboarding = () => {
  const { user, updateProfile } = useAuth();
  const { lang, t } = useLanguage();
  const navigate = useNavigate();

  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    // Step 1: Personal
    name: user?.name || 'Savita Patil',
    phone: user?.phone || '+91 98765 43210',
    village: 'Ganjad',
    taluka: 'Dahanu',
    district: 'Palghar',
    experienceYears: '18',

    // Step 2: SHG
    shgName: 'स्वावलंबी महिला बचत गट (Adivasi Mahila Warli Kala Bachat Gat)',
    shgRegNumber: 'MH-PLG-SHG-2018-842',
    memberCount: '28',
    roleInSHG: 'Group Leader / Master Artisan',

    // Step 3: Craft
    craftCategory: 'Handicrafts & Tribal Art',
    craftName: 'Authentic Warli Tribal Painting',
    rawMaterials: 'Natural terracotta geru, cow-dung wash, and rice flour paste',
    hasGiTag: true,

    // Step 4: Bank
    bankName: 'State Bank of India (Dahanu Rural Branch)',
    accountNumber: '•••••••• 4892',
    ifscCode: 'SBIN0001428',
    upiId: 'savita.patil@sbi'
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({ ...formData, [name]: type === 'checkbox' ? checked : value });
  };

  const handleNext = () => {
    if (currentStep < 4) {
      setCurrentStep(currentStep + 1);
    } else {
      // Complete Onboarding
      updateProfile({
        name: formData.name,
        phone: formData.phone,
        cluster: `${formData.village}, ${formData.district}`,
        shgName: formData.shgName,
        onboardingComplete: true
      });
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      });
      navigate('/entrepreneur/dashboard');
    }
  };

  const handlePrev = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      {/* Header */}
      <div>
        <div className="badge-pill badge-primary" style={{ marginBottom: '0.5rem' }}>
          {t('auth.registerTitle', 'Artisan Onboarding')} • Step {currentStep} of 4
        </div>
        <h1 className="headline-lg" style={{ color: 'var(--primary)' }}>
          {t('auth.registerTitle', 'Artisan Onboarding & Verification')}
        </h1>
        <p style={{ fontSize: '0.875rem', color: 'var(--on-surface-variant)' }}>
          {t('auth.registerSubtitle', 'Register your village self-help group or craft studio to unlock voice AI product listing and verified QR TrustTag packaging.')}
        </p>
      </div>

      {/* Progress Stepper Bar */}
      <div className="card-base" style={{ padding: '1rem 1.5rem', backgroundColor: 'var(--surface-container-lowest)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', position: 'relative' }}>
          {[
            { step: 1, label: lang === 'mr' ? 'वैयक्तिक माहिती' : lang === 'hi' ? 'व्यक्तिगत जानकारी' : 'Personal & Village' },
            { step: 2, label: lang === 'mr' ? 'बचत गट तपशील' : lang === 'hi' ? 'बचत समूह विवरण' : 'SHG / Bachat Gat' },
            { step: 3, label: lang === 'mr' ? 'हस्तकला प्रकार' : lang === 'hi' ? 'हस्तशिल्प प्रकार' : 'Craft & Heritage' },
            { step: 4, label: lang === 'mr' ? 'बँक खाते' : lang === 'hi' ? 'बैंक खाता' : 'E-Khata & Bank' }
          ].map((item) => (
            <div
              key={item.step}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '4px',
                textAlign: 'center',
                flex: 1
              }}
            >
              <div
                style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '50%',
                  backgroundColor: currentStep >= item.step ? 'var(--primary)' : 'var(--surface-container-high)',
                  color: currentStep >= item.step ? 'white' : 'var(--outline)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: '700',
                  fontSize: '0.85rem'
                }}
              >
                {currentStep > item.step ? (
                  <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>check</span>
                ) : (
                  item.step
                )}
              </div>
              <span style={{ fontSize: '0.75rem', fontWeight: currentStep === item.step ? '700' : '500', color: currentStep === item.step ? 'var(--primary)' : 'var(--outline)' }}>
                {item.label}
              </span>
            </div>
          ))}
        </div>

        {/* Progress Bar Line */}
        <div style={{ width: '100%', height: '4px', backgroundColor: 'var(--surface-container-high)', borderRadius: '2px', marginTop: '1rem', overflow: 'hidden' }}>
          <div
            style={{
              width: `${(currentStep / 4) * 100}%`,
              height: '100%',
              backgroundColor: 'var(--secondary)',
              transition: 'width 0.3s ease'
            }}
          />
        </div>
      </div>

      {/* Wizard Step Form Cards */}
      <div className="card-base" style={{ padding: '2rem', backgroundColor: 'var(--surface-container-lowest)' }}>
        {currentStep === 1 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.25rem', color: 'var(--primary)' }}>
              Step 1: Personal & Artisan Identification (वैयक्तिक माहिती)
            </h3>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem' }}>
              <div>
                <label className="label-field">Full Name (संपूर्ण नाव) *</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="input-base"
                  required
                />
              </div>
              <div>
                <label className="label-field">WhatsApp Mobile Number *</label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="input-base"
                  required
                />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem' }}>
              <div>
                <label className="label-field">Village / Hamlet (गाव) *</label>
                <input
                  type="text"
                  name="village"
                  value={formData.village}
                  onChange={handleChange}
                  className="input-base"
                  required
                />
              </div>
              <div>
                <label className="label-field">Taluka (तालुका) *</label>
                <input
                  type="text"
                  name="taluka"
                  value={formData.taluka}
                  onChange={handleChange}
                  className="input-base"
                  required
                />
              </div>
              <div>
                <label className="label-field">District (जिल्हा) *</label>
                <input
                  type="text"
                  name="district"
                  value={formData.district}
                  onChange={handleChange}
                  className="input-base"
                  required
                />
              </div>
            </div>

            <div>
              <label className="label-field">Years Practicing Traditional Craft</label>
              <input
                type="number"
                name="experienceYears"
                value={formData.experienceYears}
                onChange={handleChange}
                className="input-base"
              />
            </div>
          </div>
        )}

        {currentStep === 2 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.25rem', color: 'var(--primary)' }}>
              Step 2: Self-Help Group (SHG) / Bachat Gat (बचत गट तपशील)
            </h3>

            <div>
              <label className="label-field">Bachat Gat / Cooperative Name *</label>
              <input
                type="text"
                name="shgName"
                value={formData.shgName}
                onChange={handleChange}
                className="input-base"
                required
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem' }}>
              <div>
                <label className="label-field">Registration / MSRLM UMED Code</label>
                <input
                  type="text"
                  name="shgRegNumber"
                  value={formData.shgRegNumber}
                  onChange={handleChange}
                  className="input-base"
                />
              </div>
              <div>
                <label className="label-field">Total Women Members in Group</label>
                <input
                  type="number"
                  name="memberCount"
                  value={formData.memberCount}
                  onChange={handleChange}
                  className="input-base"
                />
              </div>
            </div>

            <div>
              <label className="label-field">Your Role in the Collective</label>
              <input
                type="text"
                name="roleInSHG"
                value={formData.roleInSHG}
                onChange={handleChange}
                className="input-base"
              />
            </div>
          </div>
        )}

        {currentStep === 3 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.25rem', color: 'var(--primary)' }}>
              Step 3: Craft Specialty & Heritage Story (हस्तकला प्रकार)
            </h3>

            <div>
              <label className="label-field">Primary Craft Category *</label>
              <select
                name="craftCategory"
                value={formData.craftCategory}
                onChange={handleChange}
                className="select-base"
              >
                <option value="Handicrafts & Tribal Art">Handicrafts & Tribal Art (वारली व आदिवासी कला)</option>
                <option value="Textiles & Paithani">Textiles & Paithani (पैठणी व विणकाम)</option>
                <option value="Terracotta & Clay Pottery">Terracotta & Clay Pottery (मातीची भांडी)</option>
                <option value="Forest & Organic Food">Forest & Organic Food (रानमेवा व सेंद्रिय मध)</option>
                <option value="Bamboo & Cane Craft">Bamboo & Cane Craft (बांबू हस्तकला)</option>
                <option value="Leather & Footwear">Leather & Footwear (कोल्हापुरी चामडे)</option>
              </select>
            </div>

            <div>
              <label className="label-field">Specific Artifact Name</label>
              <input
                type="text"
                name="craftName"
                value={formData.craftName}
                onChange={handleChange}
                className="input-base"
              />
            </div>

            <div>
              <label className="label-field">Locally Sourced Raw Materials</label>
              <textarea
                name="rawMaterials"
                rows="3"
                value={formData.rawMaterials}
                onChange={handleChange}
                className="input-base"
                style={{ resize: 'vertical' }}
              />
            </div>

            <label style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', cursor: 'pointer', fontSize: '0.875rem' }}>
              <input
                type="checkbox"
                name="hasGiTag"
                checked={formData.hasGiTag}
                onChange={handleChange}
                style={{ accentColor: 'var(--primary)', width: '18px', height: '18px' }}
              />
              <span>This craft has registered Geographical Indication (GI) status in Maharashtra</span>
            </label>
          </div>
        )}

        {currentStep === 4 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.25rem', color: 'var(--primary)' }}>
              Step 4: E-Khata & Direct Bank Remittance (बँक खाते)
            </h3>

            <div style={{ backgroundColor: 'var(--surface-container-low)', padding: '1rem', borderRadius: 'var(--radius-md)', borderLeft: '4px solid var(--success)', fontSize: '0.85rem' }}>
              <strong>Zero Leakage Guarantee:</strong> Consumer payments are deposited directly into this Aadhaar-linked SHG account via NPCI UPI gateway.
            </div>

            <div>
              <label className="label-field">Bank Name & Branch *</label>
              <input
                type="text"
                name="bankName"
                value={formData.bankName}
                onChange={handleChange}
                className="input-base"
                required
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem' }}>
              <div>
                <label className="label-field">Account Number (खाते क्रमांक) *</label>
                <input
                  type="text"
                  name="accountNumber"
                  value={formData.accountNumber}
                  onChange={handleChange}
                  className="input-base"
                  required
                />
              </div>
              <div>
                <label className="label-field">IFSC Code *</label>
                <input
                  type="text"
                  name="ifscCode"
                  value={formData.ifscCode}
                  onChange={handleChange}
                  className="input-base"
                  required
                />
              </div>
            </div>

            <div>
              <label className="label-field">Direct UPI ID (for instant settlement)</label>
              <input
                type="text"
                name="upiId"
                value={formData.upiId}
                onChange={handleChange}
                className="input-base"
              />
            </div>
          </div>
        )}

        {/* Wizard Navigation Buttons */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '2rem', borderTop: '1px solid var(--border-subtle)', paddingTop: '1.5rem' }}>
          {currentStep > 1 ? (
            <button
              type="button"
              onClick={handlePrev}
              className="btn-cream"
              style={{ gap: '0.4rem' }}
            >
              <span className="material-symbols-outlined">arrow_back</span>
              <span>Previous (मागे)</span>
            </button>
          ) : (
            <div />
          )}

          <button
            type="button"
            onClick={handleNext}
            className="btn-primary"
            style={{ gap: '0.4rem' }}
          >
            <span>{currentStep === 4 ? 'Complete Onboarding & Enter Dashboard' : 'Next Step (पुढे)'}</span>
            <span className="material-symbols-outlined">arrow_forward</span>
          </button>
        </div>
      </div>
    </div>
  );
};
