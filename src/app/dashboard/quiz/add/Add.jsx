'use client';
import React, { useState, useEffect, useCallback, useMemo, useReducer } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { 
  fetchCourses, 
  fetchLevels, 
  createQuiz,
  resetLevels 
} from '../../../../redux/slices/quizzesSlice';
import { 
  MenuItem, 
  Select, 
  FormControl, 
  InputLabel, 
  Button, 
  Typography, 
  TextField, 
  IconButton, 
  Box,
  Collapse,
  Divider,
  CircularProgress
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import { toast } from 'react-toastify';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';

// Reducer لإدارة حالة الأسئلة
const questionsReducer = (state, action) => {
  switch (action.type) {
    case 'ADD':
      return [...state, action.payload];
    case 'UPDATE':
      return state.map((q, i) => i === action.index ? { ...q, ...action.updates } : q);
    case 'UPDATE_OPTION':
      return state.map((q, i) => 
        i === action.qIndex ? { 
          ...q, 
          options: q.options.map((opt, idx) => 
            idx === action.optIndex ? action.value : opt
          ) 
        } : q
      );
    case 'REMOVE':
      return state.filter((_, i) => i !== action.index);
    case 'RESET':
      return [];
    default:
      return state;
  }
};

// مكون السؤال المنفصل مع React.memo
const QuestionItem = React.memo(({ 
  question, 
  index: qIndex,
  isExpanded,
  onToggle,
  onUpdate,
  onUpdateOption,
  onUpdateScore,
  onRemove
}) => {
  const questionStyles = useMemo(() => ({
    container: { 
      mb: 2, 
      border: '1px solid #ddd', 
      borderRadius: 1,
      overflow: 'hidden',
      transition: 'all 0.3s ease',
      '&:hover': {
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
      }
    },
    header: { 
      p: 2, 
      display: 'flex', 
      justifyContent: 'space-between', 
      alignItems: 'center',
      cursor: 'pointer',
      backgroundColor: '#f5f5f5',
      '&:hover': {
        backgroundColor: '#eeeeee'
      }
    }
  }), []);

  return (
    <Box sx={questionStyles.container}>
      <Box 
        sx={questionStyles.header}
        onClick={() => onToggle(qIndex)}
      >
        <Typography variant="subtitle1">
          Question {qIndex + 1} {!question.questionText && "(New)"}
        </Typography>
        <Box>
          <IconButton 
            onClick={(e) => {
              e.stopPropagation();
              onRemove(qIndex);
            }}
            color="error"
            size="small"
          >
            <DeleteIcon />
          </IconButton>
          <IconButton size="small">
            {isExpanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
          </IconButton>
        </Box>
      </Box>

      <Collapse in={isExpanded}>
        <Box sx={{ p: 3 }}>
          <TextField
            fullWidth
            label="Question Text"
            value={question.questionText}
            onChange={(e) => onUpdate(qIndex, 'questionText', e.target.value)}
            sx={{ mb: 3 }}
          />
          
          <TextField
            fullWidth
            label="Question Score"
            type="number"
            value={question.score}
            onChange={(e) => onUpdateScore(qIndex, e.target.value)}
            sx={{ mb: 3 }}
            inputProps={{ min: 1 }}
          />
          
          {question.options.map((option, optIndex) => (
            <TextField
              key={optIndex}
              fullWidth
              label={`Option ${optIndex + 1}`}
              value={option}
              onChange={(e) => onUpdateOption(qIndex, optIndex, e.target.value)}
              sx={{ mb: 2 }}
            />
          ))}
          
          <FormControl fullWidth>
            <InputLabel>Correct Answer</InputLabel>
            <Select
              value={question.correctAnswerIndex}
              onChange={(e) => onUpdate(qIndex, 'correctAnswerIndex', e.target.value)}
              label="Correct Answer"
            >
              {question.options.map((_, optIndex) => (
                <MenuItem key={optIndex} value={optIndex}>
                  Option {optIndex + 1}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>
      </Collapse>
    </Box>
  );
});

const AddQuiz = () => {
  const dispatch = useDispatch();
  const quizzesState = useSelector(state => state.quizzes);
  const courses = quizzesState?.courses || [];
  const levels = quizzesState?.levels || [];
  const status = quizzesState?.status || 'idle';
  const error = quizzesState?.error || null;

  const [selectedCourse, setSelectedCourse] = useState('');
  const [quizTitle, setquizTitle] = useState('');
  const [selectedLevel, setSelectedLevel] = useState('');
  const [isActive, setIsActive] = useState(true);
  const [expandedQuestion, setExpandedQuestion] = useState(null);
  const [localLoading, setLocalLoading] = useState(false);
  const [questions, dispatchQuestions] = useReducer(questionsReducer, []);

  // Fetch البيانات الأولية
  useEffect(() => {
    dispatch(fetchCourses());
  }, [dispatch]);

  useEffect(() => {
    if (selectedCourse) {
      dispatch(fetchLevels(selectedCourse));
    } else {
      dispatch(resetLevels());
      setSelectedLevel('');
    }
  }, [selectedCourse, dispatch]);

  useEffect(() => {
    if (error) {
      toast.error(error);
    }
  }, [error]);

  // إدارة الأسئلة
  const addQuestion = useCallback(() => {
    const newIndex = questions.length;
    dispatchQuestions({
      type: 'ADD',
      payload: { 
        questionText: "", 
        options: ["", "", "", ""], 
        correctAnswerIndex: 0,
        score: 1 
      }
    });
    setExpandedQuestion(newIndex);
  }, [questions.length]);

  const toggleQuestionExpansion = useCallback((index) => {
    setExpandedQuestion(prev => prev === index ? null : index);
  }, []);

  const updateQuestion = useCallback((index, field, value) => {
    dispatchQuestions({
      type: 'UPDATE',
      index,
      updates: { [field]: value }
    });
  }, []);

  const updateOption = useCallback((qIndex, optIndex, value) => {
    dispatchQuestions({
      type: 'UPDATE_OPTION',
      qIndex,
      optIndex,
      value
    });
  }, []);

  const updateQuestionScore = useCallback((qIndex, value) => {
    dispatchQuestions({
      type: 'UPDATE',
      index: qIndex,
      updates: { score: Math.max(1, Number(value)) }
    });
  }, []);

  const removeQuestion = useCallback((index) => {
    dispatchQuestions({ type: 'REMOVE', index });
    setExpandedQuestion(prev => prev === index ? null : prev > index ? prev - 1 : prev);
  }, []);

  // التحقق من صحة الكويز
  const validateQuiz = useCallback(() => {
    if (!selectedCourse) {
      toast.error("Please select a course");
      return false;
    }
    if (!selectedLevel) {
      toast.error("Please select a level");
      return false;
    }
    if (!quizTitle) {
      toast.error("Please fill a quiz Title");
      return false;
    }    
    if (questions.length === 0) {
      toast.error("Please add at least one question");
      return false;
    }
    
    for (const question of questions) {
      if (!question.questionText.trim()) {
        toast.error("All questions must have text");
        return false;
      }
      if (question.options.some(opt => !opt.trim())) {
        toast.error("All options must be filled");
        return false;
      }
      if (question.score <= 0) {
        toast.error("Question score must be positive");
        return false;
      }
    }
    
    return true;
  }, [selectedCourse, selectedLevel,quizTitle ,  questions]);

  // إرسال الكويز
  const handleSubmitQuiz = useCallback(async () => {
    if (!validateQuiz()) return;

    setLocalLoading(true);
    
    try {
      const quizData = {
        courseId: selectedCourse,
        levelId: selectedLevel,
        isActive,
        quizTitle:quizTitle,
        questions: questions.map(q => ({
          questionText: q.questionText,
          options: q.options,
          correctAnswerIndex: Number(q.correctAnswerIndex),
          score: Number(q.score)
        }))
      };

      await dispatch(createQuiz(quizData)).unwrap();
      
      toast.success("Quiz created successfully!");
      setSelectedLevel("");
      setquizTitle("");      
      dispatchQuestions({ type: 'RESET' });
      setExpandedQuestion(null);
    } catch (error) {
      console.error("Error creating quiz:", error);
      toast.error(error.message || "Failed to create quiz");
    } finally {
      setLocalLoading(false);
    }
  }, [validateQuiz, selectedCourse, selectedLevel,quizTitle , isActive, questions, dispatch]);

  if (status === 'loading' && !localLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ maxWidth: 800, mx: 'auto', p: 3 }}>
      <Typography variant="h4" gutterBottom>Create New Quiz</Typography>
      
      <FormControl fullWidth sx={{ mb: 3 }}>
        <InputLabel>Course</InputLabel>
        <Select 
          value={selectedCourse} 
          onChange={(e) => setSelectedCourse(e.target.value)}
          label="Course"
        >
          {courses.map((course) => (
            <MenuItem key={course._id} value={course._id}>
              {course.title?.en || course.title || course._id}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <FormControl fullWidth sx={{ mb: 3 }}>
        <InputLabel>Level</InputLabel>
        <Select 
          value={selectedLevel} 
          onChange={(e) => setSelectedLevel(e.target.value)}
          label="Level"
          disabled={!selectedCourse}
        >
          {levels.map((level) => (
            <MenuItem key={level._id} value={level._id}>
              {level.levelTitle?.en || level.levelTitle || level._id}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      
<TextField
  sx={{ mb: 3 }}
  name="title"
  label="عنوان الكويز"
  variant="outlined"
  fullWidth
  required
  value={quizTitle}
  onChange={(e) => setquizTitle( e.target.value)}
/>      
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
        <Typography>Quiz Status:</Typography>
        <Button 
          variant={isActive ? "contained" : "outlined"} 
          color="primary" 
          sx={{ ml: 2 }}
          onClick={() => setIsActive(true)}
        >
          Active
        </Button>
        <Button 
          variant={!isActive ? "contained" : "outlined"} 
          color="secondary" 
          sx={{ ml: 1 }}
          onClick={() => setIsActive(false)}
        >
          Inactive
        </Button>
      </Box>

      <Typography variant="h6" gutterBottom>Questions</Typography>
      
      <Button 
        startIcon={<AddIcon />} 
        variant="outlined" 
        sx={{ mb: 3 }}
        onClick={addQuestion}
      >
        Add Question
      </Button>

      {questions.map((question, qIndex) => (
        <QuestionItem
          key={qIndex}
          question={question}
          index={qIndex}
          isExpanded={expandedQuestion === qIndex}
          onToggle={toggleQuestionExpansion}
          onUpdate={updateQuestion}
          onUpdateOption={updateOption}
          onUpdateScore={updateQuestionScore}
          onRemove={removeQuestion}
        />
      ))}

      <Button
        variant="contained"
        color="primary"
        size="large"
        onClick={handleSubmitQuiz}
        disabled={localLoading || questions.length === 0}
        sx={{ mt: 3 }}
      >
        {localLoading ? <CircularProgress size={24} /> : "Create Quiz"}
      </Button>
    </Box>
  );
};

export default AddQuiz;