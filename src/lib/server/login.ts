import { supabase } from './supabaseClient';

export const selectUserByEmail = async (email: string) => {
  return await supabase.from('users').select().eq('email', email).maybeSingle();
};

export const checkAccountLock = async (userId: string) => {
  const { data: loginAttempts, error: errorOnSelectLoginAttempts } = await supabase
    .from('login_attempts')
    .select()
    .eq('user_id', userId)
    .maybeSingle();

  if (errorOnSelectLoginAttempts) {
    return { data: null, error: errorOnSelectLoginAttempts };
  }

  if (!loginAttempts) {
    return {
      data: {
        userId: userId,
        failedAttempts: null,
        lockedUntil: null,
        isLocked: false
      },
      error: null
    };
  }

  const isLocked =
    loginAttempts.locked_until !== null &&
    new Date().getTime() < new Date(loginAttempts.locked_until).getTime();

  return {
    data: {
      userId: userId,
      failedAttempts: loginAttempts.failed_attempts,
      lockedUntil: loginAttempts.locked_until,
      isLocked: isLocked
    },
    error: null
  };
};

export const loginFailed = async (userId: string) => {
  const { data: loginAttempts, error: errorOnSelectLoginAttempts } = await supabase
    .from('login_attempts')
    .select()
    .eq('user_id', userId)
    .maybeSingle();

  if (errorOnSelectLoginAttempts) {
    return { data: null, error: errorOnSelectLoginAttempts };
  }

  const failedAttemps = loginAttempts?.failed_attempts ? loginAttempts.failed_attempts + 1 : 1;
  const lockSeconds = getLockSeconds(failedAttemps);
  const lockedUntil = lockSeconds
    ? new Date(new Date().getTime() + lockSeconds * 1000).toUTCString()
    : null;

  const { data: newLoginAttempts, error: erorrOnUpsert } = await supabase
    .from('login_attempts')
    .upsert(
      {
        updated_at: new Date().toUTCString(),
        user_id: userId,
        failed_attempts: failedAttemps,
        last_failed_at: new Date().toUTCString(),
        locked_until: lockedUntil
      },
      { onConflict: 'user_id' }
    )
    .eq('user_id', userId)
    .select()
    .single();

  if (erorrOnUpsert) {
    return { data: null, error: erorrOnUpsert };
  }

  const isLocked =
    newLoginAttempts.locked_until !== null &&
    new Date().getTime() < new Date(newLoginAttempts.locked_until).getTime();

  return {
    data: {
      userId: userId,
      failedAttempts: newLoginAttempts.failed_attempts,
      lockedUntil: newLoginAttempts.locked_until,
      isLocked: isLocked
    },
    error: null
  };
};

export const resetLoginFailures = async (userId: string) => {
  return await supabase
    .from('login_attempts')
    .update({
      updated_at: new Date().toUTCString(),
      failed_attempts: 0,
      last_failed_at: null,
      locked_until: null
    })
    .eq('user_id', userId);
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
