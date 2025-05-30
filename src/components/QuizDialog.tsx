import { Quiz } from '../types';
import { loadImage } from '../utils/loadImage';
import { MathJax, MathJaxContext } from 'better-react-mathjax';
import { X } from 'lucide-react';
import { useEffect, useState } from 'react';

interface QuizDialogProps {
  quiz: Quiz;
  isOpen: boolean;
  onClose: () => void;
}

export default function QuizDialog({ quiz, isOpen, onClose }: QuizDialogProps) {
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [currentImage, setCurrentImage] = useState<string | null>(null);

  useEffect(() => {
    if (!isOpen) {
      setSelectedAnswer(null);
    }
  }, [isOpen]);

  // Load the image dynamically
  useEffect(() => {
    const question = quiz.questions[0];
    if (question.image) {
      loadImage(question.image).then((image) => {
        setCurrentImage(image);
      });
    } else {
      setCurrentImage(null);
    }
  }, [quiz]);

  if (!isOpen) return null;

  const question = quiz.questions[0];

  const handleAnswerClick = (index: number) => {
    setSelectedAnswer(index);
  };

  const handleClose = () => {
    onClose();
    setSelectedAnswer(null);
  };

  const getAnswerClassName = (index: number) => {
    if (selectedAnswer === null) {
      return 'border border-gray-300 p-4 rounded-lg mb-2 hover:bg-gray-50 cursor-pointer';
    }
    if (question.answers[index].correct) {
      return 'border border-green-500 bg-green-50 p-4 rounded-lg mb-2';
    }
    if (index === selectedAnswer && !question.answers[index].correct) {
      return 'border border-red-500 bg-red-50 p-4 rounded-lg mb-2';
    }
    return 'border border-gray-300 p-4 rounded-lg mb-2 opacity-50';
  };

  const renderWithNewlines = (text: string) => {
    return text.split('\n').map((line, index) => (
      <span key={index}>
        {line}
        <br />
      </span>
    ));
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 p-4">
      <MathJaxContext>
        <div className="w-full max-w-2xl max-h-[90vh] rounded-xl bg-white p-6 flex flex-col">
          <div className="mb-6 flex items-center justify-between">
            <h3 className="text-xl font-bold">
              Ερώτηση
            </h3>
            <button onClick={handleClose} className="text-gray-500 hover:text-gray-700">
              <X size={24} />
            </button>
          </div>

          <div className="mb-6 max-h-40 overflow-y-auto">
            <MathJax>{renderWithNewlines(question.question)}</MathJax>
            {currentImage && (
              <div className="mt-4 flex justify-center">
                <img
                  src={currentImage}
                  alt="Question Illustration"
                  className="h-auto max-w-full rounded-lg"
                  style={{ maxHeight: '200px' }}
                />
              </div>
            )}
          </div>

          {selectedAnswer !== null && (
            <div className="mb-6 max-h-32 overflow-y-auto rounded-lg bg-blue-50 p-4">
              <h4 className="mb-2 font-semibold text-blue-800">Λύση:</h4>
              <MathJax>{renderWithNewlines(question.solution)}</MathJax>
            </div>
          )}

          <div className="max-h-60 space-y-2 overflow-y-auto">
            {question.answers.map((answer, index) => (
              <div key={index} onClick={() => handleAnswerClick(index)} className={getAnswerClassName(index)}>
                <MathJax>{renderWithNewlines(answer.text)}</MathJax>
              </div>
            ))}
          </div>
        </div>
      </MathJaxContext>
    </div>
  );
}
