import React from 'react';
import { LogOut, Users, Wifi, WifiOff, MessageCircle } from 'lucide-react';

interface User {
  id: string;
  username: string;
  joinedAt: string;
  isOnline: boolean;
}

interface ChatHeaderProps {
  user: User;
  onLogout: () => void;
  isConnected: boolean;
  onlineUsers: number;
  onToggleUserList: () => void;
}

const ChatHeader: React.FC<ChatHeaderProps> = ({ 
  user, 
  onLogout, 
  isConnected, 
  onlineUsers,
  onToggleUserList 
}) => {
  return (
    <header className="bg-white/80 backdrop-blur-sm border-b border-white/20 p-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
              <MessageCircle className="w-5 h-5 text-white" />
            </div>
            <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              ChatFlow
            </h1>
          </div>
          
          <div className="flex items-center space-x-3">
            <div className={`flex items-center space-x-1 px-2 py-1 rounded-full text-xs ${
              isConnected 
                ? 'bg-green-100 text-green-800' 
                : 'bg-red-100 text-red-800'
            }`}>
              {isConnected ? (
                <Wifi className="w-3 h-3" />
              ) : (
                <WifiOff className="w-3 h-3" />
              )}
              <span>{isConnected ? 'Online' : 'Offline'}</span>
            </div>
            
            <button
              onClick={onToggleUserList}
              className="flex items-center space-x-1 px-3 py-1 rounded-full bg-blue-100 text-blue-800 hover:bg-blue-200 transition-colors text-sm"
            >
              <Users className="w-4 h-4" />
              <span>{onlineUsers} online</span>
            </button>
          </div>
        </div>

        <div className="flex items-center space-x-4">
          <div className="text-sm text-gray-600">
            Welcome, <span className="font-semibold text-gray-800">{user.username}</span>
          </div>
          
          <button
            onClick={onLogout}
            className="flex items-center space-x-2 px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
          >
            <LogOut className="w-4 h-4" />
            <span className="hidden sm:inline">Logout</span>
          </button>
        </div>
      </div>
    </header>
  );
};

export default ChatHeader;