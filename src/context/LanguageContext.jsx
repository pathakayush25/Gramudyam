import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import en from '../locales/en';
import hi from '../locales/hi';
import mr from '../locales/mr';

export const translations = {
  en,
  hi,
  mr
};

export const AVAILABLE_LANGUAGES = [
  { code: 'en', label: 'English', nativeName: 'English', flag: '🇬🇧' },
  { code: 'hi', label: 'Hindi', nativeName: 'हिंदी', flag: '🇮🇳' },
  { code: 'mr', label: 'Marathi', nativeName: 'मराठी', flag: '🇮🇳' }
];

export const LanguageContext = createContext(null);

// Utility function to traverse nested paths or search in namespace modules
const resolveTranslation = (dictionary, path) => {
  if (!dictionary || !path) return null;

  // 1. Direct key match (e.g. "home", "marketplace")
  if (dictionary[path] !== undefined && typeof dictionary[path] !== 'object') {
    return dictionary[path];
  }

  // 2. Case-insensitive direct key match (e.g. "Marketplace" -> "marketplace")
  const lowerPath = path.toLowerCase();
  if (dictionary[lowerPath] !== undefined && typeof dictionary[lowerPath] !== 'object') {
    return dictionary[lowerPath];
  }

  // 3. Nested dot-notation navigation (e.g. "auth.loginTitle", "common.getStarted")
  const segments = path.split('.');
  let current = dictionary;
  let foundNested = true;
  for (const seg of segments) {
    if (current && typeof current === 'object' && seg in current) {
      current = current[seg];
    } else {
      foundNested = false;
      break;
    }
  }
  if (foundNested && typeof current === 'string') {
    return current;
  }

  // 4. If single segment, check in common namespaces
  const commonNamespaces = [
    'navigation',
    'common',
    'auth',
    'getStarted',
    'landing',
    'marketplace',
    'customer',
    'verification',
    'entrepreneur',
    'aboutPage',
    'footer'
  ];

  for (const ns of commonNamespaces) {
    if (dictionary[ns] && typeof dictionary[ns] === 'object') {
      if (dictionary[ns][path] !== undefined && typeof dictionary[ns][path] === 'string') {
        return dictionary[ns][path];
      }
      if (dictionary[ns][lowerPath] !== undefined && typeof dictionary[ns][lowerPath] === 'string') {
        return dictionary[ns][lowerPath];
      }
    }
  }

  return null;
};

export const LanguageProvider = ({ children }) => {
  const [language, setLanguageState] = useState(() => {
    try {
      const saved = localStorage.getItem('gramudyam_language') || localStorage.getItem('gramudyam_lang');
      return (saved === 'en' || saved === 'hi' || saved === 'mr') ? saved : 'en';
    } catch {
      return 'en';
    }
  });

  const setLanguage = useCallback((newLang) => {
    if (newLang === 'en' || newLang === 'hi' || newLang === 'mr') {
      setLanguageState(newLang);
      try {
        localStorage.setItem('gramudyam_language', newLang);
        localStorage.setItem('gramudyam_lang', newLang);
      } catch (e) {
        console.warn('LocalStorage error:', e);
      }
    }
  }, []);

  const setLang = setLanguage;
  const lang = language;

  useEffect(() => {
    try {
      localStorage.setItem('gramudyam_language', language);
      localStorage.setItem('gramudyam_lang', language);
      document.documentElement.lang = language;
    } catch (e) {
      console.warn('LocalStorage error:', e);
    }
  }, [language]);

  /**
   * Universal translation function
   * @param {string} key - Translation key (e.g. "auth.welcomeBack" or "home")
   * @param {string|object} [fallbackOrParams] - Optional fallback text or parameters object
   * @param {object} [params] - Parameter object if fallback text was provided
   */
  const t = useCallback((key, fallbackOrParams, params) => {
    let fallback = key;
    let interpolationParams = null;

    if (typeof fallbackOrParams === 'string') {
      fallback = fallbackOrParams;
      if (params && typeof params === 'object') {
        interpolationParams = params;
      }
    } else if (typeof fallbackOrParams === 'object' && fallbackOrParams !== null) {
      interpolationParams = fallbackOrParams;
    }

    // 1. Try current selected language dictionary
    let result = resolveTranslation(translations[language], key);

    // 2. Fallback to English dictionary if translation is missing in current language
    if (!result && language !== 'en') {
      result = resolveTranslation(translations['en'], key);
    }

    // 3. Fallback to provided fallback string
    if (!result) {
      result = fallback;
    }

    // 4. Interpolate variables (e.g. {{name}} or {name})
    if (interpolationParams && typeof result === 'string') {
      Object.keys(interpolationParams).forEach((pKey) => {
        const val = interpolationParams[pKey];
        result = result.replace(new RegExp(`{{${pKey}}}|{${pKey}}`, 'g'), val !== undefined ? val : '');
      });
    }

    return result;
  }, [language]);

  /**
   * Helper to extract localized field from objects (e.g. product.name, product.nameMr, product.nameHi)
   */
  const getLocalizedField = useCallback((entity, fieldName) => {
    if (!entity) return '';
    if (language === 'mr') {
      const mrKey = fieldName + 'Mr';
      if (entity[mrKey]) return entity[mrKey];
    } else if (language === 'hi') {
      const hiKey = fieldName + 'Hi';
      if (entity[hiKey]) return entity[hiKey];
    }
    return entity[fieldName] || '';
  }, [language]);

  const currentLanguage = AVAILABLE_LANGUAGES.find((l) => l.code === language) || AVAILABLE_LANGUAGES[0];

  return (
    <LanguageContext.Provider
      value={{
        language,
        setLanguage,
        lang,
        setLang,
        t,
        getLocalizedField,
        languages: AVAILABLE_LANGUAGES,
        currentLanguage
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

export default LanguageContext;
