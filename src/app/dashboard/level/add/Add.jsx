'use client';
import { useState, useEffect, useCallback, useMemo } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {  addLevel } from '../../../../redux/slices/levelsSlice';
import { fetchCourses } from '../../../../redux/slices/coursesSlice';
import { 
  TextField, Button, Typography, 
  FormControl, InputLabel, Select, MenuItem,
  Box, CircularProgress, IconButton,
  Collapse, Divider
} from '@mui/material';
import { toast } from 'react-toastify';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';

const AddLevel = () => {
  const dispatch = useDispatch();
  const { data: courses, status: coursesStatus } = useSelector(state => state.courses);
  const { status: addLevelStatus } = useSelector(state => state.levels);
  
  const [selectedCourse, setSelectedCourse] = useState('');
  const [expandedLesson, setExpandedLesson] = useState(null);
  
  // حالة المستوى باستخدام useReducer لأداء أفضل مع الحالات المعقدة
  const [levelData, setLevelData] = useState({
    levelTitle: { en: '', ar: '', de: '', es: '' },
    levelDescription: { en: '', ar: '', de: '', es: '' },
    isActive: true,
    lessons: []
  });

  // جلب الكورسات عند التركيب
  useEffect(() => {
    dispatch(fetchCourses());
  }, [dispatch]);

  // إضافة درس جديد مع useCallback لمنع إعادة الإنشاء
  const addNewLesson = useCallback(() => {
    setLevelData(prev => ({
      ...prev,
      lessons: [
        ...prev.lessons,
        {
          lessonTitle: { en: '', ar: '', de: '', es: '' },
          content: { en: '', ar: '', de: '', es: '' },
          videoUrl: ''
        }
      ]
    }));
    setExpandedLesson(levelData.lessons.length);
  }, [levelData.lessons.length]);

  // تحديث بيانات الدرس مع useCallback
  const updateLesson = useCallback((index, field, lang, value) => {
    setLevelData(prev => {
      const updatedLessons = [...prev.lessons];
      
      if (lang) {
        updatedLessons[index][field] = {
          ...updatedLessons[index][field],
          [lang]: value
        };
      } else {
        updatedLessons[index][field] = value;
      }
      
      return { ...prev, lessons: updatedLessons };
    });
  }, []);

  // حذف درس مع useCallback
  const removeLesson = useCallback((index) => {
    setLevelData(prev => ({
      ...prev,
      lessons: prev.lessons.filter((_, i) => i !== index)
    }));
    if (expandedLesson === index) setExpandedLesson(null);
  }, [expandedLesson]);

  // تبديل توسيع الدرس
  const toggleLessonExpansion = useCallback((index) => {
    setExpandedLesson(prev => prev === index ? null : index);
  }, []);

  // معالجة إرسال النموذج
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!selectedCourse) {
      toast.error('Please select a course first');
      return;
    }

    // التحقق من صحة البيانات
    const requiredLangs = ['en', 'ar', 'de', 'es'];
    for (const lang of requiredLangs) {
      if (!levelData.levelTitle[lang]?.trim()) {
        toast.error(`Level title is required in ${lang.toUpperCase()}`);
        return;
      }
    }

    if (levelData.lessons.length === 0) {
      toast.error('Please add at least one lesson');
      return;
    }

    for (const lesson of levelData.lessons) {
      for (const lang of requiredLangs) {
        if (!lesson.lessonTitle[lang]?.trim()) {
          toast.error(`Lesson title is required in ${lang.toUpperCase()} for all lessons`);
          return;
        }
      }

      if (!lesson.videoUrl?.trim()) {
        toast.error('Video URL is required for all lessons');
        return;
      }
    }

    try {
      const result = await dispatch(addLevel({
        ...levelData,
        CourseId: selectedCourse
      }));

      if (result.error) throw new Error(result.error.message);

      toast.success('Level created successfully!');
      // إعادة تعيين النموذج
      setSelectedCourse('');
      setLevelData({
        levelTitle: { en: '', ar: '', de: '', es: '' },
        levelDescription: { en: '', ar: '', de: '', es: '' },
        isActive: true,
        lessons: []
      });
      setExpandedLesson(null);
    } catch (error) {
      toast.error(error.message || 'Error creating level');
    }
  };

  // مكون LessonItem المنفصل لتحسين الأداء
  const LessonItem = useMemo(() => ({ lesson, index, updateLesson, removeLesson, expandedLesson, toggleLessonExpansion }) => (
    <Box sx={{ mb: 2, border: '1px solid #ddd', borderRadius: 1 }}>
      <Box 
        sx={{ 
          p: 2, 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          cursor: 'pointer',
          backgroundColor: '#f5f5f5'
        }}
        onClick={() => toggleLessonExpansion(index)}
      >
        <Typography>{lesson.lessonTitle.en || `Lesson ${index + 1}`}</Typography>
        <Box>
          <IconButton 
            onClick={(e) => {
              e.stopPropagation();
              removeLesson(index);
            }}
            color="error"
            size="small"
          >
            <DeleteIcon />
          </IconButton>
          <IconButton size="small">
            {expandedLesson === index ? <ExpandLessIcon /> : <ExpandMoreIcon />}
          </IconButton>
        </Box>
      </Box>

      <Collapse in={expandedLesson === index}>
        <Box sx={{ p: 2 }}>
          <Typography variant="subtitle2" gutterBottom>Lesson Title</Typography>
          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 2, mb: 2 }}>
            {['en', 'ar', 'de', 'es'].map(lang => (
              <TextField
                key={lang}
                label={`${lang.toUpperCase()}`}
                value={lesson.lessonTitle[lang]}
                onChange={(e) => updateLesson(index, 'lessonTitle', lang, e.target.value)}
                required
                size="small"
              />
            ))}
          </Box>

          <TextField
            fullWidth
            label="Video URL"
            value={lesson.videoUrl}
            onChange={(e) => updateLesson(index, 'videoUrl', null, e.target.value)}
            required
            size="small"
            sx={{ mb: 2 }}
          />

          <Typography variant="subtitle2" gutterBottom>Lesson Content</Typography>
          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 2 }}>
            {['en', 'ar', 'de', 'es'].map(lang => (
              <TextField
                key={lang}
                label={`${lang.toUpperCase()}`}
                value={lesson.content[lang]}
                onChange={(e) => updateLesson(index, 'content', lang, e.target.value)}
                multiline
                rows={3}
                size="small"
              />
            ))}
          </Box>
        </Box>
      </Collapse>
    </Box>
  ), []);

  // حالة التحميل من Redux
  const isLoading = coursesStatus === 'loading' || addLevelStatus === 'loading';

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ p: 3, maxWidth: 800, mx: 'auto' }}>
      <Typography variant="h4" gutterBottom>Create New Level</Typography>

      {/* Course Selection */}
      <FormControl fullWidth sx={{ mb: 3 }} required>
        <InputLabel>Select Course</InputLabel>
        <Select
          value={selectedCourse}
          onChange={(e) => setSelectedCourse(e.target.value)}
          label="Select Course"
        >
          {courses.map((course) => (
            <MenuItem key={course._id} value={course._id}>
              {course.title?.en || course.title}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      {/* Level Title */}
      <Typography variant="h6" gutterBottom>Level Title</Typography>
      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 2, mb: 3 }}>
        {['en', 'ar', 'de', 'es'].map(lang => (
          <TextField
            key={lang}
            label={`Title (${lang.toUpperCase()})`}
            value={levelData.levelTitle[lang]}
            onChange={(e) => setLevelData(prev => ({
              ...prev,
              levelTitle: { ...prev.levelTitle, [lang]: e.target.value }
            }))}
            required
          />
        ))}
      </Box>

      {/* Level Description */}
      <Typography variant="h6" gutterBottom>Level Description</Typography>
      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 2, mb: 3 }}>
        {['en', 'ar', 'de', 'es'].map(lang => (
          <TextField
            key={lang}
            label={`Description (${lang.toUpperCase()})`}
            value={levelData.levelDescription[lang]}
            onChange={(e) => setLevelData(prev => ({
              ...prev,
              levelDescription: { ...prev.levelDescription, [lang]: e.target.value }
            }))}
            multiline
            rows={3}
          />
        ))}
      </Box>

      {/* Lessons Section */}
      <Box sx={{ mb: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h6">Lessons</Typography>
          <Button 
            variant="outlined" 
            startIcon={<AddIcon />}
            onClick={addNewLesson}
          >
            Add Lesson
          </Button>
        </Box>

        {levelData.lessons.map((lesson, index) => (
          <LessonItem
            key={index}
            lesson={lesson}
            index={index}
            updateLesson={updateLesson}
            removeLesson={removeLesson}
            expandedLesson={expandedLesson}
            toggleLessonExpansion={toggleLessonExpansion}
          />
        ))}
      </Box>

      {/* Submit Button */}
      <Button
        type="submit"
        variant="contained"
        size="large"
        disabled={isLoading || !selectedCourse}
        sx={{ mt: 2 }}
      >
        {isLoading ? <CircularProgress size={24} /> : 'Create Level'}
      </Button>
    </Box>
  );
};

export default AddLevel;