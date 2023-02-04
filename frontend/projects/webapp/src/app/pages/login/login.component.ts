import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, NonNullableFormBuilder, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { AuthService } from '@app/services/auth.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ConfigService } from '@app/services/config.service';
import { AppConfig, OAuthProviders } from '@app/interfaces/AppConfig';
import { DOCUMENT } from '@angular/common';

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
  private loginSub?: Subscription;
  private userSub?: Subscription;
  private configSub: Subscription;
  private oauth2Sub?: Subscription;
  private config: AppConfig | undefined;
  protected loading: OAuthProviders | undefined;

  public constructor(
    private formBuilder: NonNullableFormBuilder,
    private router: Router,
    private currentRoute: ActivatedRoute,
    private auth: AuthService,
    private configService: ConfigService,
    @Inject(DOCUMENT) private document: Document,
  ) {
    this.userSub = this.auth.events.subscribe({
      next: user => {
        if (user) {
          this.redirectedNextUrl();
        }
      },
    });

    this.configSub = this.configService.events.subscribe({
      next: cfg => {
        this.config = cfg;
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
    if (this.loginSub) {
      this.loginSub.unsubscribe();
    }
    if (this.configSub) {
      this.configSub.unsubscribe();
    }
    if (this.userSub) {
      this.userSub.unsubscribe();
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

    this.loginSub = this.auth
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

  protected is_auth_enabled(name: OAuthProviders): boolean {
    return this.config?.auth.includes(name) || false;
  }

  protected has_third_parties(): boolean {
    return (this.config?.auth.filter(provider => provider != 'password').length || 0) > 0;
  }

  protected is_config_valid(): boolean {
    return this.config != undefined;
  }

  protected fetch_authorization_url(event: Event, provider: OAuthProviders): void {
    this.loading = provider;
    if (this.oauth2Sub) {
      this.oauth2Sub.unsubscribe();
    }
    this.oauth2Sub = this.auth.getOAuth2Url(provider).subscribe({
      next: (url: string) => {
        this.document.location.href = url;
      },
      error: (error: Error) => {
        this.error = [error.message];
        this.loading = undefined;
      },
      complete: () => {
        this.loading = undefined;
      },
    });
  }
}
