import lab1 from '../data/labs/lab1.json';
import lab2 from '../data/labs/lab2.json';
import lab3 from '../data/labs/lab3.json';
import lab4 from '../data/labs/lab4.json';
import lab5 from '../data/labs/lab5.json';
import lab6 from '../data/labs/lab6.json';
import lab7 from '../data/labs/lab7.json';
import lab8 from '../data/labs/lab8.json';
import lab9 from '../data/labs/lab9.json';
import lab10 from '../data/labs/lab10.json';
import mock_exam from '../data/labs/mock_exam.json';

export const labs = [
  {
    id: 'lab1',
    title: 'Lab 1',
    number: 'Εργαστήριο 1',
    description: 'E1 Εισαγωγή στον προσομοιωτή RARS',
    questions: lab1,
  },
  {
    id: 'lab2',
    title: 'Lab 2',
    number: 'Εργαστήριο 2',
    description: 'E2 Διαχείριση μνήμης και κλήσεις συστήματος',
    questions: lab2,
  },
  {
    id: 'lab3',
    title: 'Lab 3',
    number: 'Εργαστήριο 3',
    description: 'E3 Αριθμητικές και Λογικές Πράξεις',
    questions: lab3,
  },
  {
    id: 'lab4',
    title: 'Lab 4',
    number: 'Εργαστήριο 4',
    description: 'E4 Έλεγχος Ροής Προγράμματος',
    questions: lab4,
  },
  {
    id: 'lab5',
    title: 'Lab 5',
    number: 'Εργαστήριο 5',
    description: 'E5 Διαδικασίες και Στοίβα',
    questions: lab5,
  },
  {
    id: 'lab6',
    title: 'Lab 6',
    number: 'Εργαστήριο 6',
    description: 'E6 Χειρισμός Κρατούμενου, Πολλαπλασιασμός',
    questions: lab6,
  },
  {
    id: 'lab7',
    title: 'Lab 7',
    number: 'Εργαστήριο 7',
    description: 'E7 Αριθμητική Κινητής Υποδιαστολής',
    questions: lab7,
  },
  {
    id: 'lab8',
    title: 'Lab 8',
    number: 'Εργαστήριο 8',
    description: 'E8 Εισαγωγή στον προσομοιωτή QtRVsim',
    questions: lab8,
  },
  {
    id: 'lab9',
    title: 'Lab 9',
    number: 'Εργαστήριο 9',
    description: 'E9 Προσομοίωση επεξεργαστή με διοχέτευση',
    questions: lab9,
  },
  {
    id: 'lab10',
    title: 'Lab 10',
    number: 'Εργαστήριο 10',
    description: 'E10 Βελτίωση ενός επεξεργαστή με διοχέτευση',
    questions: lab10,
  },
  {
    id: 'mock_exam',
    title: 'Mock Exam',
    number: 'Προσομοίωση Εξέτασης',
    description: '',
    questions: mock_exam,
  },
];
