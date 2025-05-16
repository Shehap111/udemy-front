'use client';

import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import en from './locales/en.json';
import ar from './locales/ar.json';
import de from './locales/de.json';
import es from './locales/es.json';
import { getOptions } from './config';

// نحدد اللغة قبل التهيئة
const initialLang = localStorage.getItem('language') || 'en';

// تحديد الاتجاه بناءً على اللغة
document.documentElement.dir = initialLang === 'ar' ? 'rtl' : 'ltr';

if (!i18n.isInitialized) {
  i18n
    .use(initReactI18next)
    .init({
      ...getOptions(initialLang),
      resources: {
        en: { translation: en },
        ar: { translation: ar },
        de: { translation: de },
        es: { translation: es },
      },
      lng: initialLang,  // تعيين اللغة الافتراضية
      fallbackLng: 'en',  // اللغة الاحتياطية
    });
}



console.log('Initial language:', i18n.language);

export default i18n;
