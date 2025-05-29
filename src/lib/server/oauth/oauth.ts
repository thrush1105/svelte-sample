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
}
