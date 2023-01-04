interface User {
  username: string;
  email: string;
  avatar: string;
  groups: string[];
  is_staff: boolean;
  is_active: boolean;
  is_superuser: boolean;
}

declare const __STATIC_URL: string;
