import React, { useEffect, useRef } from 'react';
import { Check, CheckCheck } from 'lucide-react';

interface Message {
  id: number;
  text: string;
  username: string;
  userId: string;
  timestamp: string;
  delivered: boolean;
}

interface MessageListProps {
  messages: Message[];
  currentUserId: string;
  typingUsers: string[];
}

const MessageList: React.FC<MessageListProps> = ({ messages, currentUserId, typingUsers }) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, typingUsers]);

  const formatTime = (timestamp: string) => {
    return new Date(timestamp).toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  const formatDate = (timestamp: string) => {
    const date = new Date(timestamp);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today.toDateString()) {
      return 'Today';
    } else if (date.toDateString() === yesterday.toDateString()) {
      return 'Yesterday';
    } else {
      return date.toLocaleDateString();
    }
  };

  const shouldShowDate = (currentMessage: Message, previousMessage?: Message) => {
    if (!previousMessage) return true;
    
    const currentDate = new Date(currentMessage.timestamp).toDateString();
    const previousDate = new Date(previousMessage.timestamp).toDateString();
    
    return currentDate !== previousDate;
  };

  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-4">
      {messages.map((message, index) => {
        const isCurrentUser = message.userId === currentUserId;
        const isSystem = message.userId === 'system';
        const showDate = shouldShowDate(message, messages[index - 1]);

        return (
          <div key={message.id}>
            {showDate && (
              <div className="text-center my-4">
                <span className="bg-gray-200 text-gray-600 px-3 py-1 rounded-full text-xs">
                  {formatDate(message.timestamp)}
                </span>
              </div>
            )}
            
            {isSystem ? (
              <div className="text-center">
                <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
                  {message.text}
                </span>
              </div>
            ) : (
              <div className={`flex ${isCurrentUser ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-xs lg:max-w-md ${isCurrentUser ? 'order-2' : 'order-1'}`}>
                  {!isCurrentUser && (
                    <div className="text-xs text-gray-500 mb-1 px-3">
                      {message.username}
                    </div>
                  )}
                  <div
                    className={`px-4 py-2 rounded-2xl ${
                      isCurrentUser
                        ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-br-md'
                        : 'bg-white border border-gray-200 text-gray-800 rounded-bl-md'
                    }`}
                  >
                    <p className="text-sm leading-relaxed">{message.text}</p>
                    <div className={`flex items-center justify-end space-x-1 mt-1 ${
                      isCurrentUser ? 'text-blue-100' : 'text-gray-500'
                    }`}>
                      <span className="text-xs">{formatTime(message.timestamp)}</span>
                      {isCurrentUser && (
                        <div className="text-xs">
                          {message.delivered ? (
                            <CheckCheck className="w-3 h-3" />
                          ) : (
                            <Check className="w-3 h-3" />
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        );
      })}

      {typingUsers.length > 0 && (
        <div className="flex justify-start">
          <div className="bg-gray-100 rounded-2xl rounded-bl-md px-4 py-3 max-w-xs">
            <div className="flex items-center space-x-2">
              <div className="flex space-x-1">
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
              </div>
              <span className="text-xs text-gray-500">
                {typingUsers.length === 1 
                  ? `${typingUsers[0]} is typing...`
                  : `${typingUsers.length} people are typing...`
                }
              </span>
            </div>
          </div>
        </div>
      )}

      <div ref={messagesEndRef} />
    </div>
  );
};

export default MessageList;