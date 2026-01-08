import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Trophy, Crown, Star, Medal, Filter, RefreshCw } from 'lucide-react';
import { client } from '../lib/amplify';
import type { Schema } from '../lib/amplify';
import LoadingSpinner from '../components/LoadingSpinner';

type LeaderboardType = 'crowns' | 'totalScore' | 'gamesWon';

export default function LeaderboardPage() {
  const [players, setPlayers] = useState<Schema['UserProfile']['type'][]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [leaderboardType, setLeaderboardType] = useState<LeaderboardType>('crowns');

  useEffect(() => {
    loadLeaderboard();
  }, [leaderboardType]);

  const loadLeaderboard = async () => {
    setIsLoading(true);
    try {
      const { data } = await client.models.UserProfile.list();
      
      // Sort based on selected type
      const sortedPlayers = [...data].sort((a, b) => {
        switch (leaderboardType) {
          case 'crowns':
            return (b.crowns || 0) - (a.crowns || 0);
          case 'totalScore':
            return (b.totalScore || 0) - (a.totalScore || 0);
          case 'gamesWon':
            return (b.gamesWon || 0) - (a.gamesWon || 0);
          default:
            return 0;
        }
      });
      
      setPlayers(sortedPlayers.slice(0, 50)); // Top 50 players
    } catch (error) {
      console.error('Error loading leaderboard:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getLeaderboardTitle = () => {
    switch (leaderboardType) {
      case 'crowns':
        return 'Crown Champions';
      case 'totalScore':
        return 'High Scorers';
      case 'gamesWon':
        return 'Victory Leaders';
      default:
        return 'Leaderboard';
    }
  };

  const getPlayerValue = (player: Schema['UserProfile']['type']) => {
    switch (leaderboardType) {
      case 'crowns':
        return player.crowns || 0;
      case 'totalScore':
        return (player.totalScore || 0).toLocaleString();
      case 'gamesWon':
        return player.gamesWon || 0;
      default:
        return 0;
    }
  };

  const getValueLabel = () => {
    switch (leaderboardType) {
      case 'crowns':
        return 'crowns';
      case 'totalScore':
        return 'points';
      case 'gamesWon':
        return 'wins';
      default:
        return '';
    }
  };

  const getRankIcon = (index: number) => {
    switch (index) {
      case 0:
        return <Crown className="w-6 h-6" />;
      case 1:
        return <Medal className="w-6 h-6" />;
      case 2:
        return <Trophy className="w-6 h-6" />;
      default:
        return index + 1;
    }
  };

  const getRankColor = (index: number) => {
    switch (index) {
      case 0:
        return 'from-yellow-500 to-orange-500';
      case 1:
        return 'from-gray-400 to-gray-500';
      case 2:
        return 'from-orange-600 to-orange-700';
      default:
        return 'from-slate-600 to-slate-700';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-4xl mx-auto space-y-6"
    >
      {/* Header */}
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500 bg-clip-text text-transparent">
          {getLeaderboardTitle()}
        </h1>
        <p className="text-xl text-white/80">
          See how you stack up against other quiz masters!
        </p>
      </div>

      {/* Controls */}
      <div className="card">
        <div className="flex flex-col sm:flex-row items-center justify-between space-y-4 sm:space-y-0">
          <div className="flex items-center space-x-2">
            <Filter className="w-5 h-5 text-white/70" />
            <span className="text-white/70">Sort by:</span>
            <div className="flex space-x-2">
              {[
                { key: 'crowns' as LeaderboardType, label: 'Crowns', icon: Crown },
                { key: 'totalScore' as LeaderboardType, label: 'Points', icon: Star },
                { key: 'gamesWon' as LeaderboardType, label: 'Wins', icon: Trophy },
              ].map(({ key, label, icon: Icon }) => (
                <button
                  key={key}
                  onClick={() => setLeaderboardType(key)}
                  className={`
                    flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-200
                    ${leaderboardType === key 
                      ? 'bg-primary-600 text-white' 
                      : 'bg-white/10 text-white/70 hover:bg-white/20 hover:text-white'
                    }
                  `}
                >
                  <Icon className="w-4 h-4" />
                  <span>{label}</span>
                </button>
              ))}
            </div>
          </div>
          
          <button
            onClick={loadLeaderboard}
            disabled={isLoading}
            className="btn-secondary flex items-center space-x-2"
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
            <span>Refresh</span>
          </button>
        </div>
      </div>

      {/* Leaderboard */}
      <div className="card">
        {isLoading ? (
          <div className="flex justify-center py-12">
            <LoadingSpinner size="lg" />
          </div>
        ) : players.length === 0 ? (
          <div className="text-center py-12">
            <Trophy className="w-16 h-16 text-white/40 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-white/80 mb-2">No Players Yet</h3>
            <p className="text-white/60">Be the first to play and claim the top spot!</p>
          </div>
        ) : (
          <div className="space-y-3">
            {/* Top 3 Podium */}
            {players.length >= 3 && (
              <div className="grid grid-cols-3 gap-4 mb-8">
                {/* 2nd Place */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                  className="text-center"
                >
                  <div className="bg-gradient-to-br from-gray-400 to-gray-500 rounded-lg p-4 mb-3">
                    <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-3 text-2xl font-bold text-white">
                      {players[1].username.charAt(0).toUpperCase()}
                    </div>
                    <h3 className="font-bold text-white truncate">{players[1].username}</h3>
                    <p className="text-white/80 text-sm">{getPlayerValue(players[1])} {getValueLabel()}</p>
                  </div>
                  <div className="text-4xl">🥈</div>
                </motion.div>

                {/* 1st Place */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0 }}
                  className="text-center"
                >
                  <div className="bg-gradient-to-br from-yellow-500 to-orange-500 rounded-lg p-4 mb-3 transform scale-110">
                    <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-3 text-2xl font-bold text-white">
                      {players[0].username.charAt(0).toUpperCase()}
                    </div>
                    <h3 className="font-bold text-white truncate">{players[0].username}</h3>
                    <p className="text-white/90 text-sm">{getPlayerValue(players[0])} {getValueLabel()}</p>
                  </div>
                  <div className="text-5xl">👑</div>
                </motion.div>

                {/* 3rd Place */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="text-center"
                >
                  <div className="bg-gradient-to-br from-orange-600 to-orange-700 rounded-lg p-4 mb-3">
                    <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-3 text-2xl font-bold text-white">
                      {players[2].username.charAt(0).toUpperCase()}
                    </div>
                    <h3 className="font-bold text-white truncate">{players[2].username}</h3>
                    <p className="text-white/80 text-sm">{getPlayerValue(players[2])} {getValueLabel()}</p>
                  </div>
                  <div className="text-4xl">🥉</div>
                </motion.div>
              </div>
            )}

            {/* Full Rankings */}
            <div className="space-y-2">
              {players.map((player, index) => (
                <motion.div
                  key={player.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className={`
                    flex items-center space-x-4 p-4 rounded-lg transition-all duration-200 hover:bg-white/10
                    ${index < 3 ? 'bg-white/5 border border-white/10' : 'bg-white/5'}
                  `}
                >
                  {/* Rank */}
                  <div className={`
                    w-12 h-12 rounded-full flex items-center justify-center text-white font-bold
                    bg-gradient-to-br ${getRankColor(index)}
                  `}>
                    {getRankIcon(index)}
                  </div>

                  {/* Player Avatar */}
                  <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white font-bold">
                    {player.username.charAt(0).toUpperCase()}
                  </div>

                  {/* Player Info */}
                  <div className="flex-1">
                    <div className="flex items-center space-x-2">
                      <h3 className="font-semibold text-white">{player.username}</h3>
                      {player.crowns && player.crowns > 0 && (
                        <div className="flex items-center space-x-1">
                          <Crown className="w-4 h-4 text-yellow-400" />
                          <span className="text-xs text-yellow-400">{player.crowns}</span>
                        </div>
                      )}
                    </div>
                    <div className="text-sm text-white/60">
                      {player.gamesPlayed || 0} games played • {((player.gamesWon || 0) / Math.max(player.gamesPlayed || 1, 1) * 100).toFixed(1)}% win rate
                    </div>
                  </div>

                  {/* Value */}
                  <div className="text-right">
                    <div className="text-xl font-bold text-white">
                      {getPlayerValue(player)}
                    </div>
                    <div className="text-sm text-white/60">{getValueLabel()}</div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
}