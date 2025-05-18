'use client'
import  {useDispatch, useSelector} from 'react-redux'
import './home.css'
import './home.css'
import '../blog/article.css'
import React, {useEffect} from 'react'
import {fetchArticles} from '../../redux/slices/articlesSlice'
import {fetchCategorys} from '../../redux/slices/categorySlice'
import Image from 'next/image'
import Image1 from '../../../public/img/down-mark-line.webp'; 
import { GoArrowRight } from "react-icons/go";
import { FaCalendarAlt } from "react-icons/fa";
import { useTranslation } from 'react-i18next';

import Link from 'next/link'

const S6_home = () => {
    const dispatch = useDispatch()
    const language = useSelector((state) => state.language.language);
    const {Categorys} = useSelector((state)=> state.categorys)
    const {articles} = useSelector((state)=> state.articles)
    const { t } = useTranslation();
    

useEffect(() => {
    dispatch(fetchCategorys())
    dispatch(fetchArticles())
}, [dispatch])
    
    
    
return (
<section className='S6_home S2_home article'>
<div className="container">
<div className="intro mb-5">
    <span> {t('home_section_6.news_updates')} </span>
    <h3> {t('home_section_6.latest_news')} </h3>
    <Image loading="lazy" src={Image1} width={400} height={300} alt="Description" />  
</div>

<div className="row">

{
    articles.slice(0, 3).map((article) => {
        return (
            <div className="col-lg-4 col-md-6" key={article._id}>
                <div className="box">
                    <div className="image">
                        <Image loading="lazy" width={100} height={200} src={article.articleImage} alt="Description" />  
                    </div>
                    <div className="content">
                        <div className='top_box'>
                            <div className="author">
                                <Image loading="lazy" width={50} height={50}  src={article.authorImage} alt={article.authorName} />
                                <h6> {article.authorName} </h6>
                            </div>
                            <div className="createdAt">
                                <h6>
                                    <FaCalendarAlt/>
                                {new Date(article.createdAt).toLocaleDateString('en-US', {
                                    month: 'long',  
                                    day: 'numeric', 
                                })}
                                </h6>
                            </div>
                        </div>
                        <Link className='border_style' href={`/`}> <h4 > {article.title[language]} </h4> </Link>
                        <p>{article.description[language].slice(0, 120)}...</p>
                        <div className="foot_box">
                            <Link className='mainLink' href={`/`}> <span> {t('home_section_6.read_more')}  </span> <GoArrowRight/> </Link>
                        </div>
                    </div>
                </div>                
            </div> 
                
            )    
    })                   

}                

</div>            
</div>            
</section>
  )
}

export default S6_home