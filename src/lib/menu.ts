import { Home, ReceiptText, User, Youtube } from '@lucide/svelte';

export const getMenu = (login: boolean) => {
  return login
    ? [
        { title: 'ホーム', url: '/', icon: Home },
        { title: 'プロフィール', url: '/profile', icon: User },
        { title: 'YouTube', url: '/youtube', icon: Youtube },
        { title: '給与明細', url: '/payslip', icon: ReceiptText }
      ]
    : [{ title: 'ホーム', url: '/', icon: Home }];
};
