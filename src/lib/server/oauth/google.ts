import { GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET } from '$env/static/private';
import { AppError } from '$lib/errors';
import logger from '$lib/logger';
import { supabase } from '$lib/server/supabaseClient';
import { getAppUrl } from '$lib/utils';
import { google } from 'googleapis';
import { OAuth2 } from './oauth';

type Token = {
  refresh_token?: string | null;
  expiry_date?: number | null;
  access_token?: string | null;
  token_type?: string | null;
  id_token?: string | null;
  scope?: string;
};

export class Google extends OAuth2 {
  constructor() {
    const scopes = ['https://www.googleapis.com/auth/youtube.readonly'];
    const redirectUri = new URL('/oauth/google/callback', getAppUrl()).toString();

    super('google', scopes, redirectUri);
  }

  private newClient = () =>
    new google.auth.OAuth2(GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, this.redirectUri);

  private async upsertToken(token: Token, user_id: string) {
    const { error } = await supabase.from('oauth_tokens').upsert(
      {
        user_id: user_id,
        provider: this.provider,
        access_token: token.access_token,
        refresh_token: token.refresh_token,
        scope: token.scope,
        token_type: token.token_type,
        expires_in: token.expiry_date,
        raw_token: token,
        updated_at: new Date()
      },
      { onConflict: 'user_id, provider' }
    );

    if (error) {
      logger.error(error.stack);
      throw new AppError(`アクセストークンの保存に失敗: ${error.message}`);
    }
  }

  public generateAuthUrl() {
    const client = this.newClient();

    return client.generateAuthUrl({
      access_type: 'offline',
      prompt: 'consent',
      scope: this.scopes
    });
  }

  public async issueToken(code: string, user_id: string) {
    const client = this.newClient();

    const { tokens } = await client.getToken(code);
    logger.info('アクセストークンを発行', { user_id });

    await this.upsertToken(tokens, user_id);
    logger.info('アクセストークンを保存', { user_id });

    client.setCredentials(tokens);

    return client;
  }

  public async authorize(user_id: string) {
    const client = this.newClient();

    const data = await this.selectToken(user_id);

    if (!data) {
      logger.info('アクセストークンが未保存', { user_id });
      return null;
    }

    logger.info('アクセストークンを取得', { user_id });

    client.setCredentials(data.raw_token);

    client.on('tokens', async (tokens) => {
      await this.upsertToken({ ...tokens, refresh_token: data.raw_token.refresh_token }, user_id);
      logger.info('アクセストークンを更新', { user_id });
    });

    if (Date.now() > data.raw_token.expiry_date) {
      logger.info('アクセストークンが有効期限切れ', { user_id });
      await client.refreshAccessToken();
    }

    return client;
  }

  public async revokeToken(user_id: string) {
    const client = this.newClient();

    const data = await this.selectToken(user_id);

    if (!data) {
      logger.info('アクセストークンが未保存', { user_id });
      return;
    }

    logger.info('アクセストークンを取得', { user_id });

    client.setCredentials(data.raw_token);

    client.revokeCredentials();

    logger.info('アクセストークンを無効化', { user_id });

    await this.deleteToken(user_id);

    logger.info('アクセストークンを削除', { user_id });
  }
}
