'use client'
import './article.css'
import {useDispatch, useSelector} from 'react-redux'
import IntroSections from '../../components/IntroSections'
import React,{useEffect, useState} from 'react'
import {fetchArticles} from '../../redux/slices/articlesSlice'
import {fetchCategorys} from '../../redux/slices/categorySlice'
import Image from 'next/image'
import Image1 from '../../../public/img/down-mark-line.webp'; 
import { GoArrowRight } from "react-icons/go";
import { FaCalendarAlt } from "react-icons/fa";
import Link from 'next/link'
const page = () => {
const dispatch = useDispatch()  
const {Categorys} = useSelector((state)=>state.categorys)  
const {articles}= useSelector((state) => state.articles)  
const [searchTerm, setSearchTerm] = useState('')
  const language = useSelector((state) => state.language.language);
  


useEffect(() => {
    dispatch(fetchCategorys())
    dispatch(fetchArticles())
}, [dispatch])
      
const filteredArticles = articles?.filter((article) => {
  const title = article.title?.[language]?.toLowerCase() || ''
  const description = article.description?.[language]?.toLowerCase() || ''
  return title.includes(searchTerm.toLowerCase()) || description.includes(searchTerm.toLowerCase())
})

  
  return (
    <>
<IntroSections sectionName="Blogs" path="/blog" Link="Blogs Page" />      
<section className='S6_home S2_home article'>
        <div className="container">
          
          <input
            type="text"
            placeholder="ابحث عن مقال..."
            className="search-input"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{
              padding: '10px',
              width: '100%',
              marginBottom: '20px',
              border: '1px solid #ccc',
              borderRadius: '8px',
            }}
          />          
<div className="row">
  
{
  filteredArticles.length > 0 ? (
    filteredArticles.map((article) => {
      return (
        <div className="col-lg-4 col-md-6" key={article._id}>
          <div className="box">
            <div className="image">
              <Image loading="lazy" width={100} height={200} src={article.articleImage} alt="Description" />  
            </div>
            <div className="content">
              <div className='top_box'>
                <div className="author">
                  <Image loading="lazy" width={50} height={50} src={article.authorImage} alt={article.authorName} />
                  <h6>{article.authorName}</h6>
                </div>
                <div className="createdAt">
                  <h6>
                    <FaCalendarAlt />
                    {new Date(article.createdAt).toLocaleDateString('en-US', {
                      month: 'long',
                      day: 'numeric',
                    })}
                  </h6>
                </div>
              </div>

              <Link className='border_style' href={`/`}>
                <h4>{article.title[language]}</h4>
              </Link>

              <p>{article.description[language]?.slice(0, 120)}...</p>

              <div className="foot_box">
<Link className='mainLink' href={`/blog/${article.slug[language]}`}>
  <span>Read More</span> <GoArrowRight />
</Link>
              </div>
            </div>
          </div>
        </div>
      )
    })
  ) : (
    <div className="col-12">
      <p style={{ textAlign: 'center', fontWeight: 'bold', marginTop: '20px' }}>
        {
          {
            en: "No matching results.",
            ar: "لا يوجد نتائج مطابقة.",
            es: "No hay resultados coincidentes.",
            de: "Keine passenden Ergebnisse."
          }[language]
        }
      </p>
    </div>
  )
}
            

</div>            
</div>            
</section> 
    
    
    </>
  )
}

export default page