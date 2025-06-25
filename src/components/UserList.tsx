import React from 'react';
import { X, User, Crown } from 'lucide-react';

interface User {
  id: string;
  username: string;
  joinedAt: string;
  isOnline: boolean;
}

interface UserListProps {
  users: User[];
  currentUserId: string;
  isVisible: boolean;
  onClose: () => void;
}

const UserList: React.FC<UserListProps> = ({ users, currentUserId, isVisible, onClose }) => {
  const formatJoinTime = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    return `${diffDays}d ago`;
  };

  const sortedUsers = [...users].sort((a, b) => {
    // Current user first
    if (a.id === currentUserId) return -1;
    if (b.id === currentUserId) return 1;
    // Then by username
    return a.username.localeCompare(b.username);
  });

  return (
    <>
      {/* Mobile overlay */}
      {isVisible && (
        <div 
          className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 lg:hidden"
          onClick={onClose}
        />
      )}
      
      {/* User list panel */}
      <div className={`
        fixed lg:relative right-0 top-0 h-full w-80 bg-white/80 backdrop-blur-sm border-l border-white/20 z-50 transform transition-transform duration-300 ease-in-out
        ${isVisible ? 'translate-x-0' : 'translate-x-full lg:translate-x-0'}
        ${isVisible ? 'lg:block' : 'lg:hidden'}
      `}>
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-gray-800">Online Users ({users.length})</h3>
            <button
              onClick={onClose}
              className="p-1 hover:bg-gray-100 rounded-full transition-colors lg:hidden"
            >
              <X className="w-5 h-5 text-gray-500" />
            </button>
          </div>
        </div>
        
        <div className="flex-1 overflow-y-auto p-4">
          <div className="space-y-3">
            {sortedUsers.map(user => (
              <div
                key={user.id}
                className={`flex items-center space-x-3 p-3 rounded-lg transition-colors ${
                  user.id === currentUserId 
                    ? 'bg-blue-50 border border-blue-200' 
                    : 'hover:bg-gray-50'
                }`}
              >
                <div className="relative">
                  <div className="w-10 h-10 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full flex items-center justify-center">
                    <User className="w-5 h-5 text-white" />
                  </div>
                  <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 border-2 border-white rounded-full"></div>
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-2">
                    <p className="font-medium text-gray-900 truncate">
                      {user.username}
                    </p>
                    {user.id === currentUserId && (
                      <Crown className="w-4 h-4 text-yellow-500" />
                    )}
                  </div>
                  <p className="text-sm text-gray-500">
                    Joined {formatJoinTime(user.joinedAt)}
                  </p>
                </div>
              </div>
            ))}
          </div>
          
          {users.length === 0 && (
            <div className="text-center py-8">
              <User className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">No users online</p>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default UserList;