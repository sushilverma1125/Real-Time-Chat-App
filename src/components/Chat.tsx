import React, { useState, useEffect } from 'react';
import { Socket } from 'socket.io-client';
import MessageList from './MessageList';
import MessageInput from './MessageInput';
import UserList from './UserList';
import ChatHeader from './ChatHeader';

interface User {
  id: string;
  username: string;
  joinedAt: string;
  isOnline: boolean;
}

interface Message {
  id: number;
  text: string;
  username: string;
  userId: string;
  timestamp: string;
  delivered: boolean;
}

interface ChatProps {
  socket: Socket | null;
  user: User;
  onLogout: () => void;
  isConnected: boolean;
}

const Chat: React.FC<ChatProps> = ({ socket, user, onLogout, isConnected }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [typingUsers, setTypingUsers] = useState<string[]>([]);
  const [showUserList, setShowUserList] = useState(false);

  useEffect(() => {
    if (!socket) return;

    // Listen for chat history
    socket.on('chat_history', (history: Message[]) => {
      setMessages(history);
    });

    // Listen for new messages
    socket.on('receive_message', (message: Message) => {
      setMessages(prev => [...prev, message]);
      
      // Play notification sound for messages from other users
      if (message.userId !== socket.id) {
        playNotificationSound();
      }
    });

    // Listen for user updates
    socket.on('users_update', (userList: User[]) => {
      setUsers(userList);
    });

    // Listen for user joined
    socket.on('user_joined', (newUser: User) => {
      setMessages(prev => [...prev, {
        id: Date.now(),
        text: `${newUser.username} joined the chat`,
        username: 'System',
        userId: 'system',
        timestamp: new Date().toISOString(),
        delivered: true
      }]);
    });

    // Listen for user left
    socket.on('user_left', (leftUser: User) => {
      setMessages(prev => [...prev, {
        id: Date.now(),
        text: `${leftUser.username} left the chat`,
        username: 'System',
        userId: 'system',
        timestamp: new Date().toISOString(),
        delivered: true
      }]);
    });

    // Listen for typing indicators
    socket.on('user_typing', (typing: string[]) => {
      setTypingUsers(typing);
    });

    return () => {
      socket.off('chat_history');
      socket.off('receive_message');
      socket.off('users_update');
      socket.off('user_joined');
      socket.off('user_left');
      socket.off('user_typing');
    };
  }, [socket]);

  const playNotificationSound = () => {
    // Create a simple notification sound
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    oscillator.frequency.value = 800;
    oscillator.type = 'sine';
    
    gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3);
    
    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + 0.3);
  };

  const sendMessage = (text: string) => {
    if (socket && text.trim()) {
      socket.emit('send_message', { text: text.trim() });
    }
  };

  const handleTypingStart = () => {
    if (socket) {
      socket.emit('typing_start');
    }
  };

  const handleTypingStop = () => {
    if (socket) {
      socket.emit('typing_stop');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <div className="max-w-6xl mx-auto h-screen flex flex-col">
        <ChatHeader 
          user={user}
          onLogout={onLogout}
          isConnected={isConnected}
          onlineUsers={users.length}
          onToggleUserList={() => setShowUserList(!showUserList)}
        />
        
        <div className="flex-1 flex overflow-hidden">
          <div className="flex-1 flex flex-col bg-white/60 backdrop-blur-sm border-x border-white/20">
            <MessageList 
              messages={messages}
              currentUserId={socket?.id || ''}
              typingUsers={typingUsers}
            />
            <MessageInput 
              onSendMessage={sendMessage}
              onTypingStart={handleTypingStart}
              onTypingStop={handleTypingStop}
              disabled={!isConnected}
            />
          </div>
          
          <UserList 
            users={users}
            currentUserId={socket?.id || ''}
            isVisible={showUserList}
            onClose={() => setShowUserList(false)}
          />
        </div>
      </div>
    </div>
  );
};

export default Chat;