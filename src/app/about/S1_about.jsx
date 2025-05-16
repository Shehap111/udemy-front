import React from 'react'
import S1about_img from "../../../public/img/S1about_img.jpg"
import Image from 'next/image'
import {useTranslation} from 'react-i18next';

const S1_about = () => {

  const {t} = useTranslation();  
  return (
<section className='S1_about'>
    <div className='container'>
        <div className='row'>
            <div className='col-lg-6 card1'>
                <span className='line'></span>
                <h3> {t('about_section_1.who_we_are.title')} </h3>    
                <p> {t('about_section_1.who_we_are.description')}  </p>

            </div>

            <div className='col-lg-6'>

            <Image className='S1about_img' src={S1about_img} loading='lazy' alt='S1about img'/>
            </div>


        </div>
    </div>          
</section>
  )
}

export default S1_about