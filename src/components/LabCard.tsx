import { loadImage } from '../utils/loadImage';
import { MathJax, MathJaxContext } from 'better-react-mathjax';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useEffect, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import rehypeHighlight from 'rehype-highlight';

interface LabQuestion {
  id: string;
  title: string;
  question?: string;
  solution?: string;
  image?: string[];  // Changed from string to string[]
}

interface Lab {
  id: string;
  title: string;
  number: string;
  description: string;
  questions: LabQuestion[];
}

interface LabCardProps {
  lab: Lab;
}

export default function LabCard({ lab }: LabCardProps) {
  const [currentImages, setCurrentImages] = useState<string[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showSolution, setShowSolution] = useState(false);

  const currentQuestion = lab.questions[currentIndex];
  const hasNext = currentIndex < lab.questions.length - 1;
  const hasPrev = currentIndex > 0;

  const handleNext = () => {
    if (hasNext) {
      setCurrentIndex(currentIndex + 1);
      setShowSolution(false);
    }
  };

  const handlePrev = () => {
    if (hasPrev) {
      setCurrentIndex(currentIndex - 1);
      setShowSolution(false);
    }
  };

  useEffect(() => {
    if (currentQuestion?.image?.length) {
      Promise.all(
        currentQuestion.image.map(img => loadImage(img))
      ).then(loadedImages => {
        setCurrentImages(loadedImages.filter(Boolean) as string[]);
      });
    } else {
      setCurrentImages([]);
    }
  }, [currentQuestion]);

  const containsMath = (text: string) => {
    return (
      text?.includes('$$') || text?.includes('$') || text?.includes('\\(') || text?.includes('\\[')
    );
  };

  const containsCodeBlocks = (text: string) => {
    return text?.includes('```') || text?.includes('`');
  };

  const renderContent = (text: string) => {
    if (!text) return null;

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
    <div className="rounded-lg border border-gray-700 bg-gray-900 p-6 shadow-lg transition-shadow hover:shadow-xl">
      <h2 className="mb-2 text-center text-2xl font-bold text-gray-100">{lab.number}</h2>
       {lab.description && (
          <h4 className="text-center font-bold text-purple-100">
            {lab.description}
          </h4>
        )}
        {/* Button to open questions */}
        <div className="flex flex-1 items-end justify-center">
          <button
            onClick={() => {
              setIsOpen(true);
              setShowSolution(false);
            }}
            className="h-12 mt-6 rounded-lg bg-purple-700 px-4 py-2 text-white transition-colors hover:bg-purple-800"
          >
            Άνοιγμα
          </button>
        </div>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50" onClick={() => setIsOpen(false)} />
          <div className="relative max-h-[90vh] w-full max-w-4xl overflow-y-auto rounded-lg bg-gray-900 p-6 shadow-xl">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-2xl font-bold text-white">{currentQuestion.title}</h3>
              <div className="flex items-center gap-4">
                <button
                  onClick={handlePrev}
                  disabled={!hasPrev}
                  className="rounded-lg bg-purple-700 px-3 py-2 text-white transition-colors hover:bg-purple-800 disabled:opacity-50"
                >
                  <ChevronLeft className="h-4 w-4" />
                </button>
                <span className="text-white">
                  {currentIndex + 1} / {lab.questions.length}
                </span>
                <button
                  onClick={handleNext}
                  disabled={!hasNext}
                  className="rounded-lg bg-purple-700 px-3 py-2 text-white transition-colors hover:bg-purple-800 disabled:opacity-50"
                >
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            </div>

            <div className="prose prose-invert max-w-none">
              <h4 className="text-lg font-semibold text-gray-200">Εκφώνηση:</h4>
              <div className="text-white">
                <MathJaxContext>
                  {renderContent(currentQuestion.question || '')}
                    {currentImages.length > 0 && (
                      <div className="mt-4 flex flex-col gap-4">
                        {currentImages.map((image, index) => (
                          <div key={index} className="flex justify-center">
                            <img
                              src={image}
                              alt={`Question ${currentIndex + 1} Illustration ${index + 1}`}
                              className="h-auto max-w-[600px] rounded-lg border border-gray-700 shadow"
                              style={{ maxHeight: '400px' }}
                            />
                          </div>
                        ))}
                      </div>
                    )}
                </MathJaxContext>
              </div>

              {currentQuestion.solution && (
                <>
                  <div className="flex justify-center">
                    <button
                      onClick={() => setShowSolution((prev) => !prev)}
                      className="mb-0 mt-9 rounded-lg bg-purple-700 px-4 py-2 text-white transition-colors hover:bg-purple-800"
                    >
                      {showSolution ? 'Απόκρυψη Λύσης' : 'Δες τη Λύση'}
                    </button>
                  </div>
                  {showSolution && (
                    <>
                      <h4 className="mb-4 mt-2 text-lg font-semibold text-gray-200">Λύση:</h4>
                      <div className="rounded-lg bg-purple-950 p-4 text-white">
                        <MathJaxContext>{renderContent(currentQuestion.solution)}</MathJaxContext>
                      </div>
                    </>
                  )}
                </>
              )}
            </div>

            <div className="mt-6 flex justify-end">
              <button
                onClick={() => setIsOpen(false)}
                className="rounded-lg bg-purple-700 px-4 py-2 text-white transition-colors hover:bg-purple-800"
              >
                Κλείσιμο
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
