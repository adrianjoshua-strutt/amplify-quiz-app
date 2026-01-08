import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Users, Play, Crown, Copy, Settings, ArrowLeft } from 'lucide-react';
import { client } from '../lib/amplify';
import { useAuth } from '../contexts/AuthContext';
import { useGame } from '../contexts/GameContext';
import type { Schema } from '../lib/amplify';
import LoadingSpinner from '../components/LoadingSpinner';
import toast from 'react-hot-toast';

export default function LobbyPage() {
  const { lobbyId } = useParams<{ lobbyId: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { gameState, joinLobby, startGame } = useGame();
  const [lobby, setLobby] = useState<Schema['GameLobby']['type'] | null>(null);
  const [players, setPlayers] = useState<Schema['UserProfile']['type'][]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isStarting, setIsStarting] = useState(false);

  useEffect(() => {
    if (lobbyId) {
      loadLobby();
      joinLobby(lobbyId);
    }
  }, [lobbyId]);

  const loadLobby = async () => {
    if (!lobbyId) return;
    
    try {
      const { data: lobbyData } = await client.models.GameLobby.get({ id: lobbyId });
      if (lobbyData) {
        setLobby(lobbyData);
        await loadPlayers(lobbyData.players || []);
      }
    } catch (error) {
      console.error('Error loading lobby:', error);
      toast.error('Failed to load lobby');
      navigate('/');
    } finally {
      setIsLoading(false);
    }
  };

  const loadPlayers = async (playerIds: string[]) => {
    try {
      const playerProfiles = await Promise.all(
        playerIds.map(async (playerId) => {
          const { data } = await client.models.UserProfile.list({
            filter: { id: { eq: playerId } }
          });
          return data[0];
        })
      );
      setPlayers(playerProfiles.filter(Boolean));
    } catch (error) {
      console.error('Error loading players:', error);
    }
  };

  const handleStartGame = async () => {
    if (!lobby || !user || lobby.hostId !== user.userId) return;
    
    setIsStarting(true);
    try {
      await startGame();
      navigate(`/game/${lobbyId}`);
    } catch (error) {
      console.error('Error starting game:', error);
      toast.error('Failed to start game');
    } finally {
      setIsStarting(false);
    }
  };

  const copyLobbyCode = () => {
    if (lobbyId) {
      navigator.clipboard.writeText(lobbyId);
      toast.success('Lobby code copied!');
    }
  };

  const isHost = user?.userId === lobby?.hostId;
  const canStart = isHost && players.length >= 2;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (!lobby) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-white mb-4">Lobby Not Found</h2>
        <p className="text-white/70 mb-6">This lobby doesn't exist or has been deleted.</p>
        <button onClick={() => navigate('/')} className="btn-primary">
          Back to Home
        </button>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-4xl mx-auto space-y-6"
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => navigate('/')}
          className="btn-secondary flex items-center space-x-2"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back</span>
        </button>
        
        <div className="text-center">
          <h1 className="text-3xl font-bold text-white">{lobby.name}</h1>
          <p className="text-white/70">Waiting for players...</p>
        </div>
        
        <div className="w-20" /> {/* Spacer */}
      </div>

      {/* Lobby Info */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Lobby Details */}
        <div className="card">
          <h3 className="text-lg font-semibold text-white mb-4">Lobby Details</h3>
          <div className="space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-white/70">Host:</span>
              <span className="text-white">{lobby.hostId}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-white/70">Players:</span>
              <span className="text-white">{players.length} / {lobby.maxPlayers}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-white/70">Status:</span>
              <span className="text-green-400">{lobby.gameState}</span>
            </div>
          </div>
          
          <div className="mt-4 pt-4 border-t border-white/10">
            <button
              onClick={copyLobbyCode}
              className="w-full btn-secondary flex items-center justify-center space-x-2"
            >
              <Copy className="w-4 h-4" />
              <span>Copy Lobby Code</span>
            </button>
          </div>
        </div>

        {/* Players List */}
        <div className="md:col-span-2 card">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-white flex items-center space-x-2">
              <Users className="w-5 h-5" />
              <span>Players ({players.length})</span>
            </h3>
            {isHost && (
              <Settings className="w-5 h-5 text-white/50" />
            )}
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {players.map((player, index) => (
              <motion.div
                key={player.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="flex items-center space-x-3 p-3 bg-white/5 rounded-lg"
              >
                <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white font-bold">
                  {player.username.charAt(0).toUpperCase()}
                </div>
                <div className="flex-1">
                  <div className="flex items-center space-x-2">
                    <span className="text-white font-medium">{player.username}</span>
                    {player.id === lobby.hostId && (
                      <Crown className="w-4 h-4 text-yellow-400" />
                    )}
                  </div>
                  <div className="text-xs text-white/60">
                    {player.crowns} crowns • {player.totalScore.toLocaleString()} pts
                  </div>
                </div>
              </motion.div>
            ))}
            
            {/* Empty slots */}
            {Array.from({ length: lobby.maxPlayers - players.length }).map((_, index) => (
              <div
                key={`empty-${index}`}
                className="flex items-center space-x-3 p-3 bg-white/5 rounded-lg border-2 border-dashed border-white/20"
              >
                <div className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center">
                  <Users className="w-5 h-5 text-white/40" />
                </div>
                <div className="text-white/40">Waiting for player...</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Game Controls */}
      {isHost && (
        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-white">Game Controls</h3>
              <p className="text-white/70 text-sm">
                {canStart 
                  ? 'Ready to start the game!' 
                  : `Need at least 2 players to start (${players.length}/2)`
                }
              </p>
            </div>
            
            <button
              onClick={handleStartGame}
              disabled={!canStart || isStarting}
              className="btn-success flex items-center space-x-2 px-8 py-3 text-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isStarting ? (
                <LoadingSpinner size="sm" />
              ) : (
                <>
                  <Play className="w-5 h-5" />
                  <span>Start Game</span>
                </>
              )}
            </button>
          </div>
        </div>
      )}

      {/* Waiting Message for Non-Hosts */}
      {!isHost && (
        <div className="card text-center">
          <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <Users className="w-8 h-8 text-white" />
          </div>
          <h3 className="text-xl font-semibold text-white mb-2">Waiting for Host</h3>
          <p className="text-white/70">
            The host will start the game when ready. Get ready to buzz in!
          </p>
        </div>
      )}
    </motion.div>
  );
}