import React, { useState, useEffect } from 'react';
import { io, Socket } from 'socket.io-client';
import Login from './components/Login';
import Chat from './components/Chat';

interface User {
  id: string;
  username: string;
  joinedAt: string;
  isOnline: boolean;
}

function App() {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    const newSocket = io('http://localhost:3001');
    
    newSocket.on('connect', () => {
      setIsConnected(true);
      console.log('Connected to server');
    });

    newSocket.on('disconnect', () => {
      setIsConnected(false);
      console.log('Disconnected from server');
    });

    setSocket(newSocket);

    return () => {
      newSocket.close();
    };
  }, []);

  const handleLogin = (username: string) => {
    if (socket && username.trim()) {
      const userData = {
        username: username.trim(),
        joinedAt: new Date().toISOString(),
        isOnline: true
      };
      
      socket.emit('join', userData);
      setUser({
        id: socket.id || '',
        ...userData
      });
    }
  };

  const handleLogout = () => {
    if (socket) {
      socket.disconnect();
    }
    setUser(null);
    setIsConnected(false);
  };

  if (!user) {
    return <Login onLogin={handleLogin} isConnected={isConnected} />;
  }

  return (
    <Chat 
      socket={socket} 
      user={user} 
      onLogout={handleLogout}
      isConnected={isConnected}
    />
  );
}

export default App;