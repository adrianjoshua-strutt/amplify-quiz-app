import React from 'react';
import { motion } from 'framer-motion';
import { Trophy, Crown, Star, Medal, Users, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface GameResultsProps {
  // Will be populated with real data from game context
}

// Mock data for now
const mockResults = {
  winner: {
    id: '1',
    username: 'QuizMaster',
    score: 1250,
    crowns: 4,
    correctAnswers: 8,
    averageTime: 12.5
  },
  players: [
    { id: '1', username: 'QuizMaster', score: 1250, crowns: 4, correctAnswers: 8, rank: 1 },
    { id: '2', username: 'BrainBox', score: 980, crowns: 2, correctAnswers: 6, rank: 2 },
    { id: '3', username: 'Thinker', score: 750, crowns: 1, correctAnswers: 5, rank: 3 },
    { id: '4', username: 'Newbie', score: 420, crowns: 0, correctAnswers: 3, rank: 4 },
  ],
  gameStats: {
    totalQuestions: 10,
    duration: '8:45',
    category: 'General Knowledge'
  }
};

export default function GameResults({}: GameResultsProps) {
  const navigate = useNavigate();

  const handlePlayAgain = () => {
    navigate('/');
  };

  const handleViewProfile = () => {
    navigate('/profile');
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="space-y-6"
    >
      {/* Winner Announcement */}
      <div className="card text-center py-8">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: "spring", bounce: 0.5 }}
          className="w-24 h-24 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-6"
        >
          <Crown className="w-12 h-12 text-white" />
        </motion.div>
        
        <motion.h1
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="text-4xl font-bold bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent mb-2"
        >
          🎉 {mockResults.winner.username} Wins! 🎉
        </motion.h1>
        
        <motion.p
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="text-xl text-white/80 mb-6"
        >
          Congratulations on your victory!
        </motion.p>

        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="flex items-center justify-center space-x-8 text-lg"
        >
          <div className="flex items-center space-x-2">
            <Star className="w-6 h-6 text-blue-400" />
            <span className="text-blue-400 font-bold">{mockResults.winner.score.toLocaleString()} pts</span>
          </div>
          <div className="flex items-center space-x-2">
            <Trophy className="w-6 h-6 text-green-400" />
            <span className="text-green-400 font-bold">{mockResults.winner.correctAnswers}/10 correct</span>
          </div>
          <div className="flex items-center space-x-2">
            <Crown className="w-6 h-6 text-yellow-400" />
            <span className="text-yellow-400 font-bold">+1 Crown</span>
          </div>
        </motion.div>
      </div>

      {/* Final Leaderboard */}
      <div className="card">
        <div className="flex items-center space-x-2 mb-6">
          <Medal className="w-6 h-6 text-yellow-400" />
          <h2 className="text-2xl font-bold text-white">Final Results</h2>
        </div>

        <div className="space-y-4">
          {mockResults.players.map((player, index) => (
            <motion.div
              key={player.id}
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 1 + index * 0.1 }}
              className={`
                flex items-center space-x-4 p-4 rounded-lg
                ${index === 0 
                  ? 'bg-gradient-to-r from-yellow-500/20 to-orange-500/20 border-2 border-yellow-500/30' 
                  : index === 1
                  ? 'bg-gradient-to-r from-gray-400/20 to-gray-500/20 border-2 border-gray-400/30'
                  : index === 2
                  ? 'bg-gradient-to-r from-orange-600/20 to-orange-700/20 border-2 border-orange-600/30'
                  : 'bg-white/5 border-2 border-white/10'
                }
              `}
            >
              {/* Rank Badge */}
              <div className={`
                w-12 h-12 rounded-full flex items-center justify-center text-lg font-bold
                ${index === 0 
                  ? 'bg-gradient-to-br from-yellow-500 to-orange-500 text-white' 
                  : index === 1
                  ? 'bg-gradient-to-br from-gray-400 to-gray-500 text-white'
                  : index === 2
                  ? 'bg-gradient-to-br from-orange-600 to-orange-700 text-white'
                  : 'bg-white/20 text-white/80'
                }
              `}>
                {index === 0 ? <Crown className="w-6 h-6" /> : 
                 index === 1 ? <Medal className="w-6 h-6" /> :
                 index === 2 ? <Trophy className="w-6 h-6" /> : 
                 player.rank}
              </div>

              {/* Player Info */}
              <div className="flex-1">
                <div className="flex items-center space-x-3">
                  <h3 className="text-xl font-bold text-white">{player.username}</h3>
                  {player.crowns > 0 && (
                    <div className="flex items-center space-x-1">
                      <Crown className="w-4 h-4 text-yellow-400" />
                      <span className="text-yellow-400 font-medium">{player.crowns}</span>
                    </div>
                  )}
                </div>
                <div className="flex items-center space-x-4 text-sm text-white/70">
                  <span>{player.correctAnswers}/10 correct</span>
                  <span>•</span>
                  <span>Rank #{player.rank}</span>
                </div>
              </div>

              {/* Score */}
              <div className="text-right">
                <div className="text-2xl font-bold text-white">
                  {player.score.toLocaleString()}
                </div>
                <div className="text-sm text-white/60">points</div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Game Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="card text-center">
          <Users className="w-8 h-8 text-blue-400 mx-auto mb-2" />
          <div className="text-2xl font-bold text-white">{mockResults.players.length}</div>
          <div className="text-white/60">Players</div>
        </div>
        
        <div className="card text-center">
          <Trophy className="w-8 h-8 text-green-400 mx-auto mb-2" />
          <div className="text-2xl font-bold text-white">{mockResults.gameStats.totalQuestions}</div>
          <div className="text-white/60">Questions</div>
        </div>
        
        <div className="card text-center">
          <Star className="w-8 h-8 text-purple-400 mx-auto mb-2" />
          <div className="text-2xl font-bold text-white">{mockResults.gameStats.duration}</div>
          <div className="text-white/60">Duration</div>
        </div>
      </div>

      {/* Action Buttons */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.5 }}
        className="flex flex-col sm:flex-row gap-4 justify-center"
      >
        <button
          onClick={handlePlayAgain}
          className="btn-primary flex items-center space-x-2 px-8 py-3 text-lg"
        >
          <Trophy className="w-5 h-5" />
          <span>Play Again</span>
          <ArrowRight className="w-5 h-5" />
        </button>
        
        <button
          onClick={handleViewProfile}
          className="btn-secondary flex items-center space-x-2 px-8 py-3 text-lg"
        >
          <Users className="w-5 h-5" />
          <span>View Profile</span>
        </button>
      </motion.div>
    </motion.div>
  );
}