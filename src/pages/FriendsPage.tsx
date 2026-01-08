import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Users, UserPlus, Search, Crown, Trophy, MessageCircle, X, Check } from 'lucide-react';
import { client } from '../lib/amplify';
import { useAuth } from '../contexts/AuthContext';
import type { Schema } from '../lib/amplify';
import LoadingSpinner from '../components/LoadingSpinner';
import toast from 'react-hot-toast';

export default function FriendsPage() {
  const [friends, setFriends] = useState<Schema['UserProfile']['type'][]>([]);
  const [friendRequests, setFriendRequests] = useState<Schema['FriendRequest']['type'][]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<Schema['UserProfile']['type'][]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSearching, setIsSearching] = useState(false);
  const { user, userProfile } = useAuth();

  useEffect(() => {
    loadFriendsData();
  }, []);

  useEffect(() => {
    if (searchQuery.trim()) {
      searchUsers();
    } else {
      setSearchResults([]);
    }
  }, [searchQuery]);

  const loadFriendsData = async () => {
    if (!user || !userProfile) return;
    
    try {
      // Load friends
      if (userProfile.friends && userProfile.friends.length > 0) {
        const friendProfiles = await Promise.all(
          userProfile.friends.map(async (friendId) => {
            const { data } = await client.models.UserProfile.list({
              filter: { id: { eq: friendId } }
            });
            return data[0];
          })
        );
        setFriends(friendProfiles.filter(Boolean));
      }

      // Load friend requests
      const { data: requests } = await client.models.FriendRequest.list({
        filter: {
          or: [
            { fromUserId: { eq: user.userId } },
            { toUserId: { eq: user.userId } }
          ]
        }
      });
      setFriendRequests(requests);
    } catch (error) {
      console.error('Error loading friends data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const searchUsers = async () => {
    if (!searchQuery.trim() || !user) return;
    
    setIsSearching(true);
    try {
      const { data } = await client.models.UserProfile.list({
        filter: {
          and: [
            { username: { contains: searchQuery.trim() } },
            { id: { ne: user.userId } } // Exclude self
          ]
        }
      });
      
      // Filter out existing friends
      const filteredResults = data.filter(profile => 
        !userProfile?.friends?.includes(profile.id)
      );
      
      setSearchResults(filteredResults);
    } catch (error) {
      console.error('Error searching users:', error);
    } finally {
      setIsSearching(false);
    }
  };

  const sendFriendRequest = async (toUserId: string, toUsername: string) => {
    if (!user || !userProfile) return;
    
    try {
      // Check if request already exists
      const existingRequest = friendRequests.find(req => 
        (req.fromUserId === user.userId && req.toUserId === toUserId) ||
        (req.fromUserId === toUserId && req.toUserId === user.userId)
      );
      
      if (existingRequest) {
        toast.error('Friend request already exists');
        return;
      }

      await client.models.FriendRequest.create({
        fromUserId: user.userId,
        fromUsername: userProfile.username,
        toUserId,
        toUsername,
        status: 'PENDING',
      });
      
      toast.success('Friend request sent!');
      loadFriendsData();
    } catch (error) {
      console.error('Error sending friend request:', error);
      toast.error('Failed to send friend request');
    }
  };

  const acceptFriendRequest = async (request: Schema['FriendRequest']['type']) => {
    if (!user || !userProfile) return;
    
    try {
      // Update request status
      await client.models.FriendRequest.update({
        id: request.id,
        status: 'ACCEPTED',
      });

      // Add to both users' friend lists
      const friendId = request.fromUserId === user.userId ? request.toUserId : request.fromUserId;
      
      await client.models.UserProfile.update({
        id: user.userId,
        friends: [...(userProfile.friends || []), friendId],
      });

      toast.success('Friend request accepted!');
      loadFriendsData();
    } catch (error) {
      console.error('Error accepting friend request:', error);
      toast.error('Failed to accept friend request');
    }
  };

  const declineFriendRequest = async (requestId: string) => {
    try {
      await client.models.FriendRequest.update({
        id: requestId,
        status: 'DECLINED',
      });
      
      toast.success('Friend request declined');
      loadFriendsData();
    } catch (error) {
      console.error('Error declining friend request:', error);
      toast.error('Failed to decline friend request');
    }
  };

  const pendingRequests = friendRequests.filter(req => 
    req.status === 'PENDING' && req.toUserId === user?.userId
  );

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <LoadingSpinner size="lg" />
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
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
          Friends & Community
        </h1>
        <p className="text-xl text-white/80">
          Connect with other quiz masters and challenge your friends!
        </p>
      </div>

      {/* Search Users */}
      <div className="card">
        <h2 className="text-2xl font-bold text-white mb-4 flex items-center space-x-2">
          <UserPlus className="w-6 h-6" />
          <span>Find Friends</span>
        </h2>
        
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-white/50" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by username..."
            className="input pl-10"
          />
          {isSearching && (
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
              <LoadingSpinner size="sm" />
            </div>
          )}
        </div>

        {searchResults.length > 0 && (
          <div className="mt-4 space-y-2">
            {searchResults.map((profile) => (
              <div key={profile.id} className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white font-bold">
                    {profile.username.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <h3 className="font-semibold text-white">{profile.username}</h3>
                    <div className="flex items-center space-x-3 text-sm text-white/60">
                      <span>{profile.crowns || 0} crowns</span>
                      <span>•</span>
                      <span>{(profile.totalScore || 0).toLocaleString()} points</span>
                    </div>
                  </div>
                </div>
                
                <button
                  onClick={() => sendFriendRequest(profile.id, profile.username)}
                  className="btn-primary flex items-center space-x-2"
                >
                  <UserPlus className="w-4 h-4" />
                  <span>Add Friend</span>
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Friend Requests */}
      {pendingRequests.length > 0 && (
        <div className="card">
          <h2 className="text-2xl font-bold text-white mb-4 flex items-center space-x-2">
            <MessageCircle className="w-6 h-6" />
            <span>Friend Requests ({pendingRequests.length})</span>
          </h2>
          
          <div className="space-y-3">
            {pendingRequests.map((request) => (
              <motion.div
                key={request.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="flex items-center justify-between p-4 bg-blue-500/10 border border-blue-500/20 rounded-lg"
              >
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold">
                    {request.fromUsername.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <h3 className="font-semibold text-white">{request.fromUsername}</h3>
                    <p className="text-sm text-white/70">wants to be your friend</p>
                  </div>
                </div>
                
                <div className="flex space-x-2">
                  <button
                    onClick={() => acceptFriendRequest(request)}
                    className="btn-success flex items-center space-x-1 px-3 py-2"
                  >
                    <Check className="w-4 h-4" />
                    <span>Accept</span>
                  </button>
                  <button
                    onClick={() => declineFriendRequest(request.id)}
                    className="btn-danger flex items-center space-x-1 px-3 py-2"
                  >
                    <X className="w-4 h-4" />
                    <span>Decline</span>
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {/* Friends List */}
      <div className="card">
        <h2 className="text-2xl font-bold text-white mb-4 flex items-center space-x-2">
          <Users className="w-6 h-6" />
          <span>My Friends ({friends.length})</span>
        </h2>
        
        {friends.length === 0 ? (
          <div className="text-center py-12">
            <Users className="w-16 h-16 text-white/40 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-white/80 mb-2">No Friends Yet</h3>
            <p className="text-white/60 mb-6">Search for users above to start building your quiz community!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {friends.map((friend, index) => (
              <motion.div
                key={friend.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="p-4 bg-white/5 rounded-lg hover:bg-white/10 transition-all duration-200"
              >
                <div className="flex items-center space-x-3 mb-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white font-bold">
                    {friend.username.charAt(0).toUpperCase()}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-white">{friend.username}</h3>
                    <div className="flex items-center space-x-2 text-sm text-white/60">
                      <Crown className="w-3 h-3 text-yellow-400" />
                      <span>{friend.crowns || 0} crowns</span>
                    </div>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="text-center p-2 bg-white/5 rounded">
                    <div className="text-white font-bold">{(friend.totalScore || 0).toLocaleString()}</div>
                    <div className="text-white/60">Total Score</div>
                  </div>
                  <div className="text-center p-2 bg-white/5 rounded">
                    <div className="text-white font-bold">{friend.gamesWon || 0}</div>
                    <div className="text-white/60">Games Won</div>
                  </div>
                </div>
                
                <div className="mt-3 flex space-x-2">
                  <button className="btn-primary flex-1 text-sm py-2">
                    Challenge
                  </button>
                  <button className="btn-secondary flex-1 text-sm py-2">
                    Message
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </motion.div>
  );
}