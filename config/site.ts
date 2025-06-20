export type SiteConfig = typeof siteConfig;

export const siteConfig = {
  name: 'Fin AI',
  description: 'Your AI-powered personal finance assistant',
  navItems: [
    {
      label: 'Dashboard',
      href: '/dashboard',
    },
    {
      label: 'Transaction',
      href: '/transaction',
    },
    {
      label: 'Chat',
      href: '/chat',
    },
    {
      label: 'Insight',
      href: '/insight',
    },
  ],
  navMenuItems: [
    {
      label: 'Home',
      href: '/',
    },
    {
      label: 'Dashboard',
      href: '/dashboard',
    },
    {
      label: 'Transaction',
      href: '/transaction',
    },
    {
      label: 'Chat',
      href: '/chat',
    },
    {
      label: 'Insight',
      href: '/insight',
    },
    {
      label: 'Setting',
      href: '/setting',
    },
  ],
  links: {
    github: 'https://github.com/saufiroja',
    twitter: 'https://twitter.com/hero_ui',
    docs: 'https://heroui.com',
    discord: 'https://discord.gg/9b6yyZKmH4',
    sponsor: 'https://patreon.com/jrgarciadev',
  },
};
