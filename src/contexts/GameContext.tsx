import React, { createContext, useContext, useState, useEffect } from 'react';
import { client } from '../lib/amplify';
import type { Schema } from '../lib/amplify';
import { useAuth } from './AuthContext';

interface GameState {
  currentLobby: Schema['GameLobby']['type'] | null;
  currentSession: Schema['GameSession']['type'] | null;
  currentQuestion: any | null;
  questionIndex: number;
  timeLeft: number;
  buzzerPressed: boolean;
  canBuzz: boolean;
  gamePhase: 'waiting' | 'question' | 'buzzer' | 'answer' | 'finished';
}

interface GameContextType {
  gameState: GameState;
  joinLobby: (lobbyId: string) => Promise<void>;
  leaveLobby: () => void;
  pressBuzzer: () => void;
  submitAnswer: (answerIndex: number) => void;
  startGame: () => Promise<void>;
}

const initialGameState: GameState = {
  currentLobby: null,
  currentSession: null,
  currentQuestion: null,
  questionIndex: 0,
  timeLeft: 0,
  buzzerPressed: false,
  canBuzz: false,
  gamePhase: 'waiting',
};

const GameContext = createContext<GameContextType | undefined>(undefined);

export function GameProvider({ children }: { children: React.ReactNode }) {
  const [gameState, setGameState] = useState<GameState>(initialGameState);
  const { user } = useAuth();

  const joinLobby = async (lobbyId: string) => {
    try {
      const { data: lobby } = await client.models.GameLobby.get({ id: lobbyId });
      if (lobby) {
        setGameState(prev => ({ ...prev, currentLobby: lobby }));
        
        // Create or get game session
        const { data: sessions } = await client.models.GameSession.list({
          filter: {
            and: [
              { lobbyId: { eq: lobbyId } },
              { playerId: { eq: user?.userId || '' } }
            ]
          }
        });

        let session = sessions[0];
        if (!session) {
          const { data: newSession } = await client.models.GameSession.create({
            lobbyId,
            playerId: user?.userId || '',
            playerUsername: user?.username || 'Player',
            score: 0,
            answers: {},
            buzzerTimes: {},
            isWinner: false,
          });
          session = newSession;
        }

        if (session) {
          setGameState(prev => ({ ...prev, currentSession: session }));
        }
      }
    } catch (error) {
      console.error('Error joining lobby:', error);
    }
  };

  const leaveLobby = () => {
    setGameState(initialGameState);
  };

  const pressBuzzer = () => {
    if (gameState.canBuzz && !gameState.buzzerPressed) {
      setGameState(prev => ({ 
        ...prev, 
        buzzerPressed: true, 
        canBuzz: false,
        gamePhase: 'buzzer'
      }));
      
      // Record buzzer time
      const buzzerTime = Date.now();
      // TODO: Send buzzer event to backend
    }
  };

  const submitAnswer = (answerIndex: number) => {
    // TODO: Submit answer to backend
    console.log('Answer submitted:', answerIndex);
  };

  const startGame = async () => {
    if (gameState.currentLobby) {
      try {
        await client.models.GameLobby.update({
          id: gameState.currentLobby.id,
          gameState: 'IN_PROGRESS',
        });
        
        setGameState(prev => ({ 
          ...prev, 
          gamePhase: 'question',
          canBuzz: true,
          timeLeft: 30
        }));
      } catch (error) {
        console.error('Error starting game:', error);
      }
    }
  };

  // Subscribe to lobby updates
  useEffect(() => {
    if (gameState.currentLobby) {
      const subscription = client.models.GameLobby.observeQuery({
        filter: { id: { eq: gameState.currentLobby.id } }
      }).subscribe({
        next: ({ items }) => {
          if (items.length > 0) {
            setGameState(prev => ({ ...prev, currentLobby: items[0] }));
          }
        },
        error: (error) => console.error('Lobby subscription error:', error),
      });

      return () => subscription.unsubscribe();
    }
  }, [gameState.currentLobby?.id]);

  return (
    <GameContext.Provider value={{
      gameState,
      joinLobby,
      leaveLobby,
      pressBuzzer,
      submitAnswer,
      startGame,
    }}>
      {children}
    </GameContext.Provider>
  );
}

export function useGame() {
  const context = useContext(GameContext);
  if (context === undefined) {
    throw new Error('useGame must be used within a GameProvider');
  }
  return context;
}