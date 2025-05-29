import { Google } from '$lib/server/oauth/google';
import { redirect } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = () => {
  redirect(303, new Google().generateAuthUrl());
};
