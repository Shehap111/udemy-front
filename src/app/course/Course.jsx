'use client'
import React, {useEffect} from 'react'
import {useDispatch, useSelector} from 'react-redux';
import {fetchCategorys} from '../../redux/slices/categorySlice';
import {fetchLevels} from '../../redux/slices/levelsSlice';
import {fetchCourses} from '../../redux/slices/coursesSlice';
import './courses.css'
import Image from 'next/image';
import {LuBookMarked} from 'react-icons/lu'
import {MdStarRate} from 'react-icons/md'
import {FaArrowRightLong} from 'react-icons/fa6'
import Link from 'next/link';
import IntroSections from '../../components/IntroSections';
import {useTranslation} from 'react-i18next';
const Course = () => {
const dispatch = useDispatch();
    const language = useSelector((state) => state.language.language);
    
    const {data} = useSelector((state) => state.courses);
    const {Categorys} = useSelector((state) => state.categorys);
    const {levels} = useSelector((state) => state.levels);
    const {t} = useTranslation();


useEffect(() => {
    dispatch(fetchCategorys())
    dispatch(fetchLevels())
    dispatch(fetchCourses())
}, [])



  return (
<>
<IntroSections   path='/course' Link='Course'   sectionName='Courses' />
<section className='Products S2_home'>
    <div className="container">

        <div className="row product_Container">
            {
                data.map((course) => {
                    const category = Categorys.find((cat) => cat._id === course.categoryId);
                    // البحث عن جميع الـ levels المرتبطة بالكورس
                    const levelsForCourse = levels.filter(
                        (l) => l.CourseId === course._id
                    );

                    // حساب عدد الدروس لجميع المستويات
                    const lessonsCountall = levelsForCourse.reduce(
                        (acc, level) => acc + level.lessons.length, 
                        0
                    );
                    
                    return (
                        <div className="col-lg-4 col-md-6" key={course._id}>
                            <div className="box">
                                <div className="discount"> 20% </div>
                                <div className="image">
                                    <Image src={course.image} alt={course.title[language]} width={400} height={300} loading="lazy"/>
                                </div>
                                <div className="content">
                                    <div className="top_box">
                                        <Link href={`/course/${course._id}`}>
                                            <span>  {category ? category.title[language]: 'Unknown'} </span> 
                                        </Link>
                                        <span> <LuBookMarked /> {lessonsCountall}  {t('home_section_4.lessons_count')} </span>
                                    </div>
                                    <br />
                                    <Link href={`/course/${course._id}`}> 
                                        <h4> {course.title[language]} </h4> 
                                    </Link>
                                    <p> {course.description[language]} </p> 
                                    <ul className='Pricr_rait'>
                                        <li> ${course.price}  </li>
                                        <li> <MdStarRate />
                                        <MdStarRate /><MdStarRate /><MdStarRate /><MdStarRate />
                                        </li>
                                    </ul>
                                    <hr />
                                    <div className="fott_box">
                                        <div className="instructor">
                                            <Image src={course.instructor.image} alt={course.instructor.name} width={400} height={300} loading="lazy"/>
                                            <h5> {course.instructor.name} </h5> 
                                        </div>
                                        <Link href={`/course/${course._id}`}> {t('home_section_4.enroll_now')}  <FaArrowRightLong/> </Link>
                                    </div>
                                </div>
                            </div>
                        </div>
                    );
                })
            }
        </div>

        

    </div>        
</section>      
      
      
      
      
</>
  )
}

export default Course