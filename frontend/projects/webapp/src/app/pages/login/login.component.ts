import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, NonNullableFormBuilder, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { AuthService } from '@app/services/auth.service';
import { ActivatedRoute, Router } from '@angular/router';

interface UserLogin {
  username: FormControl<string>;
  password: FormControl<string>;
}

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit, OnDestroy {
  public loginForm!: FormGroup<UserLogin>;
  protected error?: string[];
  private loginSub$?: Subscription;
  private userSub$?: Subscription;

  public constructor(
    private formBuilder: NonNullableFormBuilder,
    private router: Router,
    private currentRoute: ActivatedRoute,
    private auth: AuthService,
  ) {
    this.userSub$ = this.auth.events.subscribe({
      next: user => {
        if (user) {
          this.redirectedNextUrl();
        }
      },
    });
  }

  public ngOnInit(): void {
    this.loginForm = this.formBuilder.group({
      username: ['', [Validators.required, Validators.maxLength(150)]],
      password: ['', [Validators.required, Validators.maxLength(128)]],
    });
  }

  public ngOnDestroy(): void {
    if (this.loginSub$) {
      this.loginSub$.unsubscribe();
    }
  }

  protected get formControls(): UserLogin {
    return this.loginForm.controls;
  }

  protected login(event: Event) {
    event.preventDefault();

    this.error = undefined;

    // Process login data
    if (this.loginForm.invalid) return;

    const value = this.loginForm.value;
    if (!value.username || !value.password) {
      return;
    }

    this.loginSub$ = this.auth
      .login({
        username: value.username,
        password: value.password,
      })
      .subscribe({
        error: (error: Error) => {
          this.error = [error.message];
        },
      });
  }

  private redirectedNextUrl(): Subscription {
    return this.currentRoute.queryParams.subscribe(params => {
      const next = (params['next'] as string | undefined) ?? '/';

      void this.router.navigateByUrl(next);
    });
  }

  protected clearError() {
    this.error = undefined;
  }
}
