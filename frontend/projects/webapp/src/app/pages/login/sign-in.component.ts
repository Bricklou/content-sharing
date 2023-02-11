import { ChangeDetectorRef, Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, NonNullableFormBuilder, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { AuthService } from '@app/services/auth.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ConfigService } from '@app/services/config.service';
import { AppConfig, OAuthProviders } from '@app/interfaces/AppConfig';
import { DOCUMENT } from '@angular/common';
import { FormValidation } from '@app/utils/types';
import { translate } from '@ngneat/transloco';

interface UserSignin {
  username: FormControl<string>;
  password: FormControl<string>;
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
  protected passUserExists = false;

  public constructor(
    private formBuilder: NonNullableFormBuilder,
    private router: Router,
    private currentRoute: ActivatedRoute,
    private auth: AuthService,
    private configService: ConfigService,
    private changeDetector: ChangeDetectorRef,
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
      password: ['', [Validators.minLength(6), Validators.maxLength(150)]],
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
    if (this.signinForm.invalid) {
      return;
    }

    const value = this.signinForm.value;
    if (!value.username) {
      return;
    }

    if (!value.password) {
      this.signinSub = this.auth.checkUser(value.username).subscribe({
        next: (user: boolean) => {
          if (user) {
            this.passUserExists = true;
            this.signinForm.controls.password?.addValidators(Validators.required);
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
    } else {
      this.signinSub = this.auth
        .login({ username: value.username, password: value.password })
        .subscribe({
          next: () => {
            void this.router.navigate(['/login']);
          },
          error: (error: Error | FormValidation) => {
            if (error instanceof Error) {
              this.error = [error.message];
              return;
            } else if (error.validation == undefined) {
              this.error = [translate('pages.register.error.unknown')];
              return;
            }

            for (const key of Object.keys(error.validation)) {
              const control = this.signinForm.get(key);
              if (!control || !error.validation[key]) continue;

              const data = error.validation[key][0].split(':');
              const firstError = data[0];
              control.setErrors({
                [firstError]: data.length === 2 ? { [firstError]: data[1] } : true,
              });
              this.changeDetector.detectChanges();
            }
          },
        });
    }
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
