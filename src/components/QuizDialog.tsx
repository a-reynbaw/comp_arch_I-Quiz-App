import { Quiz } from '../types';
import { loadImage } from '../utils/loadImage';
import { MathJax, MathJaxContext } from 'better-react-mathjax';
import 'highlight.js/styles/github.css';
import { X } from 'lucide-react';
import { useEffect, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import rehypeHighlight from 'rehype-highlight';

// You can choose different themes

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
                <pre className="overflow-x-auto rounded bg-gray-100 p-2">
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
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 p-4">
      <MathJaxContext>
        <div className="flex h-[800px] w-full max-w-[1400px] flex-col rounded-xl bg-white p-14">
          <div className="mb-12 flex items-center justify-between">
            <h3 className="text-xl font-bold">Κουίζ {question.number}</h3>
            <button onClick={handleClose} className="text-gray-500 hover:text-gray-700">
              <X size={24} />
            </button>
          </div>

          <div className="mb-3 mt-2 h-[800px] overflow-y-auto">
            {renderContent(question.question)}
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
            <div className="mb-1 mt-2 h-[2000px] overflow-y-auto rounded-lg bg-purple-100 p-4">
              <h4 className="mb-2 font-semibold text-purple-800">Λύση:</h4>
              {renderContent(question.solution)}
            </div>
          )}

          <div className="h-[1000px] space-y-2 overflow-y-auto mb-8 mt-2">
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
