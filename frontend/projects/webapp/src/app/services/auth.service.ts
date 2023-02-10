import {
  HttpClient,
  HttpErrorResponse,
  HttpEventType,
  HttpUploadProgressEvent,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { makeStateKey, TransferState } from '@angular/platform-browser';
import { User } from '@app/interfaces/User';
import { BehaviorSubject, catchError, map, Observable, of, throwError, timeout } from 'rxjs';
import { OAuthProviders } from '@app/interfaces/AppConfig';
import { XOR } from '@app/utils/types';

interface UserSignIn {
  username: string;
  password: string;
}

interface UserResponse {
  details: string;
  user?: User;
}

export interface RegisterBaseOptions {
  username: string;
  email: string;
  avatar?: File[];
}

interface RegisterOauth2Options {
  oauth2_id: string;
  provider: OAuthProviders;
}

interface RegisterPasswordOptions {
  password: string;
  confirmation: string;
}

export type RegisterOptions = RegisterBaseOptions &
  XOR<RegisterOauth2Options, RegisterPasswordOptions>;

type OAuth2Response = [boolean, User?];

const STATE_KEY_USER = makeStateKey<User | undefined>('auth_user');

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private user: BehaviorSubject<User | undefined>;

  public readonly events: Observable<User | undefined>;

  public constructor(private http: HttpClient, private state: TransferState) {
    this.user = new BehaviorSubject<User | undefined>(this.state.get(STATE_KEY_USER, undefined));
    this.events = this.user.asObservable();
  }

  public get isLoggedIn(): boolean {
    return this.currentUser !== undefined;
  }

  public login(userSignIn: UserSignIn): Observable<void> {
    return this.http.post<UserResponse>('/api/auth', userSignIn).pipe(
      catchError(this.httpError),
      map(u => {
        this.setUser(u.user);
      }),
    );
  }

  public register(userRegister: RegisterOptions): Observable<void> {
    const data = new FormData();

    data.append('username', userRegister.username);
    data.append('email', userRegister.email);
    if (userRegister.avatar) data.append('avatar', userRegister.avatar[0]);

    if (userRegister.oauth2_id && userRegister.provider) {
      data.append('oauth2_id', userRegister.oauth2_id);
      data.append('provider', userRegister.provider);
    }

    if (userRegister.password && userRegister.confirmation) {
      data.append('password', userRegister.password);
      data.append('confirmation', userRegister.confirmation);
    }

    return this.http
      .post<UserResponse>('/api/auth/register', data, {
        reportProgress: true,
        observe: 'events',
      })
      .pipe(
        catchError((error: HttpErrorResponse) => {
          if (error.status === 400) {
            return throwError(error.error);
          }
          return this.httpError(error);
        }),
        map(event => {
          switch (event.type) {
            case HttpEventType.UploadProgress:
              {
                const e = event as HttpUploadProgressEvent;
                if (!e.total) return;
                const progress = Math.round((e.loaded / e.total) * 100);
                console.log(`Upload progress: ${progress}%`);
              }
              break;
            case HttpEventType.Response:
              this.setUser(event.body?.user);
          }
        }),
      );
  }

  public checkUser(username: string): Observable<boolean> {
    return this.http.get(`/api/auth/check`, { params: { username }, observe: 'response' }).pipe(
      map(response => response.status === 200),
      catchError((e: HttpErrorResponse) => {
        if (e.status === 404) {
          return of(false);
        }
        return this.httpError(e);
      }),
    );
  }

  public loginWithOAuth2(
    provider: OAuthProviders,
    code: string,
    state: string,
  ): Observable<OAuth2Response> {
    return this.http
      .post<UserResponse>(
        `/api/oauth2`,
        {},
        {
          params: {
            provider,
            code,
            state,
          },
        },
      )
      .pipe(
        map(u => {
          this.setUser(u.user);
          return <OAuth2Response>[true, undefined];
        }),
        catchError((err: HttpErrorResponse) => {
          if (err.status === 404) {
            const { oauth2_user } = err.error as { oauth2_user?: User };
            return of<OAuth2Response>([false, oauth2_user]);
          }
          return this.httpError(err);
        }),
      );
  }

  public logout(): Observable<void> {
    return this.http.delete<void>('/api/auth').pipe(
      catchError(this.httpError),
      map(() => {
        this.setUser(undefined);
      }),
    );
  }

  public get currentUser(): User | undefined {
    return this.user.getValue() || this.state.get(STATE_KEY_USER, undefined);
  }

  private httpError(error: HttpErrorResponse): Observable<never> {
    const err = error.error as { detail?: string };
    return throwError(
      () =>
        ({
          name: error.statusText,
          message: err.detail || '',
        } as Error),
    );
  }

  public refresh(): Observable<void> {
    this.user.next(this.state.get(STATE_KEY_USER, undefined));

    return this.http.get<UserResponse>('/api/auth').pipe(
      catchError(this.httpError),
      map(u => {
        this.setUser(u.user);
      }),
    );
  }

  private setUser(u: User | undefined): void {
    this.user.next(u);
    this.state.set(STATE_KEY_USER, u);
  }

  public getOAuth2Url(provider: OAuthProviders): Observable<string> {
    return this.http.get<{ url: string }>(`/api/oauth2`, { params: { provider } }).pipe(
      catchError(this.httpError),
      timeout(5000),
      map(u => u.url),
    );
  }
}
