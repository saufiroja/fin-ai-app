import { Avatar } from '@heroui/avatar';
import React from 'react';

interface Message {
  id: number;
  text: string;
  sender: 'user' | 'bot';
}

interface ChatMessageProps {
  message: Message;
}

export const ChatMessage: React.FC<ChatMessageProps> = ({ message }) => {
  const isUser = message.sender === 'user';

  return (
    <div
      className={`flex items-start gap-2 ${isUser ? 'flex-row-reverse' : ''}`}
    >
      <Avatar
        src={
          isUser
            ? 'https://img.heroui.chat/image/avatar?w=200&h=200&u=1'
            : 'https://img.heroui.chat/image/avatar?w=200&h=200&u=2'
        }
        size='sm'
      />
      <div
        className={`max-w-[70%] p-3 rounded-lg ${isUser ? 'bg-primary text-primary-foreground' : 'bg-content2'}`}
      >
        {message.text}
      </div>
    </div>
  );
};
