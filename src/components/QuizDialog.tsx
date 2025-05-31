import { Quiz } from '../types';
import { loadImage } from '../utils/loadImage';
import { MathJax, MathJaxContext } from 'better-react-mathjax';
import 'highlight.js/styles/github.css';
import { X } from 'lucide-react';
import { useEffect, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import rehypeHighlight from 'rehype-highlight';

interface QuizDialogProps {
  quiz: Quiz;
  isOpen: boolean;
  onClose: () => void;
}


export default function QuizDialog({ quiz, isOpen, onClose }: QuizDialogProps) {
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [currentImage, setCurrentImage] = useState<string | null>(null);
  const [showSolution, setShowSolution] = useState(false);

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

  // DARK THEME: update answer class names
  const getAnswerClassName = (index: number) => {
    if (selectedAnswer === null) {
      return 'border border-gray-700 bg-gray-800 text-gray-100 p-4 rounded-lg mb-2 hover:bg-gray-700 cursor-pointer';
    }
    if (question.answers[index].correct) {
      return 'border border-green-500 bg-green-900 text-green-200 p-4 rounded-lg mb-2';
    }
    if (index === selectedAnswer && !question.answers[index].correct) {
      return 'border border-red-500 bg-red-900 text-red-200 p-4 rounded-lg mb-2';
    }
    return 'border border-gray-700 bg-gray-800 text-gray-400 p-4 rounded-lg mb-2 opacity-50';
  };

  // Helper function to detect if content contains math expressions
  const containsMath = (text: string) => {
    return (
      text.includes('$$') || text.includes('$') || text.includes('\\(') || text.includes('\\[')
    );
  };

  // Helper function to detect if content contains markdown code blocks
  const containsCodeBlocks = (text: string) => {
    return text.includes('```') || text.includes('`');
  };

  const renderContent = (text: string) => {
    // If content contains code blocks, prioritize markdown rendering
    if (containsCodeBlocks(text)) {
      return (
        <ReactMarkdown
          rehypePlugins={[rehypeHighlight]}
          components={{
            code: ({ className, children, ...props }: any) => {
              const match = /language-(\w+)/.exec(className || '');
              const isCodeBlock = match && className;

              return isCodeBlock ? (
                <pre className="overflow-x-auto rounded bg-gray-900 p-2 text-gray-100">
                  <code className={className} {...props}>
                    {children}
                  </code>
                </pre>
              ) : (
                <code {...props}>{children}</code>
              );
            },
          }}
        >
          {text}
        </ReactMarkdown>
      );
    }

    // If content contains math, use MathJax
    if (containsMath(text)) {
      return (
        <MathJax>
          {text.split('\n').map((line, index) => (
            <span key={index}>
              {line}
              <br />
            </span>
          ))}
        </MathJax>
      );
    }

    // Default: render as plain text with line breaks
    return text.split('\n').map((line, index) => (
      <span key={index}>
        {line}
        <br />
      </span>
    ));
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-80 p-4">
      <MathJaxContext>
        <div className="flex h-[800px] w-full max-w-[1400px] flex-col rounded-xl bg-gray-900 p-14 shadow-2xl">
          <div className="mb-12 flex items-center justify-between">
            <h3 className="text-xl font-bold text-gray-100">Κουίζ {question.number}</h3>
            <button onClick={handleClose} className="text-gray-400 hover:text-gray-200">
              <X size={24} />
            </button>
          </div>

          <div className="mb-3 mt-2 h-[800px] overflow-y-auto text-gray-100">
            {renderContent(question.question)}
            {currentImage && (
              <div className="mt-4 flex justify-center">
                <img
                  src={currentImage}
                  alt="Question Illustration"
                  className="h-auto max-w-full rounded-lg border border-gray-700 shadow"
                  style={{ maxHeight: '200px' }}
                />
              </div>
            )}
          </div>

          {selectedAnswer !== null && (
            <button
              className="mb-2 mt-2 rounded-lg bg-purple-700 px-4 py-2 text-white hover:bg-purple-800"
              onClick={() => setShowSolution((prev) => !prev)}
            >
              {showSolution ? 'Απόκρυψη Λύσης' : 'Δες τη Λύση'}
            </button>
          )}

          {showSolution && (
            <div className="mb-1 mt-2 max-h-[600px] min-h-[500px] overflow-y-auto rounded-lg bg-purple-950 p-4">
              <h4 className="mb-2 font-semibold text-purple-50">Λύση:</h4>
              <div className="text-white">{renderContent(question.solution)}</div>
            </div>
          )}

          {/* {selectedAnswer !== null && (
            <div className="mb-1 mt-2 min-h-[500px] max-h-[2000px] overflow-y-auto rounded-lg bg-purple-950 p-4">
              <h4 className="mb-2 font-semibold text-purple-300">Λύση:</h4>
              <div className="text-white">
                 {renderContent(question.solution)}
              </div>
            </div>
          )} */}

          <div className="mb-8 mt-2 h-[1000px] space-y-2 overflow-y-auto">
            {question.answers.map((answer, index) => (
              <div
                key={index}
                onClick={() => handleAnswerClick(index)}
                className={getAnswerClassName(index)}
              >
                {renderContent(answer.text)}
              </div>
            ))}
          </div>
        </div>
      </MathJaxContext>
    </div>
  );
}
