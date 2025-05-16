'use client';

import React, {useEffect} from 'react';
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

  const handleLanguageChange = (selectedOption) => {
    if (!selectedOption) return;
    dispatch(setLanguage(selectedOption.value));
      i18n.changeLanguage(selectedOption.value);
       window.location.reload();
    };
    
  useEffect(() => {
    // ضبط اتجاه الصفحة عند التحميل
    const dir = currentLang === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.dir = dir;
    i18n.changeLanguage(currentLang);
  }, [currentLang]);    

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
