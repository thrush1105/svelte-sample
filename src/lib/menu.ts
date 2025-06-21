import { CreditCard, Home, User } from '@lucide/svelte';

export const getMenu = (login: boolean) => {
  return login
    ? [
        { title: 'ホーム', url: '/', icon: Home },
        { title: 'プロフィール', url: '/profile', icon: User },
        { title: '取引明細', url: '/transactions', icon: CreditCard }
      ]
    : [{ title: 'ホーム', url: '/', icon: Home }];
};
