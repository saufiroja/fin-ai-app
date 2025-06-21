'use client';
import React from 'react';
import { Card, CardBody, CardHeader } from '@heroui/card';
import { Avatar, AvatarGroup } from '@heroui/avatar';
import {
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
} from '@heroui/dropdown';
import { Input, Textarea } from '@heroui/input';
import { Button } from '@heroui/button';
import { Divider } from '@heroui/divider';
import { ScrollShadow } from '@heroui/scroll-shadow';
import { Chip } from '@heroui/chip';
import { Badge } from '@heroui/badge';
import { Spacer } from '@heroui/spacer';
import { Icon } from '@iconify/react';
import { ChatMessage } from '@/components/chat-message';
import { useChatMessages } from '@/hooks/use-chat-message';

export default function ChatPage() {
  const { messages, addMessage } = useChatMessages();
  const [newMessage, setNewMessage] = React.useState('');
  const [selectedChat, setSelectedChat] = React.useState('New Chat');
  const [isTyping, setIsTyping] = React.useState(false);
  const [sidebarOpen, setSidebarOpen] = React.useState(false);

  // Enhanced chat history with more metadata
  const chatHistory = [
    {
      id: 1,
      title: 'New Chat',
    },
    {
      id: 2,
      title: 'Budgeting Tips',
    },
    {
      id: 3,
      title: 'Investment Advice',
    },
    {
      id: 4,
      title: 'Expense Tracking',
    },
    {
      id: 5,
      title: 'Financial Planning',
    },
    {
      id: 6,
      title: 'Tax Preparation',
    },
    {
      id: 7,
      title: 'Retirement Savings',
    },
    {
      id: 8,
      title: 'Debt Management',
    },
    {
      id: 9,
      title: 'Insurance Review',
    },
    {
      id: 10,
      title: 'Estate Planning',
    },
    {
      id: 11,
      title: 'Financial Goals',
    },
    {
      id: 12,
      title: 'Investment Portfolio',
    },
    {
      id: 13,
      title: 'Market Analysis',
    },
    {
      id: 14,
      title: 'Financial News',
    },
    {
      id: 15,
      title: 'Wealth Management',
    },
    {
      id: 16,
      title: 'Savings Strategies',
    },
    {
      id: 17,
      title: 'Cash Flow Management',
    },
    {
      id: 18,
      title: 'Financial Literacy',
    },
    {
      id: 19,
      title: 'Investment Research',
    },
    {
      id: 20,
      title: 'Financial Tools',
    },
  ];

  const suggestedPrompts = [
    {
      icon: 'lucide:wallet',
      text: 'Help me create a monthly budget',
      color: 'primary',
    },
    {
      icon: 'lucide:search',
      text: 'Search my expenses by category',
      color: 'secondary',
    },
    {
      icon: 'lucide:trending-down',
      text: 'Track monthly expenses',
      color: 'success',
    },
    {
      icon: 'lucide:bar-chart-3',
      text: 'Analyze spending patterns',
      color: 'warning',
    },
    {
      icon: 'lucide:target',
      text: 'Set savings goals',
      color: 'danger',
    },
    {
      icon: 'lucide:credit-card',
      text: 'Categorize transactions',
      color: 'primary',
    },
  ];

  const actions = [
    {
      key: 'rename',
      label: 'Rename chat',
      icon: 'lucide:edit-2',
      color: 'primary',
    },
    {
      key: 'archive',
      label: 'Archive chat',
      icon: 'lucide:archive',
      color: 'secondary',
    },
    {
      key: 'delete',
      label: 'Delete chat',
      icon: 'lucide:trash-2',
      color: 'danger',
    },
  ];

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      addMessage({
        id: Date.now(),
        text: newMessage,
        sender: 'user',
      });
      setNewMessage('');
      setIsTyping(true);

      // Simulate AI response delay
      setTimeout(() => {
        setIsTyping(false);
      }, 2000);
    }
  };

  const handleNewChat = () => {
    setSelectedChat('New Chat');
    setSidebarOpen(false); // Close sidebar on mobile after new chat
  };

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <div className='flex h-[calc(100vh-2rem)] md:h-[calc(93vh-2rem)] bg-gradient-to-br from-background to-content1 rounded-none md:rounded-3xl overflow-hidden shadow-2xl relative'>
      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div
          className='fixed inset-0 bg-black/50 z-40 md:hidden'
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Enhanced Sidebar */}
      <Card
        className={`
        w-80 bg-content1/80 backdrop-blur-xl shadow-none rounded-none z-50 flex flex-col
        fixed md:relative inset-y-0 left-0 transform transition-transform duration-300 ease-in-out
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
        md:w-80 md:block
      `}
      >
        {/* Header Section - Fixed */}
        <CardHeader className='pb-4 flex-shrink-0'>
          <div className='flex flex-col w-full gap-4'>
            {/* Brand Header */}
            <div className='flex items-center gap-3'>
              <div className='w-10 h-10 bg-gradient-to-br from-primary to-secondary rounded-xl flex items-center justify-center shadow-lg'>
                <Icon
                  icon='lucide:briefcase'
                  className='text-primary-foreground text-xl'
                />
              </div>
              <div>
                <h1 className='font-bold text-xl bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent'>
                  Fin-AI
                </h1>
                <p className='text-xs text-default-500'>
                  Smart Financial Assistant
                </p>
              </div>
            </div>

            {/* Search Input */}
            <Input
              placeholder='Search conversations...'
              startContent={
                <Icon icon='lucide:search' className='text-default-400' />
              }
              variant='bordered'
              size='sm'
              radius='lg'
              classNames={{
                inputWrapper:
                  'border-divider/50 bg-content2/50 backdrop-blur-sm hover:bg-content2/80 transition-all',
              }}
            />

            {/* New Chat Button */}
            <Button
              color='primary'
              variant='shadow'
              size='md'
              startContent={<Icon icon='lucide:message-square' />}
              className='w-full justify-start font-semibold bg-gradient-to-r from-primary to-secondary'
              onPress={handleNewChat}
              radius='lg'
            >
              New Conversation
            </Button>
          </div>
        </CardHeader>

        {/* Chat History - Scrollable */}
        <CardBody className='pt-0 flex-1 overflow-hidden flex flex-col'>
          <div className='flex flex-col h-full'>
            {/* Recent Conversations Label */}
            <p className='text-sm font-medium text-default-600 tracking-wide mb-3 px-1 flex-shrink-0'>
              Recent Chats
            </p>

            {/* Scrollable Chat List */}
            <div className='flex-1 overflow-hidden'>
              <ScrollShadow
                hideScrollBar
                className='overflow-y-auto w-full h-[calc(100vh-10rem)] md:h-auto' // Hapus px-2
                style={{ maxHeight: 'calc(100vh - 10rem)' }}
              >
                <div className='space-y-2'>
                  {chatHistory.map((chat) => (
                    <div key={chat.id} className='relative group'>
                      <Card
                        isPressable
                        className='w-full p-0 transition-all duration-200 bg-content2/50 hover:bg-content2/80 hover:shadow-lg shadow-none' // Hapus md:w-[calc(100% - 1rem)]
                        onPress={() => {
                          setSelectedChat(chat.title);
                          setSidebarOpen(false); // Close sidebar on mobile
                        }}
                        radius='md'
                      >
                        <CardBody className='py-2 px-4 relative'>
                          <div className='flex items-center justify-between'>
                            <div className='flex items-center gap-2 w-full'>
                              <div className='w-full'>
                                <h4 className='text-sm font-medium truncate max-w-full block'>
                                  {chat.title}
                                </h4>
                              </div>
                            </div>
                          </div>
                          {/* Action Dropdown absolutely positioned, not inside Card/Button */}
                          <div className='absolute right-2 top-2 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity z-10'>
                            <Dropdown placement='bottom-end'>
                              <DropdownTrigger>
                                <span
                                  tabIndex={0}
                                  role='button'
                                  aria-label='Open chat actions'
                                  onClick={(e) => e.stopPropagation()}
                                  className='min-w-6 w-6 h-6 bg-content1/80 backdrop-blur-sm rounded-full flex items-center justify-center cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary'
                                >
                                  <Icon
                                    icon='lucide:more-horizontal'
                                    className='text-xs'
                                  />
                                </span>
                              </DropdownTrigger>
                              <DropdownMenu
                                aria-label='Chat actions'
                                closeOnSelect
                                className='bg-content1/95 rounded-lg p-1 min-w-[140px] border border-divider/20 block md:absolute md:left-0 md:top-full'
                                items={actions}
                              >
                                {actions.map((action) => (
                                  <DropdownItem
                                    key={action.key}
                                    startContent={
                                      <Icon icon={`${action.icon}`} />
                                    }
                                    className={`text-sm text-${action.color}-600 hover:bg-${action.color}-100`}
                                  >
                                    {action.label}
                                  </DropdownItem>
                                ))}
                              </DropdownMenu>
                            </Dropdown>
                          </div>
                        </CardBody>
                      </Card>
                    </div>
                  ))}
                </div>
              </ScrollShadow>
            </div>
          </div>
        </CardBody>
      </Card>

      {/* Main Chat Area */}
      <div className='flex-1 flex flex-col bg-content1/30 backdrop-blur-xl w-full relative'>
        {/* Fixed Header */}
        <div className='sticky top-0 z-30 bg-content1/80 backdrop-blur-xl w-full'>
          {/* Enhanced Chat Header */}
          <div className='py-3 md:py-4 flex items-center justify-between'>
            <div className='flex items-center gap-3 md:gap-4'>
              {/* Mobile Menu Button */}
              <Button
                isIconOnly
                size='sm'
                variant='light'
                onPress={toggleSidebar}
                className='md:hidden'
                radius='full'
              >
                <Icon icon='lucide:menu' className='text-lg' />
              </Button>
            </div>
          </div>
        </div>
        {/* Messages Area */}
        <ScrollShadow
          hideScrollBar
          className='flex-1 overflow-y-auto p-4 md:p-6 space-y-4 bg-content2/50 backdrop-blur-sm'
        >
          {messages.length === 0 ? (
            <div className='flex flex-col items-center justify-center h-full text-center max-w-2xl mx-auto px-4'>
              <div className='relative mb-6 md:mb-8'>
                <div className='w-20 h-20 md:w-24 md:h-24 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-3xl flex items-center justify-center backdrop-blur-sm border border-divider/30 shadow-2xl'>
                  <Icon
                    icon='lucide:briefcase'
                    className='text-primary text-3xl md:text-4xl'
                  />
                </div>
                <div className='absolute -top-2 -right-2 w-6 h-6 md:w-8 md:h-8 bg-gradient-to-r from-primary to-secondary rounded-full flex items-center justify-center shadow-lg'>
                  <Icon
                    icon='lucide:sparkles'
                    className='text-white text-xs md:text-sm bg-transparent'
                  />
                </div>
              </div>

              <h3 className='text-2xl md:text-3xl font-bold mb-3 md:mb-4 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent'>
                Welcome to Fin-AI
              </h3>
              <p className='text-default-500 text-base md:text-lg mb-6 md:mb-8 leading-relaxed'>
                Your intelligent financial assistant. Ask me anything about
                budgeting, investments, or financial planning. I'm here to help
                you make informed decisions and manage your finances
                effectively.
              </p>

              {/* Suggested Prompts */}
              <div className='grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4 w-full max-w-2xl'>
                {suggestedPrompts.map((prompt, index) => (
                  <Card
                    key={index}
                    isPressable
                    className='p-3 md:p-4 hover:scale-105 transition-all duration-200 bg-content2/50 backdrop-blur-sm border-divider/30'
                    radius='lg'
                  >
                    <div className='flex items-center gap-3'>
                      <div
                        className={`w-8 h-8 md:w-10 md:h-10 bg-${prompt.color}/20 rounded-xl flex items-center justify-center`}
                      >
                        <Icon
                          icon={prompt.icon}
                          className={`text-${prompt.color} text-base md:text-lg`}
                        />
                      </div>
                      <span className='font-medium text-sm md:text-base'>
                        {prompt.text}
                      </span>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          ) : (
            <div className='space-y-4 md:space-y-6 max-w-4xl mx-auto w-full'>
              {messages.map((message) => (
                <ChatMessage key={message.id} message={message} />
              ))}
              {isTyping && (
                <div className='flex items-center gap-3 px-2 md:px-4'>
                  <Avatar
                    size='sm'
                    className='bg-gradient-to-br from-primary to-secondary'
                    name='LA'
                  />
                  <Card className='bg-content2/80 backdrop-blur-sm border-divider/30'>
                    <CardBody className='py-2 md:py-3 px-3 md:px-4'>
                      <div className='flex items-center gap-1'>
                        <div className='w-2 h-2 bg-primary rounded-full animate-bounce' />
                        <div
                          className='w-2 h-2 bg-primary rounded-full animate-bounce'
                          style={{ animationDelay: '0.1s' }}
                        />
                        <div
                          className='w-2 h-2 bg-primary rounded-full animate-bounce'
                          style={{ animationDelay: '0.2s' }}
                        />
                      </div>
                    </CardBody>
                  </Card>
                </div>
              )}
            </div>
          )}
        </ScrollShadow>
        {/* Enhanced Input Area */}
        <Card className='shadow-none rounded-none bg-content1/50'>
          <CardBody className='p-4 md:p-6'>
            <Textarea
              placeholder='Ask me anything about finance...'
              value={newMessage}
              onValueChange={setNewMessage}
              onKeyDown={(e: any) =>
                e.key === 'Enter' && !e.shiftKey && handleSendMessage()
              }
              minRows={1}
              maxRows={5}
              radius='md'
              variant='bordered'
              startContent={
                <Icon
                  icon='solar:chat-dots-bold-duotone'
                  className='text-transparent bg-gradient-to-r from-primary to-secondary bg-clip-text text-md md:text-2xl'
                />
              }
              endContent={
                <Button
                  isIconOnly
                  color='primary'
                  variant='solid'
                  type='submit'
                  size='md'
                  className='rounded-full shadow-md transition-transform hover:scale-110 active:scale-95 duration-150 bg-gradient-to-r from-primary to-secondary'
                  aria-label='Send message'
                >
                  <Icon icon='lucide:send' className='text-md' />
                </Button>
              }
              classNames={{
                inputWrapper:
                  'border-2 border-primary/40 bg-content2/70 backdrop-blur-md hover:bg-content2/90 transition-all shadow-md',
                input:
                  'text-base md:text-md font-medium placeholder:font-normal resize-none',
              }}
            />
          </CardBody>
        </Card>
      </div>
    </div>
  );
}
