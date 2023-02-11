import { Component, HostListener } from '@angular/core';
import { AuthService } from '@app/services/auth.service';
import { User } from '@app/interfaces/User';

@Component({
  selector: 'app-dropdown',
  templateUrl: './user-nav-dropdown.component.html',
  styleUrls: ['./user-nav-dropdown.component.css'],
})
export class UserNavDropdownComponent {
  protected isOpen = false;
  private isInside = false;

  public constructor(private auth: AuthService) {}

  @HostListener('click')
  protected onClick() {
    this.isInside = true;
  }

  @HostListener('document:click', ['$event'])
  protected onDocumentClick() {
    if (this.isOpen && !this.isInside) {
      this.isOpen = false;
    }
    this.isInside = false;
  }

  protected toggle() {
    this.isOpen = !this.isOpen;
  }

  protected logout() {
    this.auth.logout().subscribe();
  }

  protected get currentUser(): User | undefined {
    return this.auth.currentUser;
  }
}
