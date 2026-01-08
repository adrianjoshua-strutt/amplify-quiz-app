import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Clock, Zap, Trophy, Users, ArrowLeft } from 'lucide-react';
import { useGame } from '../contexts/GameContext';
import { useAuth } from '../contexts/AuthContext';
import LoadingSpinner from '../components/LoadingSpinner';
import BuzzerButton from '../components/BuzzerButton';
import QuestionDisplay from '../components/QuestionDisplay';
import ScoreBoard from '../components/ScoreBoard';
import GameResults from '../components/GameResults';

export default function GamePage() {
  const { lobbyId } = useParams<{ lobbyId: string }>();
  const navigate = useNavigate();
  const { gameState, pressBuzzer, submitAnswer } = useGame();
  const { user } = useAuth();
  const [timeLeft, setTimeLeft] = useState(30);

  useEffect(() => {
    if (!lobbyId) {
      navigate('/');
      return;
    }

    // Timer countdown
    if (gameState.gamePhase === 'question' && timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(prev => prev - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [lobbyId, gameState.gamePhase, timeLeft, navigate]);

  const handleBuzzer = () => {
    pressBuzzer();
  };

  const handleAnswerSelect = (answerIndex: number) => {
    submitAnswer(answerIndex);
  };

  if (!gameState.currentLobby) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="max-w-6xl mx-auto space-y-6"
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => navigate(`/lobby/${lobbyId}`)}
          className="btn-secondary flex items-center space-x-2"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Lobby</span>
        </button>
        
        <div className="text-center">
          <h1 className="text-2xl font-bold text-white">{gameState.currentLobby.name}</h1>
          <p className="text-white/70">
            Question {gameState.questionIndex + 1} of 10
          </p>
        </div>
        
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2 text-white">
            <Clock className="w-5 h-5" />
            <span className="text-xl font-mono">{timeLeft}s</span>
          </div>
        </div>
      </div>

      {/* Game Content */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Main Game Area */}
        <div className="lg:col-span-3 space-y-6">
          <AnimatePresence mode="wait">
            {gameState.gamePhase === 'waiting' && (
              <motion.div
                key="waiting"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="card text-center py-12"
              >
                <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Users className="w-8 h-8 text-white" />
                </div>
                <h2 className="text-2xl font-bold text-white mb-2">Get Ready!</h2>
                <p className="text-white/70">The game is about to start...</p>
                <LoadingSpinner size="md" className="mt-4 mx-auto" />
              </motion.div>
            )}

            {gameState.gamePhase === 'question' && (
              <motion.div
                key="question"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 1.1 }}
              >
                <QuestionDisplay
                  question={gameState.currentQuestion}
                  timeLeft={timeLeft}
                  onAnswerSelect={handleAnswerSelect}
                  canAnswer={!gameState.buzzerPressed}
                />
              </motion.div>
            )}

            {gameState.gamePhase === 'buzzer' && (
              <motion.div
                key="buzzer"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="card text-center py-12"
              >
                <div className="w-24 h-24 bg-gradient-to-br from-yellow-500 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Zap className="w-12 h-12 text-white" />
                </div>
                <h2 className="text-2xl font-bold text-white mb-2">Buzzer Pressed!</h2>
                <p className="text-white/70">Waiting for answer...</p>
              </motion.div>
            )}

            {gameState.gamePhase === 'answer' && (
              <motion.div
                key="answer"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="card text-center py-12"
              >
                <div className="w-24 h-24 bg-gradient-to-br from-green-500 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Trophy className="w-12 h-12 text-white" />
                </div>
                <h2 className="text-2xl font-bold text-white mb-2">Answer Revealed!</h2>
                <p className="text-white/70">Get ready for the next question...</p>
              </motion.div>
            )}

            {gameState.gamePhase === 'finished' && (
              <motion.div
                key="finished"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
              >
                <GameResults />
              </motion.div>
            )}
          </AnimatePresence>

          {/* Buzzer */}
          {(gameState.gamePhase === 'question' || gameState.gamePhase === 'buzzer') && (
            <div className="flex justify-center">
              <BuzzerButton
                onPress={handleBuzzer}
                disabled={gameState.buzzerPressed || !gameState.canBuzz}
                pressed={gameState.buzzerPressed}
              />
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <ScoreBoard />
          
          {/* Game Progress */}
          <div className="card">
            <h3 className="text-lg font-semibold text-white mb-4">Progress</h3>
            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-white/70">Questions:</span>
                <span className="text-white">{gameState.questionIndex + 1} / 10</span>
              </div>
              
              <div className="w-full bg-white/10 rounded-full h-2">
                <div
                  className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${((gameState.questionIndex + 1) / 10) * 100}%` }}
                />
              </div>
              
              <div className="flex justify-between text-sm">
                <span className="text-white/70">Time:</span>
                <span className={`font-mono ${timeLeft <= 10 ? 'text-red-400' : 'text-white'}`}>
                  {timeLeft}s
                </span>
              </div>
            </div>
          </div>

          {/* Game Info */}
          <div className="card">
            <h3 className="text-lg font-semibold text-white mb-4">Game Info</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-white/70">Lobby:</span>
                <span className="text-white truncate ml-2">{gameState.currentLobby.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-white/70">Players:</span>
                <span className="text-white">{gameState.currentLobby.players?.length || 0}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-white/70">Status:</span>
                <span className="text-green-400">{gameState.currentLobby.gameState}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}