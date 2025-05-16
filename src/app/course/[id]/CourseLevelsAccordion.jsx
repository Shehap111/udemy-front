'use client';

import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchLevelsByCourseId } from '../../../redux/slices/singleCourseSlice';
import { Accordion, AccordionSummary, AccordionDetails, Typography } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { FaVideo } from 'react-icons/fa';

const CourseLevelsAccordion = ({ courseId  }) => {
  const dispatch = useDispatch();
  const { levels, loading, error } = useSelector((state) => state.singleCourse);
  const [expanded, setExpanded] = useState('panel0');
  const language = useSelector((state) => state.language.language); 

  useEffect(() => {
    if (courseId) {
      dispatch(fetchLevelsByCourseId(courseId));
    }
  }, [courseId, dispatch]);

  if (loading) return <p>جاري تحميل الليفلات...</p>;
  if (error) return <p>حصل خطأ: {error}</p>;

  const handleChange = (panel) => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : false);
  };

  return (
    <div className='ocordion'>
      {levels.map((level, index) => (
        <Accordion
          key={level._id}
          expanded={expanded === `panel${index}`}
          onChange={handleChange(`panel${index}`)}
        >
          {/* مشكله  */}
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls={`panel${index}a-content`}
            id={`panel${index}a-header`}
          >
    <Typography className='title'>
      {index + 1}. {level.levelTitle[language]}
    </Typography>          </AccordionSummary>
          <AccordionDetails>
            {level.lessons && level.lessons.length > 0 ? (
              <ul>
                {level.lessons.map((lesson) => (
                  <li className='lesson_line' key={lesson._id}>
                     <h5> <FaVideo/>  {lesson.lessonTitle[language]} </h5>
                    <span> {lesson.lessonDuration  || 'غير محدد'}:00</span>  {/* عرض الوقت هنا */}
                  </li>
                ))}
              </ul>
            ) : (
              <p> No Lessons Fuond </p>
            )}
          </AccordionDetails>
        </Accordion>
      ))}
    </div>
  );
};

export default CourseLevelsAccordion;
