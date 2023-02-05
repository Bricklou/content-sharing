import { Component, Inject, OnDestroy, ViewChild } from '@angular/core';
import { FormControl, FormGroup, NonNullableFormBuilder, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { AppConfig, OAuthProviders } from '@app/interfaces/AppConfig';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '@app/services/auth.service';
import { ConfigService } from '@app/services/config.service';
import { DOCUMENT } from '@angular/common';
import { User } from '@app/interfaces/User';
import { DragAndDropComponent } from '@app/components/forms/drag-and-drop/drag-and-drop.component';

interface UserRegister {
  username: FormControl<string>;
  email: FormControl<string>;
  avatar: FormControl<string>;
  password: FormControl<string>;
  confirmPassword: FormControl<string>;
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

  private state?: User;

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

    const currentNavigation = router.getCurrentNavigation();
    if (!currentNavigation) {
      void router.navigate(['/']);
      return;
    }
    this.state = currentNavigation.extras.state as User | undefined;

    if (!this.state?.username) {
      void router.navigate(['/']);
      return;
    }

    this.registerForm = this.formBuilder.group({
      username: [this.state.username, [Validators.required, Validators.maxLength(150)]],
      email: [this.state.email, [Validators.required, Validators.maxLength(150)]],
      avatar: [this.state.avatar || '', [Validators.required]],
      password: ['', [Validators.required, Validators.maxLength(128)]],
      confirmPassword: ['', [Validators.required, Validators.maxLength(128)]],
    });

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

  protected register(event: Event) {
    event.preventDefault();

    this.error = undefined;

    // Process login data
    if (this.registerForm.invalid) return;

    const value = this.registerForm.value;
    if (!value.email || !value.avatar || !value.password || !value.confirmPassword) {
      return;
    }

    this.registerSub = this.auth
      .register({
        email: value.email,
        avatar: value.avatar,
        password: value.password,
        confirmPassword: value.confirmPassword,
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

  protected is_config_valid(): boolean {
    return this.config != undefined;
  }
}
