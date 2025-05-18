'use client'
import React from 'react'
import Link from 'next/link'
import './home.css'
import Button from '@mui/material/Button'
import Image from 'next/image';
import Image1 from '../../../public/img/banner-img-1.webp'; // لو الصورة محلية
import Image2 from '../../../public/img/badge.webp'; // لو الصورة محلية
import Image3 from '../../../public/img/badge-img.webp'; // لو الصورة محلية
import Image4 from '../../../public/img/star-group.webp'; // لو الصورة محلية
import Image5 from '../../../public/img/shape-1.webp'; // لو الصورة محلية
import Image6 from '../../../public/img/shape-4.webp'; // لو الصورة محلية
import WatchVideoPopup from './WatchVideoPopup';
import { useTranslation } from 'react-i18next';


const S1_home = () => {

    const { t } = useTranslation();

  return (
    <section className='S1_home'>
      <div className="container">
        <div className="row">
          <div className="col-lg-6  left_box_contaner">
            <span>{t('home_section_1.welcome')}</span>
            <h3>
              {t('home_section_1.headline_part1')}
              <span className="highlight-text">
                {t('home_section_1.headline_highlight')}
                <svg className="underline-svg" width="100%" height="13" viewBox="0 0 138 8" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path className="curved-path" d="M1 7 C28.2975 2.83975 94.8839 -1.83253 137 3.15976" stroke="#FFAF00" strokeWidth="2" />
                </svg>
              </span>
              {t('home_section_1.headline_part2')}
            </h3>
            <div className="shap_leftbox">
              <Image width={40} height={100} src={Image5} alt="Description" />
            </div>
            <p>{t('home_section_1.paragraph')}</p>
            <div className="foot">
              <Link className='btn_style' href="/about">
                {t('home_section_1.find_courses')}
              </Link>
              <WatchVideoPopup />
            </div>
          </div>

          <div className="col-lg-6  right_box_container">
            <Image className='main_image' width={700} height={700} priority src={Image1} alt="Description" />
            <div className="Image6">
              <Image width={250} height={250} priority src={Image6} alt="Description" />
            </div>
            <div className="rightbox">
              <div className="box">
                <div className="images">
                  <Image priority src={Image3} width={120} height={50}  alt="Description" />
                  <Image priority src={Image4} width={70} height={50}  alt="Description" />
                </div>
                <h5>{t('home_section_1.happy_students')}</h5>
              </div>
            </div>
            <div className="leftbox">
              <div className="box">
                <Image width={50} height={50} priority src={Image2} alt="Description" />
                <h5>{t('home_section_1.satisfied_learner')}</h5>
              </div>
            </div>

          </div>
        </div>
      </div>
    </section>


  )
}

export default S1_home
