'use client';
import { subtitle } from '@/components/primitives';
import { Textarea } from '@heroui/input';
import { useChatMessages } from '@/hooks/use-chat-message';
import React from 'react';
import { Button } from '@heroui/button';
import { Icon } from '@iconify/react';
import { Card, CardBody } from '@heroui/card';
import { Tabs, Tab } from '@heroui/tabs';
import { PhotoUpload } from '@/components/photo-upload';
import { Form } from '@heroui/form';
import SparkleIcon from '@/components/sparkle-icon';
import { useRouter } from 'next/navigation';

export default function Home() {
  // Simulate user login (replace with real user context if available)
  const user = { name: 'Andi' };
  const subtitles = [
    'AI-powered financial analysis and insights for smarter decisions.',
    'Yuk, mulai kelola keuangan dengan lebih cerdas hari ini!',
    'Apa kabar? Siap bantu atur keuanganmu kapan saja.',
    'Setiap langkah kecil menuju finansial sehat itu berarti.',
    'Sudah cek pengeluaran minggu ini? Aku siap bantu!',
    'Jangan lupa sisihkan untuk tabungan, ya!',
    'Mau konsultasi keuangan? Tanyakan saja di sini.',
    'Semangat menabung dan investasi hari ini!',
    'Keuangan sehat, hidup pun tenang.',
    'Yuk, capai tujuan finansialmu bersama FinAI!',
  ];
  const [randomSubtitle, setRandomSubtitle] = React.useState(subtitles[0]);
  const { addMessage } = useChatMessages();
  const [newMessage, setNewMessage] = React.useState('');
  const [activeTab, setActiveTab] = React.useState('chat');
  const router = useRouter();

  React.useEffect(() => {
    setRandomSubtitle(subtitles[Math.floor(Math.random() * subtitles.length)]);
  }, []);
  const handleSendMessage = () => {
    if (newMessage.trim()) {
      // Simpan pesan ke localStorage untuk diambil di /chat
      localStorage.setItem('pendingMessage', newMessage);
      setNewMessage('');
      router.push('/chat');
    }
  };
  return (
    <section className='flex flex-col items-center justify-center gap-4 py-8 md:py-10 bg-background'>
      {/* Personalized greeting if user is logged in */}
      {user && (
        <div className='text-lg font-semibold text-default-700 dark:text-gray-200'>
          Halo, {user.name}! 👋
        </div>
      )}
      <div className='inline-block max-w-xl text-center justify-center'>
        <div className={subtitle()}>{randomSubtitle}</div>
      </div>
      {/* Switch Tabs for Upload Struk & Chat */}
      <div className='w-full max-w-2xl'>
        <Card className='w-full p-0' shadow='md'>
          <Form
            onSubmit={(e) => {
              e.preventDefault();
              if (activeTab === 'chat') {
                handleSendMessage();
              }
            }}
            className='flex flex-col gap-0'
          >
            <Tabs
              selectedKey={activeTab}
              onSelectionChange={(key) => setActiveTab(String(key))}
              className='px-6 pt-6'
              variant='bordered'
            >
              <Tab
                key='chat'
                title={
                  <div className='flex items-center gap-1'>
                    <Icon
                      icon='lucide:message-circle'
                      className='w-4 h-4 text-blue-500'
                    />
                    <span>Chat</span>
                  </div>
                }
              />
              <Tab
                key='scan'
                title={
                  <div className='flex items-center gap-1'>
                    <Icon
                      icon='lucide:scan-line'
                      className='w-4 h-4 text-green-500'
                    />
                    <span>Scan Receipt</span>
                  </div>
                }
              />
            </Tabs>
            <CardBody className='p-6 pt-4'>
              {activeTab === 'chat' ? (
                <div className='flex flex-col w-full'>
                  {/* Chat messages would go here */}
                  <div className='flex-1' />
                  <div className='pt-2'>
                    <Textarea
                      placeholder='write your message here...'
                      startContent={<SparkleIcon />}
                      onKeyDown={(e) =>
                        e.key === 'Enter' && !e.shiftKey && handleSendMessage()
                      }
                      onValueChange={setNewMessage}
                      value={newMessage}
                      className='resize-none'
                      endContent={
                        <Button
                          isIconOnly
                          color='primary'
                          variant='solid'
                          type='submit'
                          className='rounded-full shadow-md transition-transform hover:scale-110 active:scale-95 duration-150 bg-gradient-to-r from-primary to-secondary'
                          aria-label='Send message'
                        >
                          <Icon icon='lucide:send' className='text-lg' />
                        </Button>
                      }
                    />
                  </div>
                </div>
              ) : (
                <div className='flex flex-col w-full'>
                  <PhotoUpload />
                </div>
              )}
            </CardBody>
          </Form>
        </Card>
      </div>
    </section>
  );
}
