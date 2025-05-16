'use client';
import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { useSelector, useDispatch } from 'react-redux';
import { fetchLevels } from '../../../../../redux/slices/levelsSlice';
import '../../../ClassRoom.css'
import IntroSections from '../../../../../components/IntroSections';
import {useTranslation} from 'react-i18next';
const LessonPage = () => {
  const { courseId, lessonId } = useParams();
  const dispatch = useDispatch();

  const { levels } = useSelector((state) => state.levels);
  const [lesson, setLesson] = useState(null);
  const [levelLessons, setLevelLessons] = useState([]);
  const language = useSelector((state) => state.language.language); 
  const {t} =useTranslation()
  useEffect(() => {
    dispatch(fetchLevels());
  }, [dispatch]);

  useEffect(() => {
    const courseLevels = levels.filter((lvl) => lvl.CourseId === courseId);
    const currentLevel = courseLevels.find((lvl) =>
      lvl.lessons?.some((lsn) => lsn._id === lessonId)
    );

    if (currentLevel) {
      // إذا وجدنا الـ level الخاص بالدرس
      setLevelLessons(currentLevel.lessons || []); // تحديث الدروس الخاصة بالـ level
      const foundLesson = currentLevel.lessons?.find((lsn) => lsn._id === lessonId);
      setLesson(foundLesson); // تحديد الدرس الحالي
    }
  }, [levels, courseId, lessonId]);

  return (
<>
<IntroSections sectionName={lesson?.lessonTitle[language]} path={`/class_room/${courseId}`} Link={'Class Room'}/>

<div className="lesson-page-container mt-4">
<div className="container">
      <div className="lesson-page-row row">
        {/* Sidebar */}
        <div className="lesson-sidebar col-lg-4 mb-3">
          <div className="lesson-list list-group">
            <h5 className="lesson-list-title mb-3">{t('class_room.lessons_Page.Lessons_in_this_Level')}</h5>
            {levelLessons.map((lsn) => (
              <a
                key={lsn._id}
                href={`/class_room/${courseId}/lesson/${lsn._id}`}
                className={`lesson-list-item list-group-item list-group-item-action ${
                  lsn._id === lessonId ? 'active' : ''
                }`}
              >
                🎓 {lsn.lessonTitle[language]}
              </a>
            ))}
          </div>
        </div>

        {/* Main content */}
        <div className="lesson-content col-lg-8">
          {lesson ? (
            <div className="lesson-details">
        <iframe
          width="100%"
          height="400"
          src={lesson.videoUrl}
          title={lesson.lessonTitle[language]}
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          className="rounded shadow-sm mb-4"
        />
        
              <h3 className="lesson-title mb-3">{lesson.lessonTitle[language]}</h3>
            </div>
          ) : (
            <p className="lesson-loading">Loading lesson...</p>
          )}
        </div>
      </div>  
</div>
</div>    
    
    
</>
  );
};

export default LessonPage;
