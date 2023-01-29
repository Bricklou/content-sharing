import {
  Component,
  ElementRef,
  EventEmitter,
  forwardRef,
  Input,
  Output,
  ViewChild,
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
  selector: 'app-input',
  templateUrl: './input.component.html',
  styleUrls: ['./input.component.css'],
  providers: [
    { provide: NG_VALUE_ACCESSOR, useExisting: forwardRef(() => InputComponent), multi: true },
  ],
})
export class InputComponent implements ControlValueAccessor {
  @Input() public elId!: string;
  @Input() public label?: string;
  @Input() public type: HTMLInputElement['type'] = 'text';
  @Input() public placeholder?: string;
  @Input() public disabled?: boolean;
  @Input() public name!: string;
  @Input() public required = false;
  protected _value = '';

  @ViewChild('input', { static: true })
  protected inputEl!: ElementRef<HTMLInputElement>;

  @Input()
  public get value(): string {
    return this._value;
  }

  public set value(value: string) {
    this._value = value;
    if (this.propagateChange) {
      this.propagateChange(this._value);
    }
  }

  @Output() public inputModelChange: EventEmitter<string> = new EventEmitter<string>();

  public propagateChange?: (_: string) => void;
  protected propagateBlur?: () => void;

  public writeValue(value?: string): void {
    if (value) {
      this.value = value;
    }
  }

  public registerOnChange(fn: (_: string) => void): void {
    this.propagateChange = fn;
  }

  public registerOnTouched(fn: () => void): void {
    this.propagateBlur = fn;
  }

  public setDisabledState?(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }

  public focus(): void {
    setTimeout(() => {
      this.inputEl.nativeElement.focus();
    });
  }

  protected onBlur() {
    this.propagateBlur?.();
  }

  public blur() {
    this.inputEl.nativeElement.blur();
  }
}
