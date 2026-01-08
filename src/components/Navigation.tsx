import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { signOut } from 'aws-amplify/auth';
import { 
  Home, 
  Trophy, 
  Users, 
  User, 
  Settings, 
  LogOut,
  Crown,
  Zap
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { cn } from '../lib/utils';
import toast from 'react-hot-toast';

interface NavigationProps {
  signOut?: () => void;
}

export default function Navigation({ signOut: onSignOut }: NavigationProps) {
  const location = useLocation();
  const { userProfile } = useAuth();

  const handleSignOut = async () => {
    try {
      await signOut();
      toast.success('Signed out successfully');
      window.location.reload();
    } catch (error) {
      console.error('Sign out error:', error);
      toast.error('Failed to sign out');
    }
  };

  const navItems = [
    { path: '/', icon: Home, label: 'Home' },
    { path: '/leaderboard', icon: Trophy, label: 'Leaderboard' },
    { path: '/friends', icon: Users, label: 'Friends' },
    { path: '/profile', icon: User, label: 'Profile' },
  ];

  if (userProfile?.isAdmin) {
    navItems.push({ path: '/admin', icon: Settings, label: 'Admin' });
  }

  return (
    <nav className="bg-black/20 backdrop-blur-sm border-b border-white/10">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
              <Zap className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              Quiz Arena
            </span>
          </Link>

          {/* Navigation Items */}
          <div className="flex items-center space-x-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={cn(
                    'relative px-4 py-2 rounded-lg transition-colors duration-200',
                    isActive 
                      ? 'text-white' 
                      : 'text-white/70 hover:text-white hover:bg-white/10'
                  )}
                >
                  {isActive && (
                    <motion.div
                      layoutId="activeTab"
                      className="absolute inset-0 bg-white/20 rounded-lg"
                      initial={false}
                      transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                    />
                  )}
                  <div className="relative flex items-center space-x-2">
                    <Icon className="w-4 h-4" />
                    <span className="hidden sm:block">{item.label}</span>
                  </div>
                </Link>
              );
            })}
          </div>

          {/* User Info & Sign Out */}
          <div className="flex items-center space-x-4">
            {userProfile && (
              <div className="flex items-center space-x-2 text-sm">
                <div className="flex items-center space-x-1">
                  <Crown className="w-4 h-4 text-yellow-400" />
                  <span className="text-yellow-400 font-medium">
                    {userProfile.crowns}
                  </span>
                </div>
                <span className="text-white/70">|</span>
                <span className="text-white/90">{userProfile.username}</span>
              </div>
            )}
            
            <button
              onClick={handleSignOut}
              className="p-2 text-white/70 hover:text-white hover:bg-white/10 rounded-lg transition-colors duration-200"
              title="Sign Out"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}