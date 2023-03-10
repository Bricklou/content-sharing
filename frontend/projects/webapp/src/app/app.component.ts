import { Component, OnDestroy } from '@angular/core';
import { LoadingBarService } from './services/loading-bar.service';
import {
  ActivatedRoute,
  NavigationCancel,
  NavigationEnd,
  NavigationError,
  NavigationStart,
  Router,
} from '@angular/router';
import { Subscription } from 'rxjs';
import { AuthService } from '@app/services/auth.service';
import { ConfigService } from '@app/services/config.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnDestroy {
  public title = 'webapp';

  private sub: Subscription;
  protected hideNavbar = false;

  public constructor(
    private loadingBar: LoadingBarService,
    private router: Router,
    private route: ActivatedRoute,
    private auth: AuthService,
    private config: ConfigService,
  ) {
    this.config.refresh().subscribe();
    this.auth.refresh().subscribe();
    this.sub = this.router.events.subscribe({
      next: event => {
        if (event instanceof NavigationStart) {
          this.loadingBar.start();
        } else if (
          event instanceof NavigationEnd ||
          event instanceof NavigationCancel ||
          event instanceof NavigationError
        ) {
          this.loadingBar.complete();

          this.hideNavbar =
            (route.root.firstChild?.snapshot.data['hideNavbar'] as boolean) || false;
        }
      },
      error: () => {
        this.loadingBar.complete();
      },
    });
  }

  public ngOnDestroy(): void {
    this.sub.unsubscribe();
  }
}
