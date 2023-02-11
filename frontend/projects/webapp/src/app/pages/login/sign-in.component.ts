import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, NonNullableFormBuilder, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { AuthService } from '@app/services/auth.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ConfigService } from '@app/services/config.service';
import { AppConfig, OAuthProviders } from '@app/interfaces/AppConfig';
import { DOCUMENT } from '@angular/common';

interface UserSignin {
  username: FormControl<string>;
}

@Component({
  selector: 'app-signin',
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.css'],
})
export class SignInComponent implements OnInit, OnDestroy {
  public signinForm!: FormGroup<UserSignin>;
  protected error?: string[];
  private signinSub?: Subscription;
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
    this.configSub = this.configService.events.subscribe({
      next: cfg => {
        this.config = cfg;
      },
    });
  }

  public ngOnInit(): void {
    this.signinForm = this.formBuilder.group({
      username: ['', [Validators.required, Validators.maxLength(150)]],
    });
  }

  public ngOnDestroy(): void {
    if (this.signinSub) {
      this.signinSub.unsubscribe();
    }
    if (this.configSub) {
      this.configSub.unsubscribe();
    }
  }

  protected get formControls(): UserSignin {
    return this.signinForm.controls;
  }

  protected login(event: Event) {
    event.preventDefault();

    this.error = undefined;

    // Process signin data
    if (this.signinForm.invalid) return;

    const value = this.signinForm.value;
    if (!value.username) {
      return;
    }

    this.signinSub = this.auth.checkUser(value.username).subscribe({
      next: (user: boolean) => {
        if (user) {
          void this.router.navigate(['/login'], {
            queryParams: { username: value.username },
            queryParamsHandling: 'merge',
          });
        } else {
          void this.router.navigate(['/register'], {
            state: { username: value.username },
          });
        }
      },
      error: (error: Error) => {
        this.error = [error.message];
      },
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
