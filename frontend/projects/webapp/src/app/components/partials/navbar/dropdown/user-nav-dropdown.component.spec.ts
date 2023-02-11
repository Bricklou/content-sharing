import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserNavDropdownComponent } from './user-nav-dropdown.component';

describe('DropdownComponent', () => {
  let component: UserNavDropdownComponent;
  let fixture: ComponentFixture<UserNavDropdownComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [UserNavDropdownComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(UserNavDropdownComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
