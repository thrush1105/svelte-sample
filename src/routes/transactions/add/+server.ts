import { convertKeysToSnake } from '$lib/utils';
import { error, json } from '@sveltejs/kit';
import { z as z4 } from 'zod/v4';
import { addFormSchame } from '../schema';
import type { RequestHandler } from './$types';

export const POST: RequestHandler = async ({ request, locals: { supabase, user } }) => {
  const result = addFormSchame.safeParse(await request.json());

  if (!result.success) {
    return json(z4.flattenError(result.error), { status: 400 });
  }

  if (!user) {
    return error(401);
  }

  const { error: errorOnInsert } = await supabase
    .from('transactions')
    .insert(result.data.map((data) => ({ ...convertKeysToSnake(data), user_id: user.id })));

  if (errorOnInsert) {
    console.error(errorOnInsert);
    return error(500, errorOnInsert.code);
  }

  return json(result);
};
