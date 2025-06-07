import type { LayoutServerLoad } from './$types';
import { loadFlash } from 'sveltekit-flash-message/server';

export const load: LayoutServerLoad = loadFlash(async ({ locals: { safeGetSession }, cookies }) => {
  const { session } = await safeGetSession();
  return {
    session,
    cookies: cookies.getAll()
  };
});
