import { error, redirect } from '@sveltejs/kit';

export const GET = async ({ url, locals: { supabase } }) => {
  const code = url.searchParams.get('code');
  const errorCode = url.searchParams.get('error_code');

  if (!code) {
    if (errorCode) {
      error(400, { message: errorCode });
    } else {
      error(400);
    }
  }

  const { error: errorOnExchangeCode } = await supabase.auth.exchangeCodeForSession(code);

  if (errorOnExchangeCode) {
    console.error(errorOnExchangeCode);
    error(400, errorOnExchangeCode);
  }

  redirect(303, '/dashboard');
};
