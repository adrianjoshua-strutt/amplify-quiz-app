import React, { createContext, useContext, useEffect, useState } from 'react';
import { getCurrentUser, fetchUserAttributes, type AuthUser } from 'aws-amplify/auth';
import { client } from '../lib/amplify';
import type { Schema } from '../lib/amplify';

interface AuthContextType {
  user: AuthUser | null;
  userProfile: Schema['UserProfile']['type'] | null;
  isLoading: boolean;
  refreshProfile: () => Promise<void>;
  loadUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [userProfile, setUserProfile] = useState<Schema['UserProfile']['type'] | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const loadUser = async () => {
    setIsLoading(true);
    try {
      const currentUser = await getCurrentUser();
      setUser(currentUser);
      
      const attributes = await fetchUserAttributes();
      await loadUserProfile(currentUser.userId, attributes);
    } catch (error) {
      console.log('No authenticated user');
      setUser(null);
      setUserProfile(null);
    } finally {
      setIsLoading(false);
    }
  };

  const loadUserProfile = async (userId: string, attributes: any) => {
    try {
      // Try to get existing profile
      const { data: profiles } = await client.models.UserProfile.list({
        filter: { id: { eq: userId } }
      });

      if (profiles.length > 0) {
        setUserProfile(profiles[0]);
      } else {
        // Create new profile
        const { data: newProfile } = await client.models.UserProfile.create({
          id: userId,
          username: attributes.preferred_username || attributes.email?.split('@')[0] || 'User',
          email: attributes.email || '',
          crowns: 0,
          totalScore: 0,
          gamesPlayed: 0,
          gamesWon: 0,
          friends: [],
          isAdmin: false,
        });
        
        if (newProfile) {
          setUserProfile(newProfile);
        }
      }
    } catch (error) {
      console.error('Error loading user profile:', error);
    }
  };

  const refreshProfile = async () => {
    if (user) {
      const attributes = await fetchUserAttributes();
      await loadUserProfile(user.userId, attributes);
    } else {
      await loadUser();
    }
  };

  useEffect(() => {
    loadUser();
  }, []);

  return (
    <AuthContext.Provider value={{ user, userProfile, isLoading, refreshProfile, loadUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}