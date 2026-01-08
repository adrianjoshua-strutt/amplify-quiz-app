import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Plus, Users, Play, Zap, Trophy, Star } from 'lucide-react';
import { client } from '../lib/amplify';
import { useAuth } from '../contexts/AuthContext';
import type { Schema } from '../lib/amplify';
import LoadingSpinner from '../components/LoadingSpinner';
import CreateLobbyModal from '../components/CreateLobbyModal';

export default function HomePage() {
  const [lobbies, setLobbies] = useState<Schema['GameLobby']['type'][]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const { userProfile } = useAuth();

  useEffect(() => {
    loadLobbies();
  }, []);

  const loadLobbies = async () => {
    try {
      const { data } = await client.models.GameLobby.list({
        filter: { 
          and: [
            { isActive: { eq: true } },
            { gameState: { eq: 'WAITING' } }
          ]
        }
      });
      setLobbies(data);
    } catch (error) {
      console.error('Error loading lobbies:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 }
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-8"
    >
      {/* Hero Section */}
      <motion.div variants={itemVariants} className="text-center space-y-4">
        <h1 className="text-5xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent">
          Quiz Battle Arena
        </h1>
        <p className="text-xl text-white/80 max-w-2xl mx-auto">
          Challenge your friends in real-time quiz battles. Press the buzzer, answer questions, and climb the leaderboard!
        </p>
        
        {userProfile && (
          <div className="flex items-center justify-center space-x-6 text-lg">
            <div className="flex items-center space-x-2">
              <Trophy className="w-5 h-5 text-yellow-400" />
              <span className="text-yellow-400 font-semibold">{userProfile.crowns} Crowns</span>
            </div>
            <div className="flex items-center space-x-2">
              <Star className="w-5 h-5 text-blue-400" />
              <span className="text-blue-400 font-semibold">{userProfile.totalScore.toLocaleString()} Points</span>
            </div>
            <div className="flex items-center space-x-2">
              <Zap className="w-5 h-5 text-green-400" />
              <span className="text-green-400 font-semibold">{userProfile.gamesPlayed} Games</span>
            </div>
          </div>
        )}
      </motion.div>

      {/* Quick Actions */}
      <motion.div variants={itemVariants} className="flex flex-col sm:flex-row gap-4 justify-center">
        <button
          onClick={() => setShowCreateModal(true)}
          className="btn-primary flex items-center space-x-2 text-lg px-8 py-4"
        >
          <Plus className="w-5 h-5" />
          <span>Create Lobby</span>
        </button>
        
        <Link to="/friends" className="btn-secondary flex items-center space-x-2 text-lg px-8 py-4">
          <Users className="w-5 h-5" />
          <span>Find Friends</span>
        </Link>
      </motion.div>

      {/* Active Lobbies */}
      <motion.div variants={itemVariants} className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-white">Active Lobbies</h2>
          <button
            onClick={loadLobbies}
            className="btn-secondary"
            disabled={isLoading}
          >
            {isLoading ? <LoadingSpinner size="sm" /> : 'Refresh'}
          </button>
        </div>

        {isLoading ? (
          <div className="flex justify-center py-12">
            <LoadingSpinner size="lg" />
          </div>
        ) : lobbies.length === 0 ? (
          <div className="card text-center py-12">
            <Users className="w-16 h-16 text-white/40 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-white/80 mb-2">No Active Lobbies</h3>
            <p className="text-white/60 mb-6">Be the first to create a lobby and start playing!</p>
            <button
              onClick={() => setShowCreateModal(true)}
              className="btn-primary"
            >
              Create First Lobby
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {lobbies.map((lobby) => (
              <motion.div
                key={lobby.id}
                variants={itemVariants}
                whileHover={{ scale: 1.02 }}
                className="card hover:bg-white/15 transition-all duration-200 cursor-pointer"
              >
                <Link to={`/lobby/${lobby.id}`} className="block">
                  <div className="flex items-start justify-between mb-3">
                    <h3 className="text-lg font-semibold text-white truncate">
                      {lobby.name}
                    </h3>
                    <span className="text-xs bg-green-500/20 text-green-400 px-2 py-1 rounded-full">
                      {lobby.gameState}
                    </span>
                  </div>
                  
                  <div className="space-y-2 text-sm text-white/70">
                    <div className="flex items-center justify-between">
                      <span>Players:</span>
                      <span className="text-white">
                        {lobby.players?.length || 0} / {lobby.maxPlayers}
                      </span>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <span>Host:</span>
                      <span className="text-white truncate ml-2">
                        {lobby.hostId}
                      </span>
                    </div>
                  </div>
                  
                  <div className="mt-4 flex items-center justify-between">
                    <div className="flex items-center space-x-1">
                      <Users className="w-4 h-4" />
                      <span className="text-xs">
                        {lobby.players?.length || 0} playing
                      </span>
                    </div>
                    
                    <div className="flex items-center space-x-1 text-primary-400">
                      <Play className="w-4 h-4" />
                      <span className="text-xs font-medium">Join Game</span>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        )}
      </motion.div>

      {/* Create Lobby Modal */}
      <CreateLobbyModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onLobbyCreated={loadLobbies}
      />
    </motion.div>
  );
}