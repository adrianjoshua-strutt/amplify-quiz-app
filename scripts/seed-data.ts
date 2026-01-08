import { generateClient } from 'aws-amplify/data';
import type { Schema } from '../amplify/data/resource';

const client = generateClient<Schema>();

// Sample categories
const categories = [
  {
    name: 'General Knowledge',
    description: 'Mixed topics and general trivia questions',
    isActive: true,
  },
  {
    name: 'Science & Technology',
    description: 'Questions about science, technology, and innovation',
    isActive: true,
  },
  {
    name: 'History',
    description: 'Historical events, figures, and civilizations',
    isActive: true,
  },
  {
    name: 'Sports & Entertainment',
    description: 'Sports, movies, music, and pop culture',
    isActive: true,
  },
  {
    name: 'Geography',
    description: 'Countries, capitals, landmarks, and world knowledge',
    isActive: true,
  },
];

// Sample questions
const sampleQuestions = [
  {
    question: 'What is the capital of France?',
    options: ['London', 'Berlin', 'Paris', 'Madrid'],
    correctAnswer: 2,
    difficulty: 'EASY' as const,
    points: 100,
    categoryName: 'Geography',
  },
  {
    question: 'Which planet is known as the Red Planet?',
    options: ['Venus', 'Mars', 'Jupiter', 'Saturn'],
    correctAnswer: 1,
    difficulty: 'EASY' as const,
    points: 100,
    categoryName: 'Science & Technology',
  },
  {
    question: 'Who painted the Mona Lisa?',
    options: ['Vincent van Gogh', 'Pablo Picasso', 'Leonardo da Vinci', 'Michelangelo'],
    correctAnswer: 2,
    difficulty: 'MEDIUM' as const,
    points: 200,
    categoryName: 'General Knowledge',
  },
  {
    question: 'In which year did World War II end?',
    options: ['1944', '1945', '1946', '1947'],
    correctAnswer: 1,
    difficulty: 'MEDIUM' as const,
    points: 200,
    categoryName: 'History',
  },
  {
    question: 'What is the chemical symbol for gold?',
    options: ['Go', 'Gd', 'Au', 'Ag'],
    correctAnswer: 2,
    difficulty: 'MEDIUM' as const,
    points: 200,
    categoryName: 'Science & Technology',
  },
  {
    question: 'Which country has won the most FIFA World Cups?',
    options: ['Germany', 'Argentina', 'Italy', 'Brazil'],
    correctAnswer: 3,
    difficulty: 'MEDIUM' as const,
    points: 200,
    categoryName: 'Sports & Entertainment',
  },
  {
    question: 'What is the smallest country in the world?',
    options: ['Monaco', 'Nauru', 'Vatican City', 'San Marino'],
    correctAnswer: 2,
    difficulty: 'HARD' as const,
    points: 300,
    categoryName: 'Geography',
  },
  {
    question: 'Who developed the theory of relativity?',
    options: ['Isaac Newton', 'Albert Einstein', 'Galileo Galilei', 'Stephen Hawking'],
    correctAnswer: 1,
    difficulty: 'EASY' as const,
    points: 100,
    categoryName: 'Science & Technology',
  },
  {
    question: 'Which ancient wonder of the world was located in Alexandria?',
    options: ['Hanging Gardens', 'Colossus of Rhodes', 'Lighthouse of Alexandria', 'Temple of Artemis'],
    correctAnswer: 2,
    difficulty: 'HARD' as const,
    points: 300,
    categoryName: 'History',
  },
  {
    question: 'What is the longest river in the world?',
    options: ['Amazon River', 'Nile River', 'Yangtze River', 'Mississippi River'],
    correctAnswer: 1,
    difficulty: 'MEDIUM' as const,
    points: 200,
    categoryName: 'Geography',
  },
];

export async function seedData() {
  console.log('Starting data seeding...');
  
  try {
    // Create categories first
    console.log('Creating categories...');
    const createdCategories = [];
    
    for (const category of categories) {
      const { data } = await client.models.QuestionCategory.create(category);
      if (data) {
        createdCategories.push(data);
        console.log(`Created category: ${data.name}`);
      }
    }

    // Create questions
    console.log('Creating questions...');
    
    for (const question of sampleQuestions) {
      const category = createdCategories.find(c => c.name === question.categoryName);
      if (category) {
        const { data } = await client.models.Question.create({
          question: question.question,
          options: question.options,
          correctAnswer: question.correctAnswer,
          difficulty: question.difficulty,
          points: question.points,
          categoryId: category.id,
          isActive: true,
        });
        
        if (data) {
          console.log(`Created question: ${data.question.substring(0, 50)}...`);
        }
      }
    }

    console.log('Data seeding completed successfully!');
    console.log(`Created ${createdCategories.length} categories and ${sampleQuestions.length} questions.`);
    
  } catch (error) {
    console.error('Error seeding data:', error);
  }
}

// Run if called directly
if (require.main === module) {
  seedData();
}