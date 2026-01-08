import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Users, Hash, Tag } from 'lucide-react';
import { client } from '../lib/amplify';
import { useAuth } from '../contexts/AuthContext';
import type { Schema } from '../lib/amplify';
import LoadingSpinner from './LoadingSpinner';

interface CreateLobbyModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLobbyCreated: () => void;
}

export default function CreateLobbyModal({ isOpen, onClose, onLobbyCreated }: CreateLobbyModalProps) {
  const [lobbyName, setLobbyName] = useState('');
  const [maxPlayers, setMaxPlayers] = useState(4);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [categories, setCategories] = useState<Schema['QuestionCategory']['type'][]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingCategories, setIsLoadingCategories] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    if (isOpen) {
      loadCategories();
    }
  }, [isOpen]);

  const loadCategories = async () => {
    setIsLoadingCategories(true);
    try {
      const { data } = await client.models.QuestionCategory.list({
        filter: { isActive: { eq: true } }
      });
      setCategories(data);
      if (data.length > 0) {
        setSelectedCategory(data[0].id);
      }
    } catch (error) {
      console.error('Error loading categories:', error);
    } finally {
      setIsLoadingCategories(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!lobbyName.trim() || !selectedCategory || !user) return;

    setIsLoading(true);
    try {
      const { data: lobby } = await client.models.GameLobby.create({
        name: lobbyName.trim(),
        hostId: user.userId,
        players: [user.userId],
        maxPlayers,
        categoryId: selectedCategory,
        isActive: true,
        gameState: 'WAITING',
        currentQuestionIndex: 0,
        questions: [],
      });

      if (lobby) {
        onLobbyCreated();
        onClose();
        resetForm();
      }
    } catch (error) {
      console.error('Error creating lobby:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setLobbyName('');
    setMaxPlayers(4);
    setSelectedCategory('');
  };

  const handleClose = () => {
    if (!isLoading) {
      onClose();
      resetForm();
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={handleClose}
          />
          
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="relative w-full max-w-md card"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-white">Create Lobby</h2>
              <button
                onClick={handleClose}
                disabled={isLoading}
                className="p-2 text-white/70 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-white/80 mb-2">
                  <Hash className="w-4 h-4 inline mr-1" />
                  Lobby Name
                </label>
                <input
                  type="text"
                  value={lobbyName}
                  onChange={(e) => setLobbyName(e.target.value)}
                  placeholder="Enter lobby name..."
                  className="input"
                  required
                  disabled={isLoading}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-white/80 mb-2">
                  <Users className="w-4 h-4 inline mr-1" />
                  Max Players
                </label>
                <select
                  value={maxPlayers}
                  onChange={(e) => setMaxPlayers(Number(e.target.value))}
                  className="input"
                  disabled={isLoading}
                >
                  {[2, 3, 4, 5, 6, 7, 8].map(num => (
                    <option key={num} value={num}>{num} Players</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-white/80 mb-2">
                  <Tag className="w-4 h-4 inline mr-1" />
                  Category
                </label>
                {isLoadingCategories ? (
                  <div className="flex items-center justify-center py-4">
                    <LoadingSpinner size="sm" />
                  </div>
                ) : (
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="input"
                    required
                    disabled={isLoading}
                  >
                    <option value="">Select a category...</option>
                    {categories.map(category => (
                      <option key={category.id} value={category.id}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                )}
              </div>

              <div className="flex space-x-3 pt-4">
                <button
                  type="button"
                  onClick={handleClose}
                  disabled={isLoading}
                  className="btn-secondary flex-1"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isLoading || !lobbyName.trim() || !selectedCategory}
                  className="btn-primary flex-1 flex items-center justify-center space-x-2"
                >
                  {isLoading ? (
                    <LoadingSpinner size="sm" />
                  ) : (
                    <>
                      <span>Create Lobby</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}