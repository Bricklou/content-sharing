import { AuthService } from '@app/services/auth.service';
import { ChangeDetectorRef, Component, OnDestroy, ViewChild } from '@angular/core';
import { NavigationStart, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { InputComponent } from '@app/components/forms/input/input.component';

@Component({
  selector: 'app-nav-bar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css'],
})
export class NavBarComponent implements OnDestroy {
  protected isSearching = false;
  protected searchValue = '';
  protected isMenuOpened = false;

  @ViewChild('searchElement')
  protected searchElement!: InputComponent;

  private readonly sub: Subscription;

  public constructor(
    private auth: AuthService,
    private router: Router,
    private changeDetectorRef: ChangeDetectorRef,
  ) {
    this.sub = this.router.events.subscribe(event => {
      if (event instanceof NavigationStart) {
        this.isMenuOpened = false;
      }
    });
  }

  public ngOnDestroy() {
    if (this.sub) this.sub.unsubscribe();
  }

  protected toggleSearch(): void {
    this.isSearching = !this.isSearching;

    if (this.isSearching) {
      this.searchElement.focus();
    }
  }

  protected toggleMenu(): void {
    this.isMenuOpened = !this.isMenuOpened;
  }

  protected async search(): Promise<void> {
    this.searchElement.blur();
    this.isSearching = false;

    if (this.searchValue === '//w') {
      await this.router.navigate(['/widgets']);
    }

    this.searchValue = '';
  }
}
