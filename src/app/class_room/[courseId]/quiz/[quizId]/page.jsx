'use client';
import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { useSelector, useDispatch } from 'react-redux';
import { fetchQuizzes } from '../../../../../redux/slices/quizzesSlice';
import '../../../ClassRoom.css';
import IntroSections from '../../../../../components/IntroSections';
import {useTranslation} from 'react-i18next';

const QuizPage = () => {
  const { courseId, quizId } = useParams();
  const dispatch = useDispatch();
  const { quizzes } = useSelector((state) => state.quizzes);

  const [quiz, setQuiz] = useState(null);
  const [userAnswers, setUserAnswers] = useState([]);
  const [score, setScore] = useState(null);
  const [showSummary, setShowSummary] = useState(false);
  const [timeLeft, setTimeLeft] = useState(900); // 15 minutes
  const [timerExpired, setTimerExpired] = useState(false);
const {t} = useTranslation(); 
  // 🧠 تحميل الكويز
  useEffect(() => {
    dispatch(fetchQuizzes());
  }, [dispatch]);

  useEffect(() => {
    const selectedQuiz = quizzes.find((q) => q._id === quizId);
    if (selectedQuiz) {
      setQuiz(selectedQuiz);
      setUserAnswers(Array(selectedQuiz.questions.length).fill(null));
    }
  }, [quizzes, quizId]);

  // ⏳ عداد الوقت
  useEffect(() => {
    if (quiz && score === null) {
      if (timeLeft === 0) {
        setTimerExpired(true);
        handleSubmit();
        return;
      }

      const timer = setTimeout(() => setTimeLeft((prev) => prev - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [timeLeft, quiz, score]);

  const formatTime = (seconds) => {
    const mins = String(Math.floor(seconds / 60)).padStart(2, '0');
    const secs = String(seconds % 60).padStart(2, '0');
    return `${mins}:${secs}`;
  };

  const handleAnswerChange = (index, selectedOption) => {
    if (score !== null) return; // ما تخليش المستخدم يغير بعد التسليم
    const updatedAnswers = [...userAnswers];
    updatedAnswers[index] = selectedOption;
    setUserAnswers(updatedAnswers);
  };

  const handleSubmit = () => {
    let totalScore = 0;

    quiz?.questions.forEach((question, index) => {
      if (userAnswers[index] === question.correctAnswerIndex) {
        totalScore += question.score;
      }
    });

    setScore(totalScore);
    setShowSummary(true);
  };

  const handleRetry = () => {
    setUserAnswers(Array(quiz.questions.length).fill(null));
    setScore(null);
    setShowSummary(false);
    setTimeLeft(900);
    setTimerExpired(false);
  };

  if (quizId && quizzes.length && !quiz) return <p className="text-danger text-center mt-5">❌ لا يوجد كويز بهذا المعرف.</p>;
  if (!quiz) return <p className="text-center mt-5">جاري تحميل الكويز...</p>;

  const answeredCount = userAnswers.filter((ans) => ans !== null).length;
  const progressPercent = Math.round((answeredCount / quiz.questions.length) * 100);
  const totalPossibleScore = quiz.questions.reduce((acc, q) => acc + q.score, 0);

  return (
    <>
      <IntroSections sectionName={quiz?.title} path={`/class_room/${courseId}`} Link={'class Room'} />
      <section className='quiz'>
        <div className="quiz-container container mt-4">
          <div className="quiz-header_container">
            <div className="quiz-header d-flex justify-content-between align-items-center mb-3">
              <h2 className="quiz-title">{quiz.title}</h2>
              <span className="quiz-timer badge bg-danger fs-6">
                ⏳ {formatTime(timeLeft)}
              </span>
            </div>

            <div className="quiz-progress progress">
              <div
                className="quiz-progress-bar progress-bar"
                role="progressbar"
                style={{ width: `${progressPercent}%` }}
                aria-valuenow={progressPercent}
                aria-valuemin="0"
                aria-valuemax="100"
              >
                {progressPercent}%
              </div>
            </div>
          </div>

          {quiz.questions.map((question, index) => (
            <div key={index} className="quiz-question mb-4 p-3 border rounded bg-light">
              <h5 className="question-text">{index + 1}. {question.questionText}</h5>
              <div className="question-options">
                {question.options.map((option, optIndex) => {
                  const isCorrect = showSummary && optIndex === question.correctAnswerIndex;
                  const isUserAnswer = userAnswers[index] === optIndex;
                  const isWrong = showSummary && isUserAnswer && !isCorrect;
                  const isSelected = isUserAnswer && !showSummary;

                  return (
                    <div
                      key={optIndex}
                      className={`quiz-option form-check 
                        ${isCorrect ? 'bg-success text-white' : 
                          isWrong ? 'bg-danger text-white' : 
                          isSelected ? 'border border-primary' : ''} 
                        rounded p-2`}
                    >
                      <input
                        type="radio"
                        id={`q-${index}-opt-${optIndex}`}
                        name={`q-${index}`}
                        className="form-check-input"
                        disabled={score !== null}
                        checked={isUserAnswer}
                        onChange={() => handleAnswerChange(index, optIndex)}
                      />
                      <label className="form-check-label" htmlFor={`q-${index}-opt-${optIndex}`}>
                        {option}
                      </label>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}

          <div className="quiz-actions d-flex gap-3 mt-4">
            {score === null ? (
              <button onClick={handleSubmit} className="btn_style">
                {t('class_room.quizzes_Page.submit_quiz')}
              </button>
            ) : (
              <>
                <button onClick={handleRetry} className="btn_style">
                  {t('class_room.quizzes_Page.retry')}🔁
                </button>
                <div className="quiz-summary ms-auto">
                  <h5 className="quiz-score"> {t('class_room.quizzes_Page.result')}: {score} / {totalPossibleScore}</h5>
                  {timerExpired && <p className="quiz-time-expired text-danger">{t('class_room.quizzes_Page.time_is_up')}!</p>}
                </div>
              </>
            )}
          </div>
        </div>
      </section>
    </>
  );
};

export default QuizPage;
