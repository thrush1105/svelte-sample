import { Google } from '$lib/server/oauth/google';
import { json, redirect } from '@sveltejs/kit';
import { google } from 'googleapis';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async ({ locals: { user } }) => {
  if (!user) {
    redirect(303, '/login');
  }

  const authorized = await new Google().authorize(user.id);

  if (!authorized) {
    redirect(303, '/oauth');
  }

  const youtube = google.youtube({ version: 'v3', auth: authorized });

  const res = await youtube.subscriptions.list({
    part: ['snippet'],
    mine: true,
    maxResults: 50
  });

  return json(res.data);
};
