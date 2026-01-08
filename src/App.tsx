import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Authenticator } from '@aws-amplify/ui-react';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './contexts/AuthContext';
import { GameProvider } from './contexts/GameContext';
import Layout from './components/Layout';
import HomePage from './pages/HomePage';
import LobbyPage from './pages/LobbyPage';
import GamePage from './pages/GamePage';
import ProfilePage from './pages/ProfilePage';
import LeaderboardPage from './pages/LeaderboardPage';
import AdminPage from './pages/AdminPage';
import FriendsPage from './pages/FriendsPage';

function App() {
  return (
    <Authenticator.Provider>
      <AuthProvider>
        <GameProvider>
          <Router>
            <div className="min-h-screen">
              <Toaster 
                position="top-right"
                toastOptions={{
                  duration: 4000,
                  style: {
                    background: 'rgba(0, 0, 0, 0.8)',
                    color: '#fff',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                  },
                }}
              />
              <Routes>
                <Route path="/" element={<Layout />}>
                  <Route index element={<HomePage />} />
                  <Route path="lobby/:lobbyId" element={<LobbyPage />} />
                  <Route path="game/:lobbyId" element={<GamePage />} />
                  <Route path="profile" element={<ProfilePage />} />
                  <Route path="leaderboard" element={<LeaderboardPage />} />
                  <Route path="friends" element={<FriendsPage />} />
                  <Route path="admin" element={<AdminPage />} />
                </Route>
              </Routes>
            </div>
          </Router>
        </GameProvider>
      </AuthProvider>
    </Authenticator.Provider>
  );
}

export default App;