import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-button',
  templateUrl: './button.component.html',
  styleUrls: ['./button.component.css'],
})
export class ButtonComponent {
  @Input() public type: 'button' | 'submit' = 'button';
  @Input() public disabled = false;
  @Input() public dark = false;
  @Input() public icon?: string;
  @Output() public btnClick = new EventEmitter<Event>();

  protected onClick(event: Event): void {
    this.btnClick.emit(event);
  }
}
