import { Question, Quiz } from '../types';
import { loadImage } from '../utils/loadImage';
import { MathJax, MathJaxContext } from 'better-react-mathjax';
import Cookies from 'js-cookie';
import { X } from 'lucide-react';
import { useEffect, useState } from 'react';

interface ExaminationDialogProps {
  isOpen: boolean;
  onClose: () => void;
  allQuizzes: Quiz[];
}

const TOTAL_EXAM_QUESTIONS = 15; // Number of questions in the exam

function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

export default function ExaminationDialog({ isOpen, onClose, allQuizzes }: ExaminationDialogProps) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<(number | null)[]>([]);
  const [examQuestions, setExamQuestions] = useState<Question[]>([]);
  const [score, setScore] = useState<number | null>(null);
  const [currentImage, setCurrentImage] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      const allQuestions = allQuizzes.flatMap((quiz) => quiz.questions);
      const shuffledQuestions = shuffleArray(allQuestions);
      const selectedQuestions = shuffledQuestions.slice(0, TOTAL_EXAM_QUESTIONS);
      setExamQuestions(selectedQuestions);
      setSelectedAnswers(new Array(selectedQuestions.length).fill(null));
      setCurrentQuestionIndex(0);
      setScore(null);
    }
  }, [isOpen, allQuizzes]);

  useEffect(() => {
    setCurrentImage(null);
    if (isOpen && examQuestions.length > 0 && currentQuestionIndex < examQuestions.length) {
      const question = examQuestions[currentQuestionIndex];
      if (question.image) {
        loadImage(question.image)
          .then((image) => {
            setCurrentImage(image);
          })
          .catch((error) => {
            console.error('Error loading image:', error);
            setCurrentImage(null);
          });
      }
    }
  }, [currentQuestionIndex, examQuestions, isOpen]);

  if (!isOpen || examQuestions.length === 0) return null;

  const currentQuestion = examQuestions[currentQuestionIndex];

  const handleAnswerClick = (index: number) => {
    if (score !== null) return;
    setSelectedAnswers((prev) => {
      const newAnswers = [...prev];
      newAnswers[currentQuestionIndex] = index;
      return newAnswers;
    });
  };

  const handleClose = () => {
    onClose();
  };

  const goToNextQuestion = () => {
    if (currentQuestionIndex < examQuestions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  const goToPreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const finishExam = () => {
    let correctAnswers = 0;
    examQuestions.forEach((q, i) => {
      const selectedIndex = selectedAnswers[i];
      if (selectedIndex !== null && q.answers[selectedIndex]?.correct) {
        correctAnswers++;
      }
    });
    const finalScore = correctAnswers;
    setScore(finalScore);
    Cookies.set('examScore', finalScore.toString(), { expires: 365 });
    Cookies.set('examDate', new Date().toISOString(), { expires: 365 });
  };

  const renderWithNewlines = (text: string) => {
    return text.split('\n').map((line, index) => (
      <span key={index}>
        {line}
        <br />
      </span>
    ));
  };

  // DARK THEME: update answer class names
  const getAnswerClassName = (index: number) => {
    const isSelected = selectedAnswers[currentQuestionIndex] === index;

    if (score !== null) {
      const isCorrect = currentQuestion.answers[index].correct;
      if (isCorrect) {
        return 'border border-green-500 bg-green-900 text-green-200 p-4 rounded-lg mb-2';
      }
      if (isSelected && !isCorrect) {
        return 'border border-red-500 bg-red-900 text-red-200 p-4 rounded-lg mb-2';
      }
      return 'border border-gray-700 bg-gray-800 text-gray-400 p-4 rounded-lg mb-2 opacity-50';
    } else {
      if (isSelected) {
        return 'border border-purple-500 bg-purple-900 text-purple-200 p-4 rounded-lg mb-2 cursor-pointer';
      }
      return 'border border-gray-700 bg-gray-800 text-gray-100 p-4 rounded-lg mb-2 hover:bg-gray-700 cursor-pointer';
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-80 p-2 sm:p-4">
      <MathJaxContext>
        <div className="flex h-full max-h-[95vh] w-full max-w-3xl flex-col overflow-hidden rounded-xl bg-gray-900 shadow-2xl">
          <div className="flex flex-shrink-0 items-center justify-between border-b border-gray-700 p-4 sm:p-6">
            <h2 className="text-xl font-semibold text-gray-100 sm:text-2xl">
              {score === null ? 'Εξέταση σε Εξέλιξη' : 'Αποτελέσματα Εξέτασης'}
            </h2>
            <button onClick={handleClose} className="text-gray-400 hover:text-gray-200">
              <X size={24} className="sm:h-7 sm:w-7" />
            </button>
          </div>

          <div className="flex-grow overflow-y-auto p-4 text-gray-100 sm:p-6">
            {score !== null ? (
              <div className="text-center">
                <h3 className="mb-4 text-2xl font-bold text-gray-100 sm:text-3xl">
                  Το σκορ σου: {score}/{examQuestions.length}
                </h3>
                <p className="mb-6 text-base text-gray-300 sm:text-lg">
                  Μπορείς τώρα να δεις τις σωστές απαντήσεις παρακάτω.
                </p>
                <button
                  onClick={() => setCurrentQuestionIndex(0)}
                  className="mb-4 rounded-lg bg-purple-700 px-5 py-2 text-white transition-colors hover:bg-purple-800 sm:px-6"
                >
                  Έλεγχος Απαντήσεων
                </button>
              </div>
            ) : null}

            <div className={score !== null ? 'border-t border-gray-700 pt-6' : ''}>
              <h3 className="mb-4 text-base font-medium text-gray-200 sm:text-lg">
                Ερώτηση {currentQuestionIndex + 1} από {examQuestions.length}
              </h3>
              <div className="mb-4 max-h-40 overflow-y-auto rounded border border-gray-700 bg-gray-800 p-3 sm:max-h-48">
                <MathJax dynamic key={`mathjax-question-${currentQuestionIndex}`}>
                  {renderWithNewlines(currentQuestion.question)}
                </MathJax>
                {currentImage && (
                  <div className="mt-3 flex justify-center">
                    <img
                      src={currentImage}
                      alt="Question Illustration"
                      className="h-auto max-w-full rounded-lg border border-gray-700"
                      style={{ maxHeight: '150px' }}
                    />
                  </div>
                )}
              </div>

              <div className="max-h-70 space-y-2 overflow-y-auto pr-2 sm:max-h-64">
                {currentQuestion.answers.map((answer, index) => (
                  <div
                    key={`${currentQuestionIndex}-${index}`}
                    onClick={() => handleAnswerClick(index)}
                    className={getAnswerClassName(index)}
                  >
                    <MathJax dynamic key={`mathjax-answer-${currentQuestionIndex}-${index}`}>
                      {renderWithNewlines(answer.text)}
                    </MathJax>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="mt-auto flex flex-shrink-0 justify-between border-t border-gray-700 p-4 sm:p-6">
            <button
              onClick={goToPreviousQuestion}
              disabled={currentQuestionIndex === 0}
              className="rounded-lg bg-gray-800 px-4 py-2 text-gray-200 hover:bg-gray-700 disabled:cursor-not-allowed disabled:opacity-50 sm:px-5"
            >
              Προηγούμενη
            </button>
            {currentQuestionIndex === examQuestions.length - 1 && score === null ? (
              <button
                onClick={finishExam}
                className="rounded-lg bg-green-700 px-4 py-2 text-white hover:bg-green-800 sm:px-5"
              >
                Ολοκλήρωση
              </button>
            ) : (
              <button
                onClick={goToNextQuestion}
                disabled={currentQuestionIndex === examQuestions.length - 1}
                className="rounded-lg bg-purple-700 px-4 py-2 text-white hover:bg-purple-800 disabled:cursor-not-allowed disabled:opacity-50 sm:px-5"
              >
                Επόμενη
              </button>
            )}
          </div>
        </div>
      </MathJaxContext>
    </div>
  );
}
