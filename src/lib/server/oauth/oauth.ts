import { AppError } from '$lib/errors';
import logger from '$lib/logger';
import { supabase } from '$lib/server/supabaseClient';

export type Provider = 'google';

export abstract class OAuth2 {
  protected provider: Provider;
  protected scopes?: string[];
  protected redirectUri?: string;

  constructor(provider: Provider, scopes?: string[], redirectUri?: string) {
    this.provider = provider;
    this.scopes = scopes;
    this.redirectUri = redirectUri;
  }

  abstract generateAuthUrl(): string;

  abstract issueToken(code: string, user_id: string): void;

  abstract authorize(user_id: string): void;

  abstract revokeToken(user_id: string): void;

  protected async selectToken(user_id: string) {
    const { data, error } = await supabase
      .from('oauth_tokens')
      .select('raw_token')
      .eq('user_id', user_id)
      .eq('provider', this.provider)
      .maybeSingle();

    if (error) {
      logger.error(error.stack);
      throw new AppError(`アクセストークンの取得に失敗: ${error.message}`);
    }

    return data;
  }

  protected async deleteToken(user_id: string) {
    const { error } = await supabase
      .from('oauth_tokens')
      .delete()
      .eq('user_id', user_id)
      .eq('provider', this.provider);

    if (error) {
      logger.error(error.stack);
      throw new AppError(`アクセストークンの削除に失敗: ${error.message}`);
    }
  }
}
