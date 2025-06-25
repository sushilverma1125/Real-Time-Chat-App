import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import cors from 'cors';

const app = express();
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"]
  }
});

// Middleware
app.use(cors());
app.use(express.json());

// In-memory storage
let users = new Map();
let messages = [];
let typingUsers = new Set();

// Socket.IO connection handling
io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  // Handle user join
  socket.on('join', (userData) => {
    const user = {
      id: socket.id,
      username: userData.username,
      joinedAt: new Date().toISOString(),
      isOnline: true
    };
    
    users.set(socket.id, user);
    
    // Send current messages to the new user
    socket.emit('chat_history', messages);
    
    // Send current online users
    socket.emit('users_update', Array.from(users.values()));
    
    // Broadcast to all users that someone joined
    socket.broadcast.emit('user_joined', user);
    socket.broadcast.emit('users_update', Array.from(users.values()));
    
    console.log(`${userData.username} joined the chat`);
  });

  // Handle new messages
  socket.on('send_message', (messageData) => {
    const user = users.get(socket.id);
    if (!user) return;

    const message = {
      id: Date.now() + Math.random(),
      text: messageData.text,
      username: user.username,
      userId: socket.id,
      timestamp: new Date().toISOString(),
      delivered: true
    };

    messages.push(message);
    
    // Keep only last 100 messages
    if (messages.length > 100) {
      messages = messages.slice(-100);
    }

    // Broadcast message to all users
    io.emit('receive_message', message);
    
    console.log(`Message from ${user.username}: ${message.text}`);
  });

  // Handle typing indicators
  socket.on('typing_start', () => {
    const user = users.get(socket.id);
    if (!user) return;

    typingUsers.add(user.username);
    socket.broadcast.emit('user_typing', Array.from(typingUsers));
  });

  socket.on('typing_stop', () => {
    const user = users.get(socket.id);
    if (!user) return;

    typingUsers.delete(user.username);
    socket.broadcast.emit('user_typing', Array.from(typingUsers));
  });

  // Handle disconnection
  socket.on('disconnect', () => {
    const user = users.get(socket.id);
    if (user) {
      users.delete(socket.id);
      typingUsers.delete(user.username);
      
      // Broadcast to all users that someone left
      socket.broadcast.emit('user_left', user);
      socket.broadcast.emit('users_update', Array.from(users.values()));
      socket.broadcast.emit('user_typing', Array.from(typingUsers));
      
      console.log(`${user.username} left the chat`);
    }
  });
});

const PORT = process.env.PORT || 3001;

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});