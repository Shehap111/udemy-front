'use client';

import React, { useEffect } from 'react';
import Select from 'react-select';
import { useDispatch, useSelector } from 'react-redux';
import { setLanguage } from '../redux/slices/languageSlice';
import i18n from '../i18n/index';
import flagEn from '../../public/img/flags/us-flag.gif';
import flagAr from '../../public/img/flags/egypt.gif';
import flagDe from '../../public/img/flags/gm-flag.webp';
import flagEs from '../../public/img/flags/es.png';

const languageOptions = [
  { value: 'en', label: 'English', flag: flagEn },
  { value: 'ar', label: 'العربية', flag: flagAr },
  { value: 'de', label: 'Deutsch', flag: flagDe },
  { value: 'es', label: 'Español', flag: flagEs },
];

const LanguageSwitcher = () => {
  const dispatch = useDispatch();
  const currentLang = useSelector((state) => state.language.language);

  // عند تحميل الكمبوننت: ضبط اللغة والاتجاه بناءً على الـ Redux state أو localStorage
  useEffect(() => {
    // نحاول نقرأ اللغة من localStorage فقط في الـ client
    const savedLang = localStorage.getItem('language') || currentLang || 'en';

    dispatch(setLanguage(savedLang));
    i18n.changeLanguage(savedLang);
    document.documentElement.dir = savedLang === 'ar' ? 'rtl' : 'ltr';
  }, [dispatch]);

  const handleLanguageChange = (selectedOption) => {
    if (!selectedOption) return;

    dispatch(setLanguage(selectedOption.value));
    i18n.changeLanguage(selectedOption.value);
    document.documentElement.dir = selectedOption.value === 'ar' ? 'rtl' : 'ltr';

    localStorage.setItem('language', selectedOption.value);
    
    // لو عايز تعيد تحميل الصفحة (reload) ممكن تستخدم، لكن مش دايمًا مطلوب:
    // window.location.reload();
  };

  return (
    <Select
      options={languageOptions}
      value={languageOptions.find((option) => option.value === currentLang)}
      onChange={handleLanguageChange}
      isSearchable={false}
      className="language-selector phone"
      styles={{
        menu: (provided) => ({ ...provided, zIndex: 9999 }),
        control: (provided) => ({
          ...provided,
          cursor: 'pointer',
        }),
      }}
      getOptionLabel={(e) => (
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <img
            className="Flag"
            src={e.flag.src}
            alt={e.label}
            style={{ width: 50, height: 40, padding: 5 }}
          />
          {e.label}
        </div>
      )}
    />
  );
};

export default LanguageSwitcher;
