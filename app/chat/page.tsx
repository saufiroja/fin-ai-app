'use client';
import { ChatMessage } from '@/components/chat-message';
import { useChatMessages } from '@/hooks/use-chat-message';
import { Button } from '@heroui/button';
import { Input } from '@heroui/input';
import { Navbar, NavbarBrand } from '@heroui/navbar';
import { ScrollShadow } from '@heroui/scroll-shadow';
import { Icon } from '@iconify/react';
import React from 'react';

export default function Chat() {
  const { messages, addMessage } = useChatMessages();
  const [newMessage, setNewMessage] = React.useState('');

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      addMessage({ id: Date.now(), text: newMessage, sender: 'user' });
      setNewMessage('');
    }
  };

  return (
    <div className='flex flex-col bg-background text-foreground h-[80vh]'>
      <ScrollShadow className='flex-grow p-4 space-y-4 overflow-y-auto'>
        {messages.map((message) => (
          <ChatMessage key={message.id} message={message} />
        ))}
      </ScrollShadow>

      <div className='p-4 border-t border-divider'>
        <div className='flex items-center gap-2'>
          <Input
            placeholder='Type a message...'
            value={newMessage}
            onValueChange={setNewMessage}
            onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
            endContent={
              <Button
                isIconOnly
                color='primary'
                variant='flat'
                onPress={handleSendMessage}
              >
                <Icon icon='lucide:send' className='text-xl' />
              </Button>
            }
          />
        </div>
      </div>
    </div>
  );
}
