import React from 'react'
import './home.css'
import Image from 'next/image'
import img1 from '../../../public/img/laptop.png'
import img2 from '../../../public/img/professional-success.png'
import img3 from '../../../public/img/success.png'
import img4 from '../../../public/img/about-thumb-01.webp'
import img5 from '../../../public/img/about-thumb-small-01.webp'
import shape1 from '../../../public/img/about-book-shape.webp'; 
import shape2 from '../../../public/img/about-wave-shape.webp'; 
import shape3 from '../../../public/img/dot-shape-01.webp'; 
import shape4 from '../../../public/img/about-circle.webp'; 
import Link from 'next/link'
import { useTranslation } from 'react-i18next';

const S3_home = () => {
const { t } = useTranslation(); 
return (
<section className='S3_home'>
<div className="container">
        <div className="shaps">
                <li className='shapeimg shape1'> <Image loading="lazy" src={shape1} alt='Flexible Classes'/> </li>    
                <li className='shapeimg shape2'> <Image loading="lazy" src={shape2} alt='Flexible Classes'/> </li>    
                <li className='shapeimg shape3'> <Image loading="lazy" src={shape3} alt='Flexible Classes'/> </li>    
                <li className='shapeimg shape4'> <Image loading="lazy" src={shape4} alt='Flexible Classes'/> </li>    
        </div>

<div className="row">
    <div className="col-lg-6 left_box_container">
        <div className="box">
            <div className="big_img">
                <Image loading="lazy" src={img4} alt='Flexible Classes'/>    
            </div>         
            <div className="small_img">
                <Image loading="lazy" src={img5} alt='Flexible Classes'/>    
            </div>
        </div>
    </div>    

    <div className="col-lg-6 right_box_container">
        <div className="box">
            <span>{t('home_section_3.about_title')}</span>
            <h3> {t('home_section_3.main_heading')} </h3>
            <p> {t('home_section_3.main_paragraph')}</p>
            <ul>
                <li className='img_cont'> <Image loading="lazy" src={img1} alt='Flexible Classes'/> </li>    
                <li>
                    <h5>{t('home_section_3.features.flexible_classes.title')}</h5>
                    <p> {t('home_section_3.features.flexible_classes.description')} </p>
                </li>    
            </ul>
            <ul>
                <li className='img_cont'> <Image loading="lazy" src={img2} alt='Flexible Classes'/> </li>    
                <li>
                    <h5>{t('home_section_3.features.Expert_Trainers.title')}</h5>
                    <p> {t('home_section_3.features.Expert_Trainers.description')} </p>                </li>    
            </ul>
            <ul>
                <li className='img_cont'> <Image loading="lazy"  src={img3} alt='Flexible Classes'/> </li>    
                <li>
                    <h5>{t('home_section_3.features.Build_Your_Career.title')}</h5>
                    <p> {t('home_section_3.features.Build_Your_Career.description')} </p>                </li>    
            </ul>       
            <Link className='btn_style' href="/about"> {t('home_section_3.read_more')}  </Link>            
    </div>
    </div>                

</div>        
</div>        
</section>
  )
}

export default S3_home