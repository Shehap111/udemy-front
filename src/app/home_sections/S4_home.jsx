'use client'
import './home.css'
import '../course/courses.css'
import React, { useEffect } from 'react'
import Image from 'next/image'
import Image1 from '../../../public/img/down-mark-line.webp'; 
import Link from 'next/link';
import { useDispatch, useSelector } from 'react-redux';
import { fetchCategorys } from '../../redux/slices/categorySlice';
import { fetchCourses } from '../../redux/slices/coursesSlice';
import { LuBookMarked } from "react-icons/lu";
import { FaArrowRightLong } from "react-icons/fa6";
import {fetchLevels} from '../../redux/slices/levelsSlice';
import { MdStarRate } from "react-icons/md";
import { useTranslation } from 'react-i18next';

const S4_home = () => {
    const dispatch = useDispatch();
const { t } = useTranslation(); 

    // جلب الكاتيجوريز والكورسات من الـ Redux
    const { Categorys } = useSelector((state) => state.categorys);
    const { data } = useSelector((state) => state.courses);
    const { levels } = useSelector((state) => state.levels);
  const currentLang = useSelector((state) => state.language.language);

    useEffect(() => {
        dispatch(fetchCategorys())
        dispatch(fetchLevels())
        dispatch(fetchCourses())
    }, [dispatch]);

    return (
        <section className='Products S2_home'>
            <div className="container">
                <div className="intro">
                    <span> {t('home_section_4.trending_courses')} </span>
                    <h3> {t('home_section_4.find_your_course')} </h3>
                    <Image loading="lazy" src={Image1} alt="Description" />  
                </div>
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
                                            <Image src={course.image} alt={course.title[currentLang]} width={400} height={300} loading="lazy"/>
                                        </div>
                                        <div className="content">
                                            <div className="top_box">
                                                <Link href={`/about/${course._id}`}>
                                                    <span>  {category ? category.title[currentLang] : 'Unknown'} </span> 
                                                </Link>
                                                <span> <LuBookMarked /> {lessonsCountall}  {t('home_section_4.lessons_count')} </span>
                                            </div>
                                            <br />
                                            <Link href={`/course/${course._id}`}> 
                                                <h4> {course.title[currentLang]} </h4> 
                                            </Link>
                                            <p> {course.description[currentLang]} </p> 
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
                                                <Link href={`/`}> {t('home_section_4.enroll_now')}  <FaArrowRightLong/> </Link>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            );
                        })
                    }
                </div>

            <Link className='btn_style' href={`/`}> {t('home_section_4.see_more')} </Link>
                

            </div>        
        </section>
    )
}

export default S4_home
