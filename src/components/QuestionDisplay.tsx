import React from 'react';
import { motion } from 'framer-motion';
import { Clock, HelpCircle } from 'lucide-react';

interface Question {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
  points: number;
}

interface QuestionDisplayProps {
  question: Question | null;
  timeLeft: number;
  onAnswerSelect: (answerIndex: number) => void;
  canAnswer: boolean;
}

export default function QuestionDisplay({ 
  question, 
  timeLeft, 
  onAnswerSelect, 
  canAnswer 
}: QuestionDisplayProps) {
  if (!question) {
    return (
      <div className="card text-center py-12">
        <HelpCircle className="w-16 h-16 text-white/40 mx-auto mb-4" />
        <h3 className="text-xl font-semibold text-white/80 mb-2">Loading Question...</h3>
      </div>
    );
  }

  const optionLabels = ['A', 'B', 'C', 'D'];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="card"
    >
      {/* Question Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
            Q
          </div>
          <span className="text-white/70">Question</span>
        </div>
        
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <span className="text-white/70 text-sm">Points:</span>
            <span className="text-yellow-400 font-bold">{question.points}</span>
          </div>
          
          <div className="flex items-center space-x-2">
            <Clock className="w-4 h-4 text-white/70" />
            <span className={`font-mono text-lg ${timeLeft <= 10 ? 'text-red-400' : 'text-white'}`}>
              {timeLeft}s
            </span>
          </div>
        </div>
      </div>

      {/* Question Text */}
      <div className="mb-8">
        <h2 className="text-2xl font-semibold text-white leading-relaxed">
          {question.question}
        </h2>
      </div>

      {/* Answer Options */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {question.options.map((option, index) => (
          <motion.button
            key={index}
            onClick={() => canAnswer && onAnswerSelect(index)}
            disabled={!canAnswer}
            className={`
              p-4 rounded-lg text-left transition-all duration-200 border-2
              ${canAnswer 
                ? 'border-white/20 hover:border-white/40 hover:bg-white/10 cursor-pointer' 
                : 'border-white/10 cursor-not-allowed opacity-50'
              }
              bg-white/5 text-white
            `}
            whileHover={canAnswer ? { scale: 1.02 } : {}}
            whileTap={canAnswer ? { scale: 0.98 } : {}}
          >
            <div className="flex items-start space-x-3">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                {optionLabels[index]}
              </div>
              <span className="text-white leading-relaxed">{option}</span>
            </div>
          </motion.button>
        ))}
      </div>

      {/* Instructions */}
      <div className="mt-6 pt-6 border-t border-white/10">
        <p className="text-white/60 text-sm text-center">
          {canAnswer 
            ? 'Press the buzzer first, then select your answer!' 
            : 'Waiting for buzzer or time to run out...'
          }
        </p>
      </div>
    </motion.div>
  );
}