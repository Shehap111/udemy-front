'use client';

import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchSingleCourse } from '../../../redux/slices/singleCourseSlice';
import { useParams } from 'next/navigation';
import IntroSections from '../../../components/IntroSections';
import '../courses.css'
import Image from 'next/image';
import CourseLevelsAccordion from './CourseLevelsAccordion';
import {fetchCategorys} from '../../../redux/slices/categorySlice';
import {fetchLevels} from '../../../redux/slices/levelsSlice';
import { FaClock, FaFilePdf, FaLayerGroup, FaChalkboardTeacher, FaTags, FaLanguage, FaCertificate } from 'react-icons/fa'; // استيراد الأيقونات
import AddToCartButton from './AddToCartButton';
import {useTranslation} from 'react-i18next';

const SingleCoursePage = () => {
  const { id } = useParams(); 
  const dispatch = useDispatch();
const language = useSelector((state) => state.language.language); 

const { course, loading, error } = useSelector((state) => state.singleCourse);
const {Categorys} = useSelector((state) => state.categorys);
const {levels} = useSelector((state) => state.levels);

    const {t} = useTranslation();    
    
    useEffect(() => {
    if (id) {
    dispatch(fetchCategorys())  
    dispatch(fetchSingleCourse(id));
    dispatch(fetchLevels())          
    }
  }, [id, dispatch]);

    
    
    
    
// البحث عن جميع الـ levels المرتبطة بالكورس
const levelsForCourse = levels.filter((l) => l.CourseId === course._id);

// حساب عدد الدروس لجميع المستويات
const lessonsCountall = levelsForCourse.reduce(
    (acc, level) => acc + level.lessons.length, 
    0
);    
    

// حساب إجمالي الدقائق لجميع الدروس في الكورس
const totalDuration = levelsForCourse.reduce((acc, level) => {
  // جمع مدة كل درس داخل كل مستوى
  const levelDuration = level.lessons.reduce((lessonAcc, lesson) => {
    return lessonAcc + lesson.lessonDuration; // جمع مدة الدرس
  }, 0);
  
  return acc + levelDuration; // إضافة مدة هذا المستوى إلى المجموع الكلي
}, 0);
const hours = Math.floor(totalDuration / 60);
const minutes = totalDuration % 60;
// fotamter function to extract video ID from URL 
const extractYouTubeId = (url) => {
  const regExp = /(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/))([\w-]{11})/;
  const match = url.match(regExp);
  return match ? match[1] : null;
};

const extractVimeoId = (url) => {
  const regExp = /vimeo\.com\/(\d+)/;
  const match = url.match(regExp);
  return match ? match[1] : null;
};
    
    
const category = Categorys.find((cat) => cat._id === course.categoryId);
    
  if (loading) return <p>جاري تحميل الكورس...</p>;
  if (error) return <p>حصل خطأ: {error}</p>;

return (
    <>
        <IntroSections path="/course" Link="Course" sectionName={course?.title[language]} />
        <div className="single-course">
            <div className="contaisner">
                <div className="row">
                    <div className="col-lg-8 ">
                        <div className="course-header box">
                            {course?.image && (
                                <Image
                                    src={course.image}
                                    alt={course?.title[language] || 'course image'}
                                    width={300}
                                    height={200}
                                    className="course-image"
                                />
                            )}

                            <div className="course-info">
                                <p className="course-description">{course?.description[language]}</p>
                                <div className="course-meta">
                                    <span className="course-category btn_style">
                                        {category ? category.title[language] : 'Unknown'}
                                    </span>
                                </div>
                            </div>
                        <CourseLevelsAccordion levelsForCourse={levelsForCourse}  courseId={course?._id} />
                        </div>
                    </div>
                    <div className="col-lg-4 ">
                        <div className="box">
                        {course?.introVideo && (
                            <div className="intro-video mt-4">
                                <h3>{t('class_room.courseIntro')}</h3>
                                <div
                                    className="video-wrapper"
                                    style={{
                                        position: 'relative',
                                        paddingBottom: '56.25%',
                                        height: 0,
                                        overflow: 'hidden',
                                    }}
                                >
                                    {course.introVideo.includes('youtu.be') ||
                                    course.introVideo.includes('youtube.com') ? (
                                        <iframe
                                            src={`https://www.youtube.com/embed/${extractYouTubeId(course.introVideo)}`}
                                            title="Course Introduction"
                                            frameBorder="0"
                                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                            allowFullScreen
                                        ></iframe>
                                    ) : course.introVideo.includes('vimeo.com') ? (
                                        <iframe
                                            src={`https://player.vimeo.com/video/${extractVimeoId(course.introVideo)}`}
                                            title="Course Introduction"
                                            frameBorder="0"
                                            allow="autoplay; fullscreen; picture-in-picture"
                                            allowFullScreen
                                        ></iframe>
                                    ) : (
                                        <video src={course.introVideo} controls />
                                    )}
                                </div>
                            </div>
                        )}
                        <span className="course-price">
                            ${course?.price} <del>${course?.price + 38}</del>
                        </span>
                        <hr />
                        <div className="course-instructor">
                            <h4>{t('class_room.instructor')} </h4>
                            <div className="instructor-details">
                                {course?.instructor?.image && (
                                    <Image
                                        src={course.instructor.image}
                                        alt={course?.instructor?.name || 'instructor image'}
                                        width={100}
                                        height={100}
                                        className="instructor-image"
                                    />
                                )}
                                <div className="">
                                    <h5 className="instructor-name">{course?.instructor?.name}</h5>
                                    <p className="instructor-name">
                                        {t('class_room.instructorBio')}
                                    </p>                                    
                                </div>
                            </div>

                        </div>  
                        <div className="format">
                            <div className="pdfFiles">
                                <h6> <FaFilePdf  />  {t('class_room.resources')} </h6> <span>{course?.pdfFiles?.length} Pdf</span>
                            </div>  
                            <div className="pdfFiles">
                                <h6> <FaLayerGroup  />  {t('class_room.levels')}</h6> <span>{levelsForCourse?.length} Level</span>
                            </div>  
                            <div className="pdfFiles">
                                <h6> <FaChalkboardTeacher  />  {t('class_room.lessons')}</h6> <span>{lessonsCountall} lessons</span>
                            </div>                                 
                            <div className="pdfFiles">
                                <h6> <FaClock  />  {t('class_room.duration')} </h6> <span>{hours}h-{minutes}m  </span>
                            </div>      
                            <div className="pdfFiles">
                                <h6> <FaTags  />  {t('class_room.category')}</h6> <span> {category ? category.title[language] : 'Unknown'} </span>
                            </div>      
                            <div className="pdfFiles">
                                <h6> <FaLanguage  />  {t('class_room.language')}</h6> <span>  English  </span>
                            </div>      
                            <div className="pdfFiles">
                                <h6> <FaCertificate  />  {t('class_room.certificate')}</h6> <span> No </span>
                            </div>      

                        </div>                                                

                            <div className="btns">
                                <AddToCartButton course={course} />
                                <button className='btn_style'> {t("class_room.add_to_Wishlist")} </button>

                            </div>                        
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </>
);
};

export default SingleCoursePage;
