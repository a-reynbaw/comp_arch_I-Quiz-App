import ExaminationDialog from './components/ExaminationDialog';
import QuizCard from './components/QuizCard';
import PDFViewer from './components/PDFViewer';
import { quizzes } from './utils/quizzes';
import { useState } from 'react';
import { pdfjs } from 'react-pdf';
import 'react-pdf/dist/esm/Page/AnnotationLayer.css';
import 'react-pdf/dist/esm/Page/TextLayer.css';

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

function App() {
  const [isExamModeOpen, setIsExamModeOpen] = useState(false);

  // PDF books data
  const pdfBooks = [
    { title: 'Lab Pamphlet', file: '/pdfs/lab_guide.pdf' },
    { title: 'Lab Exam Guide', file: '/pdfs/exam_guide.pdf' },
    // Add more PDFs as needed
  ];

  return (
    <div className="min-h-screen bg-gray-950 p-8">
      <div className="mx-auto max-w-6xl">
        {/* Header and Quiz Section */}
        <div className="mb-16 text-center">
          <h1 className="mb-10 text-4xl font-bold text-gray-100">
            Κουίζ Αρχιτεκτονικής Υπολογιστών I
          </h1>
        </div>

        {/* Quizzes Grid */}
        <div className="mb-20 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {quizzes.map((quiz) => (
            <QuizCard key={quiz.id} quiz={quiz} />
          ))}
        </div>

        {/* PDF Books Section */}
        <div className="mt-16">
          <h2 className="mb-8 text-center text-3xl font-bold text-gray-100">
            Επιπλέον Υλικό
          </h2>
          <div className="grid gap-8 md:grid-cols-2">
            {pdfBooks.map((pdf, index) => (
              <PDFViewer
                key={index}
                title={pdf.title}
                file={pdf.file}
              />
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="mt-20 text-center">
          <h4 className="text-gray-600">
            Made with love by{' '}
            <a 
              href="https://github.com/a-reynbaw" 
              className="text-purple-500 hover:text-purple-400 transition-colors"
              target="_blank" 
              rel="noopener noreferrer"
            >
              _a_reynbaw
            </a>
            {' and '}
            <a 
              href="https://github.com/mgiannopoulos24" 
              className="text-purple-500 hover:text-purple-400 transition-colors"
              target="_blank" 
              rel="noopener noreferrer"
            >
              deathwish24
            </a>
          </h4>
        </div>
      </div>

      {/* Examination Dialog */}
      <ExaminationDialog
        isOpen={isExamModeOpen}
        onClose={() => setIsExamModeOpen(false)}
        allQuizzes={quizzes}
      />
    </div>
  );
}

export default App;
