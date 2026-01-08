import React from 'react';
import { motion } from 'framer-motion';
import { Trophy, Crown, Star } from 'lucide-react';

interface Player {
  id: string;
  username: string;
  score: number;
  crowns: number;
  isWinner?: boolean;
}

// Mock data for now - will be replaced with real data from context
const mockPlayers: Player[] = [
  { id: '1', username: 'Player1', score: 850, crowns: 3, isWinner: false },
  { id: '2', username: 'Player2', score: 720, crowns: 1, isWinner: false },
  { id: '3', username: 'Player3', score: 650, crowns: 2, isWinner: false },
  { id: '4', username: 'Player4', score: 480, crowns: 0, isWinner: false },
];

export default function ScoreBoard() {
  const sortedPlayers = [...mockPlayers].sort((a, b) => b.score - a.score);

  return (
    <div className="card">
      <div className="flex items-center space-x-2 mb-4">
        <Trophy className="w-5 h-5 text-yellow-400" />
        <h3 className="text-lg font-semibold text-white">Scoreboard</h3>
      </div>
      
      <div className="space-y-3">
        {sortedPlayers.map((player, index) => (
          <motion.div
            key={player.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className={`
              flex items-center space-x-3 p-3 rounded-lg transition-all duration-200
              ${index === 0 
                ? 'bg-gradient-to-r from-yellow-500/20 to-orange-500/20 border border-yellow-500/30' 
                : 'bg-white/5 hover:bg-white/10'
              }
            `}
          >
            {/* Rank */}
            <div className={`
              w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold
              ${index === 0 
                ? 'bg-gradient-to-br from-yellow-500 to-orange-500 text-white' 
                : index === 1
                ? 'bg-gradient-to-br from-gray-400 to-gray-500 text-white'
                : index === 2
                ? 'bg-gradient-to-br from-orange-600 to-orange-700 text-white'
                : 'bg-white/20 text-white/80'
              }
            `}>
              {index === 0 ? <Crown className="w-4 h-4" /> : index + 1}
            </div>

            {/* Player Info */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center space-x-2">
                <span className="text-white font-medium truncate">
                  {player.username}
                </span>
                {player.crowns > 0 && (
                  <div className="flex items-center space-x-1">
                    <Crown className="w-3 h-3 text-yellow-400" />
                    <span className="text-xs text-yellow-400">{player.crowns}</span>
                  </div>
                )}
              </div>
              <div className="text-xs text-white/60">
                Rank #{index + 1}
              </div>
            </div>

            {/* Score */}
            <div className="text-right">
              <div className="text-white font-bold">
                {player.score.toLocaleString()}
              </div>
              <div className="text-xs text-white/60">points</div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Current Round Info */}
      <div className="mt-4 pt-4 border-t border-white/10">
        <div className="flex items-center justify-between text-sm">
          <span className="text-white/70">Current Round:</span>
          <div className="flex items-center space-x-1">
            <Star className="w-4 h-4 text-blue-400" />
            <span className="text-blue-400 font-medium">Round 3 of 10</span>
          </div>
        </div>
      </div>
    </div>
  );
}