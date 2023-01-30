import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-alert',
  templateUrl: './alert.component.html',
  styleUrls: ['./alert.component.css'],
})
export class AlertComponent {
  @Input() public type: 'success' | 'info' | 'warning' | 'error' | 'neutral' = 'neutral';

  @Input() public closable = false;

  @Output() public alertClose = new EventEmitter<void>();

  protected _close() {
    this.alertClose.emit();
  }
}
