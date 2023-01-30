import { AuthService } from '@app/services/auth.service';
import { Component, OnDestroy, ViewChild } from '@angular/core';
import { NavigationStart, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { User } from '@app/interfaces/User';

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
  protected searchElement!: HTMLInputElement;

  private readonly sub: Subscription;

  public constructor(private auth: AuthService, private router: Router) {
    this.sub = this.router.events.subscribe(event => {
      if (event instanceof NavigationStart) {
        this.isMenuOpened = false;
      }
    });
  }

  protected get isLoggedIn(): boolean {
    return this.auth.isLoggedIn;
  }

  protected get currentUser(): User | undefined {
    return this.auth.currentUser;
  }

  public ngOnDestroy() {
    if (this.sub) this.sub.unsubscribe();
  }

  protected logout(): void {
    this.auth.logout().subscribe();
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

  protected search(): void {
    this.searchElement.blur();
    this.isSearching = false;
  }
}
