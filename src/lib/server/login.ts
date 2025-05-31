import { supabase } from './supabaseClient';

export const checkAccountLock = async (email: string) => {
  const { data: user } = await supabase
    .from('users')
    .select()
    .eq('email', email)
    .maybeSingle()
    .throwOnError();

  if (!user) {
    return null;
  }

  const { data: loginAttempts } = await supabase
    .from('login_attempts')
    .select()
    .eq('user_id', user.id)
    .maybeSingle()
    .throwOnError();

  if (
    loginAttempts?.locked_until &&
    new Date().getTime() < new Date(loginAttempts.locked_until).getTime()
  ) {
    return {
      userId: user.id,
      failedAttempts: loginAttempts.failed_attempts,
      lockedUntil: loginAttempts.locked_until,
      isLocked: loginAttempts.locked_until !== null
    };
  } else {
    return {
      userId: user.id,
      failedAttempts: 0,
      lockedUntil: null,
      isLocked: false
    };
  }
};

export const loginFailed = async (userId: string | null | undefined) => {
  if (!userId) {
    return null;
  }

  const { data: loginAttempts } = await supabase
    .from('login_attempts')
    .select()
    .eq('user_id', userId)
    .maybeSingle()
    .throwOnError();

  const attempts = loginAttempts?.failed_attempts ? loginAttempts.failed_attempts + 1 : 1;
  const lockSeconds = getLockSeconds(attempts);
  const lockedUntil = lockSeconds
    ? new Date(new Date().getTime() + lockSeconds * 1000).toUTCString()
    : null;

  const { data: newLoginAttempts } = await supabase
    .from('login_attempts')
    .upsert(
      {
        updated_at: new Date().toUTCString(),
        user_id: userId,
        failed_attempts: attempts,
        last_failed_at: new Date().toUTCString(),
        locked_until: lockedUntil
      },
      { onConflict: 'user_id' }
    )
    .eq('user_id', userId)
    .select()
    .maybeSingle()
    .throwOnError();

  if (newLoginAttempts) {
    return {
      userId: userId,
      failedAttempts: newLoginAttempts.failed_attempts,
      lockedUntil: newLoginAttempts.locked_until,
      isLocked: newLoginAttempts.locked_until !== null
    };
  } else {
    return {
      userId: userId,
      failedAttempts: 0,
      lockedUntil: null,
      isLocked: false
    };
  }
};

export const resetLoginFailures = async (userId: string | null | undefined) => {
  if (!userId) {
    return;
  }

  await supabase
    .from('login_attempts')
    .update({
      updated_at: new Date().toUTCString(),
      failed_attempts: 0,
      last_failed_at: null,
      locked_until: null
    })
    .eq('user_id', userId)
    .throwOnError();
};

const getLockSeconds = (attemps: number) => {
  switch (attemps) {
    case 1:
      return null;
    case 2:
      return null;
    case 3:
      return null;
    case 4:
      return null;
    case 5:
      return 5 * 60; // 5分
    case 6:
      return null;
    case 7:
      return null;
    case 8:
      return null;
    case 9:
      return null;
    default:
      return 60 * 60; // 1時間
  }
};
