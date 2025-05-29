import { GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET } from '$env/static/private';
import { AppError } from '$lib/errors';
import { supabase } from '$lib/server/supabaseClient';
import { getAppUrl } from '$lib/utils';
import { google } from 'googleapis';
import { OAuth2 } from './oauth';

export class Google extends OAuth2 {
  constructor() {
    const scopes = ['https://www.googleapis.com/auth/youtube.readonly'];
    const redirectUri = new URL('/oauth/google/callback', getAppUrl()).toString();
    super('google', scopes, redirectUri);
  }

  private newClient = () =>
    new google.auth.OAuth2(GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, this.redirectUri);

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

    console.log('アクセストークンを発行');

    const { error: errorOnUpsert } = await supabase.from('oauth_tokens').upsert(
      {
        user_id: user_id,
        provider: 'google',
        access_token: tokens.access_token,
        refresh_token: tokens.refresh_token,
        scope: tokens.scope,
        token_type: tokens.token_type,
        expires_in: tokens.expiry_date,
        raw_token: tokens,
        updated_at: new Date()
      },
      { onConflict: 'user_id, provider' }
    );

    if (errorOnUpsert) {
      console.error(errorOnUpsert);
      throw new AppError(`アクセストークンの保存に失敗: ${errorOnUpsert.message}`);
    }

    console.log('アクセストークンを保存');

    client.setCredentials(tokens);

    return tokens;
  }

  public async authorize(user_id: string) {
    const { data } = await supabase
      .from('oauth_tokens')
      .select('raw_token')
      .eq('user_id', user_id)
      .eq('provider', this.provider)
      .maybeSingle()
      .throwOnError();

    if (!data) {
      console.log('アクセストークンが未保存');
      return null;
    }

    console.log('アクセストークンを取得');

    const client = this.newClient();

    client.setCredentials(data.raw_token);

    client.on('tokens', async (tokens) => {
      const { error } = await supabase.from('oauth_tokens').upsert(
        {
          user_id: user_id,
          provider: 'google',
          access_token: tokens.access_token,
          refresh_token: tokens.refresh_token,
          scope: tokens.scope,
          token_type: tokens.token_type,
          expires_in: tokens.expiry_date,
          raw_token: tokens,
          updated_at: new Date()
        },
        { onConflict: 'user_id, provider' }
      );
      if (error) {
        console.error(error);
        throw new AppError(`アクセストークンの保存に失敗: ${error.message}`);
      }
      console.log('アクセストークンを保存');
    });

    return client;
  }

  public async revokeToken(user_id: string) {
    const client = this.newClient();

    const { data, error: errorOnSelect } = await supabase
      .from('oauth_tokens')
      .select('raw_token')
      .eq('user_id', user_id)
      .eq('provider', this.provider)
      .maybeSingle();

    if (errorOnSelect) {
      console.log(errorOnSelect);
      throw new AppError(`アクセストークンの取得に失敗: ${errorOnSelect.message}`);
    }

    if (!data) {
      console.log('アクセストークンが未保存');
      return;
    }

    console.log('アクセストークンを取得');

    client.setCredentials(data.raw_token);

    client.revokeCredentials();

    console.log('アクセストークンを無効化');

    const { error: errorOnDelete } = await supabase
      .from('oauth_tokens')
      .delete()
      .eq('user_id', user_id)
      .eq('provider', this.provider);

    if (errorOnDelete) {
      console.log(errorOnSelect);
      throw new AppError(`アクセストークンの削除に失敗: ${errorOnDelete.message}`);
    }

    console.log('アクセストークンを削除');
  }
}
