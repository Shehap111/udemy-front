import React from 'react'
import Link from 'next/link';
import Image from 'next/image';
import intro_shap_1 from '../../public/img/intro_shap_1.webp'
import intro_shap_2 from '../../public/img/intro_shap_2.webp'
const IntroSections = (props) => {
  return (
    <section className='intro_section'>
          <div className='intro'>
               <h1>{ props.sectionName }</h1>
<div className="shaps">
          <Image className='intro_shap1' src={intro_shap_1} loading='lazy' alt='intro_shap_1'/>
          <Image className='intro_shap2' src={intro_shap_2} loading='lazy' alt='intro_shap_2'/>
</div>
          <ul>
              <li > <Link href={'/'}> Home </Link> </li>
              <li>/</li>
              <li ><Link href={props.path}>  {props.Link} </Link>  </li>

          </ul>
         </div>
    </section>
  )
}

export default IntroSections