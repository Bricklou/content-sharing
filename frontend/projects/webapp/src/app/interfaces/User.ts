export interface User {
  id: number;
  username: string;
  email: string;
  email_verified_at: Date | undefined;
  create_at: Date;
  update_at: Date;
}
