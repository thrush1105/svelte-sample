import { Home, User } from '@lucide/svelte';

export const getMenu = (login: boolean) => {
  return login
    ? [
        { title: 'ホーム', url: '/', icon: Home },
        { title: 'プロフィール', url: '/profile', icon: User }
      ]
    : [{ title: 'ホーム', url: '/', icon: Home }];
};
