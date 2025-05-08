import { error, redirect } from '@sveltejs/kit';

export const GET = async ({ url, locals: { supabase } }) => {
  const code = url.searchParams.get('code') as string;
  const errorCode = url.searchParams.get('error_code') as string;

  if (!code) {
    if (errorCode) {
      error(400, { message: errorCode });
    } else {
      error(400);
    }
  }

  const { error: authError } = await supabase.auth.exchangeCodeForSession(code);

  if (authError) {
    console.error(authError);
    error(400, authError);
  }

  redirect(303, '/dashboard');
};
