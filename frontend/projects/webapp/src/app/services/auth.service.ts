import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { makeStateKey, TransferState } from '@angular/platform-browser';
import { User } from '@app/interfaces/User';
import { BehaviorSubject, catchError, map, Observable, throwError } from 'rxjs';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
};

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
    return this.http.post<UserResponse>('/api/auth', userLogin, httpOptions).pipe(
      catchError(this.httpError),
      map(u => {
        this.setUser(u.user);
      }),
    );
  }

  public logout(): Observable<void> {
    return this.http.delete<void>('/api/auth', httpOptions).pipe(
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

    return this.http.get<UserResponse>('/api/auth', httpOptions).pipe(
      catchError(this.httpError),
      map(u => {
        this.setUser(u.user);
      }),
    );
  }

  private setUser(u: User | undefined): void {
    this.user.next(u);
    console.log(u);
    this.state.set(STATE_KEY_USER, u);
  }
}
