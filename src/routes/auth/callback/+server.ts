import { error, redirect } from '@sveltejs/kit';

export const GET = async ({ url, locals: { supabase } }) => {
  const code = url.searchParams.get('code') as string;
  const errorCode = url.searchParams.get('error_code') as string;

  if (errorCode) {
    error(400, { message: errorCode });
  }

  if (!code) {
    error(400);
  }

  const { error: apiError } = await supabase.auth.exchangeCodeForSession(code);

  if (apiError) {
    console.error(apiError);
    error(400, apiError);
  }

  redirect(303, '/private');
};
