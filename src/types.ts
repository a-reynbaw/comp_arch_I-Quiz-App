export interface Answer {
  text: string;
  correct: boolean;
}

export interface Question {
  question: string;
  solution: string;
  image?: string; // Optional
  answers: Answer[];
}

export interface Quiz {
  id: string;
  title: string;
  description: string;
  questions: Question[];
}
