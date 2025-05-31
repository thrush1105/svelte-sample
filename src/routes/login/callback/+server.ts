import logger from '$lib/logger';
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

  const {
    data: { user },
    error: errorOnExchangeCode
  } = await supabase.auth.exchangeCodeForSession(code);

  if (errorOnExchangeCode) {
    logger.error(errorOnExchangeCode.stack);
    error(400, errorOnExchangeCode);
  }

  logger.info('ソーシャルログイン', { user_id: user?.id });

  redirect(303, '/dashboard');
};
