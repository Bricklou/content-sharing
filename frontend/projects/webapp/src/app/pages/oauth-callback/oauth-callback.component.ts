import { Component, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '@app/services/auth.service';
import { AppConfig, OAuthProviders } from '@app/interfaces/AppConfig';
import { Subscription } from 'rxjs';
import { ConfigService } from '@app/services/config.service';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-oauth-callback',
  templateUrl: './oauth-callback.component.html',
  styleUrls: ['./oauth-callback.component.css'],
})
export class OauthCallbackComponent implements OnDestroy {
  private loginSub: Subscription | undefined;
  private configSub: Subscription;
  private config: AppConfig | undefined;
  private userSub?: Subscription;

  protected error?: string;

  public constructor(
    private route: ActivatedRoute,
    private router: Router,
    private authService: AuthService,
    private configService: ConfigService,
  ) {
    this.configSub = this.configService.events.subscribe({
      next: cfg => {
        this.config = cfg;
        this.processOAuth2Response();
      },
    });
    this.userSub = this.authService.events.subscribe({
      next: user => {
        if (user) {
          void this.router.navigate(['/']);
        }
      },
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

  protected is_config_valid(): boolean {
    return this.config != undefined;
  }

  private processOAuth2Response(): void {
    this.route.queryParams.subscribe(params => {
      this.error = undefined;
      const provider = params['provider'] as OAuthProviders;

      if (!this.is_config_valid() || !this.config?.auth?.includes(provider)) {
        this.error = 'Invalid OAuth2 provider';
        return;
      }

      const code = params['code'] as string;
      const state = params['state'] as string;

      this.loginSub = this.authService.loginWithOAuth2(provider, code, state).subscribe({
        next: ([exist, user]) => {
          if (exist) {
            void this.router.navigate(['/']);
          } else {
            void this.router.navigate(['/register'], {
              state: user,
            });
          }
        },
        error: (err: HttpErrorResponse) => {
          this.error = err.message;
          return;
        },
      });
    });
  }
}
