'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useSelector, useDispatch } from 'react-redux';
import { fetchLevels } from '../../redux/slices/levelsSlice';
import { fetchQuizzes } from '../../redux/slices/quizzesSlice';
import { fetchCourses } from '../../redux/slices/coursesSlice';
import { Accordion, AccordionSummary, AccordionDetails, Typography ,Button} from '@mui/material';

import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import Link from 'next/link'; // استيراد Link من next
import Image from 'next/image'; 
import './ClassRoom.css'
import '../course/courses.css'

import IntroSections from '../../components/IntroSections';
import { FaClock, FaFilePdf, FaLayerGroup, FaChalkboardTeacher, FaTags, FaLanguage, FaCertificate } from 'react-icons/fa'; // استيراد الأيقونات
import {fetchCategorys} from '../../redux/slices/categorySlice';
import {useTranslation} from 'react-i18next';

const ClassRoom = () => {
  const { courseId } = useParams();
  const router = useRouter();
  const dispatch = useDispatch();
  const { user, loading } = useSelector((state) => state.auth);
  const { data } = useSelector((state) => state.courses);
  const { levels } = useSelector((state) => state.levels);
  const { quizzes } = useSelector((state) => state.quizzes);
  const { Categorys } = useSelector((state) => state.categorys);
  const [course, setCourse] = useState(null);
  const [expanded, setExpanded] = useState('panel0');
  const language = useSelector((state) => state.language.language); 
  const {t}= useTranslation(); 
  useEffect(() => {
    if (!user) return;

    const isEnrolled = user?.myCourses?.some(
      (item) => item.courseId === courseId
    );

    if (!isEnrolled) {
      router.push('/unauthorized');
    }
  }, [user, courseId, loading]);

  useEffect(() => {
    dispatch(fetchCourses());
    dispatch(fetchLevels());
    dispatch(fetchQuizzes());
    dispatch(fetchCategorys());
  }, []);

  useEffect(() => {
    const selected = data.find((c) => c._id === courseId);
    setCourse(selected);
  }, [data, courseId]);

  const courseLevels = levels.filter((lvl) => lvl.CourseId === courseId);
    
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

const category = Categorys.find((cat) => cat._id === course?.categoryId);
  
  
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
  
  
  const handleChange = (panel) => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : false);
  };  
  
  return (
<>
    <IntroSections path={`/class_room/${course?._id}`} Link={course?.title[language]} sectionName='Class Room'/>
<section className="ClassRoom Products">
<div className="container">
  <div className="row product_Container">

<div className="col-lg-8 col-md-6">
<div className="box">
<div className="box_top">
  <img
    src={course?.image}
    alt="course"
    className="mb-3"
    style={{ maxWidth: '300px' }}
  />
  <p>{course?.description[language]}</p>      
</div>    

    {courseLevels?.map((level,index) => (
    <Accordion           key={level?._id}
          expanded={expanded === `panel${index}`}
          onChange={handleChange(`panel${index}`)}
        >
      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
        {level?.levelTitle[language]}
      </AccordionSummary>
      <AccordionDetails>
        <h5>{t('class_room.lessons')}</h5>
        {level?.lessons?.map((lesson) => (
          <div key={lesson?._id} className="livil_box">
            <Typography>🎓 {lesson?.lessonTitle[language]}</Typography>
            <Link href={`/class_room/${courseId}/lesson//${lesson?._id}`} passHref>
              <Button size="small" variant="outlined">
                {t('class_room.viewLesson')}
              </Button>
            </Link>
          </div>
        ))}

        <h5 className="mt-3">{t('class_room.quizzes')}</h5>
        {quizzes
          .filter(
            (quiz) => quiz.levelId?._id?.toString() === level._id?.toString()
          )
          .map((quiz) => (
            <div key={quiz._id} className="mb-3">
              <Typography>📝 {quiz.title}</Typography>
              <Link href={`/class_room/${courseId}/quiz/${quiz._id}`} passHref>
                <Button
                  size="small"
                  variant="contained"
                  color="secondary"
                >
                  {t('class_room.startQuiz')}
                </Button>
              </Link>
            </div>
          ))}
      </AccordionDetails>
    </Accordion>
  ))}  
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
    <hr />
    <div className="course-instructor">
        <h4>{t('class_room.instructor')}</h4>
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
            <div className="instructor-detailss-text">
                <h5 className="instructor-name">{course?.instructor?.name}</h5>
                <p className="instructor-name">
                    {t('class_room.instructorBio')}
                </p>                                    
            </div>
        </div>

    </div>  
    <div className="format">
        <div className="pdfFiles">
            <h6> <FaFilePdf  />  {t('class_room.resources')}</h6> <span>{course?.pdfFiles?.length} {t('class_room.resources')}</span>
        </div>  
        <div className="pdfFiles">
            <h6> <FaLayerGroup  />  {t('class_room.levels')}</h6> <span>{levelsForCourse?.length} {t('class_room.levels')}</span>
        </div>  
        <div className="pdfFiles">
            <h6> <FaChalkboardTeacher  />  {t('class_room.lessons')}</h6> <span>{lessonsCountall} {t('class_room.lessons')}</span>
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

    </div>
</div>     

</div>
</div>
</section>
    
    
    </>
  );
};

export default ClassRoom;
