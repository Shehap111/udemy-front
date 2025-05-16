'use client'
import '../article.css'
import { useDispatch, useSelector } from 'react-redux'
import React, { useEffect } from 'react'
import { fetchArticles } from '../../../redux/slices/articlesSlice'
import Image from 'next/image'
import { FaCalendarAlt, FaUser } from "react-icons/fa";
import { useParams } from 'next/navigation'

const SingleBlogPage = () => {
  const dispatch = useDispatch()
  const { articles } = useSelector((state) => state.articles)
  const { slug } = useParams()
const language = useSelector((state)=> state.language.language)
  useEffect(() => {
    dispatch(fetchArticles())
  }, [dispatch])

  // البحث عن المقال الذي يتطابق مع الـ slug
  const article = articles?.find(article => article.slug?.[language] === slug)

  if (!article) {
    return (
      <div className="container" style={{ padding: '50px 0', textAlign: 'center' }}>
        <h2>Article not found</h2>
        <p>The article you are looking for does not exist.</p>
      </div>
    )
  }

  return (
    <section className='single-article'>
          <div className="single-article-intro">
          <h1>{article.title?.[language]}</h1>

          <div className="meta-info">
            <div className="author">
              <Image 
                src={article.authorImage} 
                alt={article.title?.[language]} 
                width={20} 
                height={20}
                priority
                style={{ width: '100%', height: 'auto' }}
              />
              <span>{article.authorName}</span>
            </div>
            <div className="date">
              <FaCalendarAlt />
              <span>
                {new Date(article.createdAt).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </span>
            </div>
          </div>          
          
          </div>      
      <div className="container">
<div className="row mt-5">
  
<div className="col-lg-2">
</div>
          
<div className="col-lg-8">
          <div className="article-header">


          {article.articleImage && (
            <div className="featured-image">
              <Image 
                src={article.articleImage} 
                alt={article.title?.[language]} 
                width={800} 
                height={450}
                priority
                style={{ width: '100%', height: 'auto' }}
              />
            </div>
          )}
        </div>
            
        <div className="article-content">
          <p>{article.description?.[language]}</p>
          <div dangerouslySetInnerHTML={{ __html: article.content?.[language] }} />
        </div>
        <div className="article-footer">
          {/* يمكنك إضافة أزرار مشاركة أو مقالات ذات صلة هنا */}
        </div>
</div>

<div className="col-lg-2">
  
            
</div>
          





</div>
</div>
</section>
  )
}

export default SingleBlogPage
