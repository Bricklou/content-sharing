import { ChangeDetectorRef, Component, Inject, OnDestroy, ViewChild } from '@angular/core';
import {
  AbstractControl,
  FormControl,
  FormGroup,
  NonNullableFormBuilder,
  Validators,
} from '@angular/forms';
import { Subscription } from 'rxjs';
import { AppConfig, OAuthProviders } from '@app/interfaces/AppConfig';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService, RegisterBaseOptions, RegisterOptions } from '@app/services/auth.service';
import { ConfigService } from '@app/services/config.service';
import { DOCUMENT } from '@angular/common';
import { DragAndDropComponent } from '@app/components/forms/drag-and-drop/drag-and-drop.component';
import { translate } from '@ngneat/transloco';
import Validation from '@app/utils/validation';

interface UserRegister {
  username: FormControl<string>;
  email: FormControl<string>;
  avatar: FormControl<File[]>;
  password: FormControl<string>;
  confirmPassword: FormControl<string>;
}

interface StateData {
  id?: string;
  username: string;
  email: string;
  avatar?: string;
  provider?: OAuthProviders;
}

@Component({
  selector: 'app-account',
  templateUrl: './register-account.component.html',
  styleUrls: ['./register-account.component.css'],
})
export class RegisterAccountComponent implements OnDestroy {
  public registerForm!: FormGroup<UserRegister>;
  protected error?: string[];
  private registerSub?: Subscription;
  private userSub?: Subscription;
  private configSub: Subscription;
  private config: AppConfig | undefined;
  protected loading: OAuthProviders | undefined;

  private state?: StateData;

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

    const currentNavigation = router.getCurrentNavigation();
    if (!currentNavigation) {
      void router.navigate(['/']);
      return;
    }
    this.state = currentNavigation.extras.state as StateData | undefined;

    if (!this.state?.username) {
      void router.navigate(['/']);
      return;
    }

    this.registerForm = this.formBuilder.group(
      {
        username: [this.state.username, [Validators.required, Validators.maxLength(150)]],
        email: [
          this.state.email,
          [Validators.required, Validators.maxLength(150), Validators.email],
        ],
        avatar: [[] as File[], [Validators.required]],
        password: [
          '',
          this.isPasswordProvider() ? [Validators.required, Validators.maxLength(128)] : [],
        ],
        confirmPassword: [
          '',
          this.isPasswordProvider() ? [Validators.required, Validators.maxLength(128)] : [],
        ],
      },
      {
        validators: [Validation.match('password', 'confirmPassword')],
      },
    );

    this.userSub = this.auth.events.subscribe({
      next: user => {
        if (user) {
          this.redirectedNextUrl();
        }
      },
    });
  }

  @ViewChild('dndInput')
  private set viewDndInputReference(dndInput: DragAndDropComponent | undefined) {
    if (!dndInput) return;

    if (this.state?.avatar) {
      dndInput.addImageByUrl(this.state?.avatar);
    }
  }

  public ngOnDestroy(): void {
    if (this.registerSub) {
      this.registerSub.unsubscribe();
    }
    if (this.configSub) {
      this.configSub.unsubscribe();
    }
    if (this.userSub) {
      this.userSub.unsubscribe();
    }
  }

  protected get formControls(): UserRegister {
    return this.registerForm.controls;
  }

  public getFirstError(control: AbstractControl): string | undefined {
    if (!control.errors) return undefined;

    // return the first available error key and generate an i18n key from it
    const key = Object.keys(control.errors ?? {}).find(() => true);
    if (!key) return undefined;

    if (key === 'notMatching')
      return translate(`form.errors.${key}`, {
        field: translate<string>('pages.register.password'),
      });

    return translate(`form.errors.${key}`);
  }

  protected register(event: Event) {
    event.preventDefault();

    this.error = undefined;

    // Process login data
    if (this.registerForm.invalid) return;

    const value = this.registerForm.getRawValue();

    const baseOptions: RegisterBaseOptions = {
      username: value.username,
      email: value.email,
      avatar: value.avatar,
    };
    let registerOptions: RegisterOptions;

    if (this.state?.provider && this.state?.id) {
      registerOptions = {
        ...baseOptions,
        provider: this.state.provider,
        oauth2_id: this.state.id,
      };
    } else {
      registerOptions = {
        ...baseOptions,
        password: value.password,
        confirmation: value.confirmPassword,
      };
    }

    this.registerSub = this.auth.register(registerOptions).subscribe({
      error: (error: Error | { validation: Record<string, { code: string; message: string }> }) => {
        if (error instanceof Error) {
          this.error = [error.message];
          return;
        } else if (error.validation == undefined) {
          this.error = [translate('pages.register.error.unknown')];
          return;
        }

        for (const key of Object.keys(error.validation)) {
          const control = this.registerForm.get(key);
          if (!control || !error.validation[key]) continue;

          const firstError = error.validation[key].code;
          control.setErrors({ [firstError]: true });
          this.changeDetector.detectChanges();
        }
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

  protected is_config_valid(): boolean {
    return this.config != undefined;
  }

  protected isPasswordProvider(): boolean {
    return this.state?.provider === undefined;
  }
}
