# ChatFlow - Real-Time Chat Application

A modern, real-time chat application built with React, Node.js, Express, and Socket.IO. Features a beautiful, responsive interface with real-time messaging, typing indicators, and user presence.

## Features

### Core Functionality
- **Real-time messaging** with Socket.IO
- **User authentication** (username-based, no password required)
- **Chat history** with message persistence
- **Online user list** with join/leave notifications
- **Typing indicators** to show when users are typing
- **Message delivery status** with read receipts
- **Sound notifications** for new messages

### User Experience
- **Responsive design** that works on desktop, tablet, and mobile
- **Modern UI** with gradient backgrounds and glass-morphism effects
- **Smooth animations** and micro-interactions
- **Real-time connection status** indicators
- **Message timestamps** with smart date grouping
- **Character counter** for message input (500 char limit)

### Technical Features
- **WebSocket communication** for real-time updates
- **In-memory message storage** (last 100 messages)
- **Concurrent development** with backend and frontend
- **Cross-origin resource sharing** (CORS) enabled
- **Error handling** and connection management

## Technology Stack

### Frontend
- **React 18** with TypeScript
- **Tailwind CSS** for styling
- **Lucide React** for icons
- **Socket.IO Client** for real-time communication
- **Vite** for development and building

### Backend
- **Node.js** with Express.js
- **Socket.IO** for WebSocket communication
- **CORS** for cross-origin requests
- **In-memory storage** for users and messages

## Quick Start

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd chatflow
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the application**
   ```bash
   npm run dev
   ```

   This command will start both the backend server (port 3001) and frontend development server (port 5173) concurrently.

4. **Open your browser**
   - Navigate to `http://localhost:5173`
   - Enter a username to join the chat
   - Open multiple browser tabs/windows to test real-time functionality

### Alternative: Start servers separately

If you prefer to run the servers separately:

```bash
# Terminal 1 - Backend server
npm run server

# Terminal 2 - Frontend development server
npm run client
```

## Application Architecture

### System Overview
The application follows a client-server architecture with real-time communication:

```
┌─────────────────┐     WebSocket     ┌─────────────────┐
│   React Client  │ ←──────────────→  │   Node.js API   │
│   (Frontend)    │     Socket.IO     │   (Backend)     │
└─────────────────┘                   └─────────────────┘
```

### Backend Architecture
- **Express.js Server**: Handles HTTP requests and Socket.IO connections
- **Socket.IO**: Manages real-time WebSocket connections
- **In-Memory Storage**: Stores active users and recent messages
- **Event Handlers**: Process join, message, typing, and disconnect events

### Frontend Architecture
- **React Components**: Modular UI components for different features
- **Socket.IO Client**: Handles real-time communication with the server
- **State Management**: React hooks for managing application state
- **Responsive Design**: Mobile-first approach with Tailwind CSS

### Data Flow

1. **User Authentication**: User enters username → Frontend emits 'join' event → Backend stores user data
2. **Messaging**: User types message → Frontend emits 'send_message' → Backend broadcasts to all clients
3. **Typing Indicators**: User starts typing → Frontend emits 'typing_start' → Backend notifies other users
4. **User Presence**: User connects/disconnects → Backend updates user list → Frontend updates UI

### Key Components

#### Frontend Components
- **Login**: User authentication interface
- **Chat**: Main chat container
- **ChatHeader**: Navigation and user info
- **MessageList**: Message display with history
- **MessageInput**: Message composition
- **UserList**: Online users sidebar

#### Backend Events
- **connection**: New user connects
- **join**: User joins chat room
- **send_message**: User sends message
- **typing_start/stop**: Typing indicators
- **disconnect**: User leaves chat

### Security Considerations
- **Input Validation**: Message length limits and sanitization
- **CORS Configuration**: Restricted to development origin
- **Rate Limiting**: Could be added for production use
- **Authentication**: Basic username system (can be enhanced)

### Scalability Features
- **Message Limit**: Only stores last 100 messages to prevent memory issues
- **Efficient Updates**: Only broadcasts necessary data changes
- **Modular Architecture**: Easy to add new features or modify existing ones

## Project Structure

```
chatflow/
├── server/
│   └── index.js              # Express server with Socket.IO
├── src/
│   ├── components/
│   │   ├── Chat.tsx          # Main chat interface
│   │   ├── ChatHeader.tsx    # Header with user info
│   │   ├── Login.tsx         # User authentication
│   │   ├── MessageInput.tsx  # Message composition
│   │   ├── MessageList.tsx   # Message display
│   │   └── UserList.tsx      # Online users sidebar
│   ├── App.tsx               # Main application component
│   ├── main.tsx              # React entry point
│   └── index.css             # Global styles
├── package.json              # Dependencies and scripts
└── README.md                 # This file
```

## Development Commands

```bash
# Start both frontend and backend
npm run dev

# Start only the backend server
npm run server

# Start only the frontend
npm run client

# Build for production
npm run build

# Preview production build
npm run preview

# Lint code
npm run lint
```

## Configuration

### Environment Variables
The application uses default ports:
- **Backend**: Port 3001
- **Frontend**: Port 5173

To modify these, update the respective configuration files:
- Backend port: `server/index.js`
- Frontend API endpoint: `src/App.tsx`

### Customization Options
- **Message Limit**: Modify the message history limit in `server/index.js`
- **Styling**: Update Tailwind classes in component files
- **Features**: Add new Socket.IO events for additional functionality

## Browser Compatibility
- Modern browsers with WebSocket support
- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## Performance Optimizations
- **Message Virtualization**: Could be added for very long chat histories
- **Connection Pooling**: Efficient Socket.IO connection management
- **Lazy Loading**: Components load only when needed
- **Debounced Typing**: Prevents excessive typing event emissions

## Future Enhancements
- **User Authentication**: Add proper login/signup system
- **File Sharing**: Support for image and file uploads
- **Private Messages**: Direct messaging between users
- **Chat Rooms**: Multiple chat channels
- **Message Persistence**: Database storage for chat history
- **Push Notifications**: Browser notifications for new messages
- **Message Reactions**: Emoji reactions to messages
- **User Profiles**: Avatars and user information

## Troubleshooting

### Common Issues

1. **Connection Failed**
   - Ensure backend server is running on port 3001
   - Check firewall settings
   - Verify CORS configuration

2. **Messages Not Sending**
   - Check browser console for errors
   - Verify Socket.IO connection status
   - Ensure backend is receiving events

3. **Styling Issues**
   - Clear browser cache
   - Check Tailwind CSS compilation
   - Verify all CSS dependencies are installed

### Debug Mode
Enable debug logging for Socket.IO:

```javascript
// In browser console
localStorage.debug = 'socket.io-client:socket';
```

## License
This project is open source and available under the MIT License.

## Contributing
Contributions are welcome! Please feel free to submit a Pull Request.