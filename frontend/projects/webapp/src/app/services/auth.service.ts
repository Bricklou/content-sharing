import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { makeStateKey, TransferState } from '@angular/platform-browser';
import { User } from '@app/interfaces/User';
import { BehaviorSubject, catchError, map, Observable, throwError, timeout } from 'rxjs';
import { OAuthProviders } from '@app/interfaces/AppConfig';

interface UserLogin {
  username: string;
  password: string;
}

interface UserResponse {
  details: string;
  user?: User;
}

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

  public login(userLogin: UserLogin): Observable<void> {
    return this.http.post<UserResponse>('/api/auth', userLogin).pipe(
      catchError(this.httpError),
      map(u => {
        this.setUser(u.user);
      }),
    );
  }

  public loginWithOAuth2(provider: OAuthProviders, code: string, state: string): Observable<void> {
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
        catchError(this.httpError),
        map(u => {
          this.setUser(u.user);
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
