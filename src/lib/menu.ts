import { Home, User, Youtube } from '@lucide/svelte';

export const getMenu = (login: boolean) => {
  return login
    ? [
        { title: 'ホーム', url: '/', icon: Home },
        { title: 'プロフィール', url: '/profile', icon: User },
        { title: 'YouTube', url: '/youtube', icon: Youtube }
      ]
    : [{ title: 'ホーム', url: '/', icon: Home }];
};
