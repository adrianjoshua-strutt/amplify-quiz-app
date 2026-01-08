import React from 'react';
import { motion } from 'framer-motion';
import { Crown, Trophy, Star, Zap, Users, Calendar, Edit3 } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

export default function ProfilePage() {
  const { userProfile } = useAuth();

  if (!userProfile) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-white mb-4">Profile Not Found</h2>
        <p className="text-white/70">Unable to load your profile information.</p>
      </div>
    );
  }

  const winRate = userProfile.gamesPlayed > 0 
    ? ((userProfile.gamesWon / userProfile.gamesPlayed) * 100).toFixed(1)
    : '0.0';

  const averageScore = userProfile.gamesPlayed > 0
    ? Math.round(userProfile.totalScore / userProfile.gamesPlayed)
    : 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-4xl mx-auto space-y-6"
    >
      {/* Profile Header */}
      <div className="card">
        <div className="flex flex-col md:flex-row items-start md:items-center space-y-4 md:space-y-0 md:space-x-6">
          {/* Avatar */}
          <div className="w-24 h-24 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white text-3xl font-bold">
            {userProfile.username.charAt(0).toUpperCase()}
          </div>
          
          {/* Profile Info */}
          <div className="flex-1">
            <div className="flex items-center space-x-3 mb-2">
              <h1 className="text-3xl font-bold text-white">{userProfile.username}</h1>
              <button className="p-2 text-white/70 hover:text-white hover:bg-white/10 rounded-lg transition-colors">
                <Edit3 className="w-4 h-4" />
              </button>
            </div>
            <p className="text-white/70 mb-4">{userProfile.email}</p>
            
            {/* Crown Display */}
            <div className="flex items-center space-x-6">
              <div className="flex items-center space-x-2">
                <Crown className="w-6 h-6 text-yellow-400" />
                <span className="text-2xl font-bold text-yellow-400">{userProfile.crowns}</span>
                <span className="text-white/70">Crowns</span>
              </div>
              
              <div className="flex items-center space-x-2">
                <Star className="w-6 h-6 text-blue-400" />
                <span className="text-2xl font-bold text-blue-400">{userProfile.totalScore.toLocaleString()}</span>
                <span className="text-white/70">Total Points</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Statistics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="card text-center">
          <Zap className="w-8 h-8 text-green-400 mx-auto mb-3" />
          <div className="text-2xl font-bold text-white mb-1">{userProfile.gamesPlayed}</div>
          <div className="text-white/60">Games Played</div>
        </div>
        
        <div className="card text-center">
          <Trophy className="w-8 h-8 text-yellow-400 mx-auto mb-3" />
          <div className="text-2xl font-bold text-white mb-1">{userProfile.gamesWon}</div>
          <div className="text-white/60">Games Won</div>
        </div>
        
        <div className="card text-center">
          <Star className="w-8 h-8 text-purple-400 mx-auto mb-3" />
          <div className="text-2xl font-bold text-white mb-1">{winRate}%</div>
          <div className="text-white/60">Win Rate</div>
        </div>
        
        <div className="card text-center">
          <Users className="w-8 h-8 text-blue-400 mx-auto mb-3" />
          <div className="text-2xl font-bold text-white mb-1">{averageScore.toLocaleString()}</div>
          <div className="text-white/60">Avg Score</div>
        </div>
      </div>

      {/* Achievements */}
      <div className="card">
        <h2 className="text-2xl font-bold text-white mb-6 flex items-center space-x-2">
          <Trophy className="w-6 h-6 text-yellow-400" />
          <span>Achievements</span>
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* First Win */}
          <div className={`p-4 rounded-lg border-2 ${userProfile.gamesWon > 0 ? 'bg-green-500/20 border-green-500/30' : 'bg-white/5 border-white/10'}`}>
            <div className="flex items-center space-x-3">
              <div className={`w-12 h-12 rounded-full flex items-center justify-center ${userProfile.gamesWon > 0 ? 'bg-green-500' : 'bg-white/20'}`}>
                <Trophy className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="font-semibold text-white">First Victory</h3>
                <p className="text-sm text-white/70">Win your first game</p>
              </div>
            </div>
          </div>

          {/* Crown Collector */}
          <div className={`p-4 rounded-lg border-2 ${userProfile.crowns >= 5 ? 'bg-yellow-500/20 border-yellow-500/30' : 'bg-white/5 border-white/10'}`}>
            <div className="flex items-center space-x-3">
              <div className={`w-12 h-12 rounded-full flex items-center justify-center ${userProfile.crowns >= 5 ? 'bg-yellow-500' : 'bg-white/20'}`}>
                <Crown className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="font-semibold text-white">Crown Collector</h3>
                <p className="text-sm text-white/70">Earn 5 crowns ({userProfile.crowns}/5)</p>
              </div>
            </div>
          </div>

          {/* Quiz Master */}
          <div className={`p-4 rounded-lg border-2 ${userProfile.gamesPlayed >= 10 ? 'bg-purple-500/20 border-purple-500/30' : 'bg-white/5 border-white/10'}`}>
            <div className="flex items-center space-x-3">
              <div className={`w-12 h-12 rounded-full flex items-center justify-center ${userProfile.gamesPlayed >= 10 ? 'bg-purple-500' : 'bg-white/20'}`}>
                <Zap className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="font-semibold text-white">Quiz Master</h3>
                <p className="text-sm text-white/70">Play 10 games ({userProfile.gamesPlayed}/10)</p>
              </div>
            </div>
          </div>

          {/* High Scorer */}
          <div className={`p-4 rounded-lg border-2 ${userProfile.totalScore >= 5000 ? 'bg-blue-500/20 border-blue-500/30' : 'bg-white/5 border-white/10'}`}>
            <div className="flex items-center space-x-3">
              <div className={`w-12 h-12 rounded-full flex items-center justify-center ${userProfile.totalScore >= 5000 ? 'bg-blue-500' : 'bg-white/20'}`}>
                <Star className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="font-semibold text-white">High Scorer</h3>
                <p className="text-sm text-white/70">Earn 5,000 total points</p>
              </div>
            </div>
          </div>

          {/* Winning Streak */}
          <div className="p-4 rounded-lg border-2 bg-white/5 border-white/10">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 rounded-full flex items-center justify-center bg-white/20">
                <Trophy className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="font-semibold text-white">Winning Streak</h3>
                <p className="text-sm text-white/70">Win 3 games in a row</p>
              </div>
            </div>
          </div>

          {/* Social Butterfly */}
          <div className={`p-4 rounded-lg border-2 ${userProfile.friends && userProfile.friends.length >= 5 ? 'bg-pink-500/20 border-pink-500/30' : 'bg-white/5 border-white/10'}`}>
            <div className="flex items-center space-x-3">
              <div className={`w-12 h-12 rounded-full flex items-center justify-center ${userProfile.friends && userProfile.friends.length >= 5 ? 'bg-pink-500' : 'bg-white/20'}`}>
                <Users className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="font-semibold text-white">Social Butterfly</h3>
                <p className="text-sm text-white/70">Add 5 friends ({userProfile.friends?.length || 0}/5)</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="card">
        <h2 className="text-2xl font-bold text-white mb-6 flex items-center space-x-2">
          <Calendar className="w-6 h-6 text-blue-400" />
          <span>Recent Activity</span>
        </h2>
        
        <div className="space-y-4">
          {/* Mock recent activities */}
          <div className="flex items-center space-x-4 p-3 bg-white/5 rounded-lg">
            <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center">
              <Trophy className="w-5 h-5 text-white" />
            </div>
            <div className="flex-1">
              <p className="text-white">Won a game in "Science Quiz"</p>
              <p className="text-sm text-white/60">2 hours ago • +1 Crown • 850 points</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-4 p-3 bg-white/5 rounded-lg">
            <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
              <Users className="w-5 h-5 text-white" />
            </div>
            <div className="flex-1">
              <p className="text-white">Added QuizMaster as a friend</p>
              <p className="text-sm text-white/60">1 day ago</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-4 p-3 bg-white/5 rounded-lg">
            <div className="w-10 h-10 bg-purple-500 rounded-full flex items-center justify-center">
              <Zap className="w-5 h-5 text-white" />
            </div>
            <div className="flex-1">
              <p className="text-white">Played "History Challenge"</p>
              <p className="text-sm text-white/60">2 days ago • 3rd place • 620 points</p>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}