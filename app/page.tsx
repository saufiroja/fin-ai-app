import { Snippet } from '@heroui/snippet';
import { Code } from '@heroui/code';
import { button as buttonStyles } from '@heroui/theme';
import { Card, CardHeader, CardBody, CardFooter } from '@heroui/card';

import { siteConfig } from '@/config/site';
import { title, subtitle } from '@/components/primitives';
import { GithubIcon } from '@/components/icons';
import NextLink from 'next/link';
import { Link } from '@heroui/link';
import { Divider } from '@heroui/divider';
import { Image } from '@heroui/image';

export default function Home() {
  const features = [
    {
      icon: '💬',
      title: 'AI Finance Chat',
      subtitle: 'Financial consultation & transaction automation via chat.',
      desc: 'Ask anything about your finances and automatically record transactions through AI chat.',
      link: '/chat',
    },
    {
      icon: '🧾',
      title: 'Receipt Upload',
      subtitle: 'Auto-insert transactions from receipt photos.',
      desc: 'Upload your shopping receipt photos and transactions will be recorded automatically.',
      link: '/upload',
    },
    {
      icon: '📈',
      title: 'Insights & Recommendations',
      subtitle: 'Analyze expenses & get smart recommendations.',
      desc: 'Get daily, weekly, and monthly expense analysis, savings recommendations, and personal finance tips.',
      link: '/insight',
    },
  ];
  return (
    <section className='flex flex-col items-center justify-center gap-4 py-8 md:py-10'>
      <div className='inline-block max-w-xl text-center justify-center'>
        <span className={title()}>Fin&nbsp;</span>
        <span className={title({ color: 'violet' })}>AI&nbsp;</span>
        <br />
        <span className={title()}>Smart Financial Intelligence Platform</span>
        <div className={subtitle({ class: 'mt-4' })}>
          AI-powered financial analysis and insights for smarter decisions.
        </div>
      </div>

      <div className='grid grid-cols-1 md:grid-cols-2 gap-6 mt-8 max-w-2xl w-full'>
        {features.map((feature, idx) => {
          // Jika jumlah fitur ganjil dan ini card terakhir, tambahkan col-span-2 dan mx-auto di desktop
          const isLastOdd =
            features.length % 2 === 1 && idx === features.length - 1;
          return (
            <Card
              className={`max-w-[400px] ${
                isLastOdd ? 'md:col-span-2 md:mx-auto' : ''
              }`}
              key={idx}
            >
              <CardHeader className='flex gap-3 items-center'>
                <span className='text-violet-600 text-2xl'>{feature.icon}</span>
                <div className='flex flex-col'>
                  <p className='text-md font-semibold'>{feature.title}</p>
                  <p className='text-small text-default-500'>
                    {feature.subtitle}
                  </p>
                </div>
              </CardHeader>
              <Divider />
              <CardBody>
                <p>{feature.desc}</p>
              </CardBody>
              <Divider />
              <CardFooter>
                <Link isExternal showAnchorIcon href={feature.link}>
                  Go to {feature.title}
                </Link>
              </CardFooter>
            </Card>
          );
        })}
      </div>
    </section>
  );
}
