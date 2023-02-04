export type OAuthProviders = 'discord' | 'github' | 'password';

export interface AppConfig {
  auth: OAuthProviders[];
}
