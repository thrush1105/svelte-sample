import { error } from '@sveltejs/kit';
import { redirect } from 'sveltekit-flash-message/server';

export const GET = async ({ url, locals: { supabase }, cookies }) => {
  const code = url.searchParams.get('code');
  const errorCode = url.searchParams.get('error_code');

  if (!code) {
    if (errorCode) {
      error(400, `エラーが発生しました: ${errorCode}`);
    } else {
      error(400, 'エラーが発生しました');
    }
  }

  const {
    data: { user },
    error: errorOnExchangeCode
  } = await supabase.auth.exchangeCodeForSession(code);

  if (errorOnExchangeCode) {
    console.error(errorOnExchangeCode);
    error(500, `エラーが発生しました: ${errorOnExchangeCode.code}`);
  }

  redirect('/profile', { type: 'success', message: 'ログインしました' }, cookies);
};
