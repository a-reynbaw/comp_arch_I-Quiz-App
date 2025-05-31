import { Quiz } from '../types';
import QuizDialog from './QuizDialog';
import { Play } from 'lucide-react';
import { useState } from 'react';

interface QuizCardProps {
  quiz: Quiz;
}

export default function QuizCard({ quiz }: QuizCardProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <div className="rounded-lg bg-gray-900 p-6 shadow-lg transition-shadow hover:shadow-xl border border-gray-700">
        <h2 className="mb-2 text-2xl font-bold text-gray-100">{quiz.title}</h2>
        <p className="mb-4 text-gray-300">{quiz.description}</p>
        <button
          onClick={() => setIsOpen(true)}
          className="flex items-center gap-2 rounded-lg bg-purple-700 px-4 py-2 text-white transition-colors hover:bg-purple-800"
        >
          <Play size={20} />
          Ξεκίνα
        </button>
      </div>

      <QuizDialog quiz={quiz} isOpen={isOpen} onClose={() => setIsOpen(false)} />
    </>
  );
}