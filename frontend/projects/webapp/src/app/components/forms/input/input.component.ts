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
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => InputComponent),
      multi: true,
    },
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
  @Output() public inputModelChange: EventEmitter<string> = new EventEmitter<string>();
  @ViewChild('input')
  protected inputEl!: ElementRef<HTMLInputElement>;

  protected _value = '';

  @Input()
  public get value(): string {
    return this._value;
  }

  public set value(value: string) {
    this._value = value;
    this.onChange(this._value);
  }

  /*eslint-disable @typescript-eslint/no-empty-function*/

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public onChange = (_: string) => {};
  protected onTouch = () => {};

  /* eslint-enable @typescript-eslint/no-empty-function */

  public writeValue(value?: string): void {
    if (value) {
      this.value = value;
    }
  }

  public registerOnChange(fn: (_: string) => void): void {
    this.onChange = fn;
  }

  public registerOnTouched(fn: () => void): void {
    this.onTouch = fn;
  }

  public setDisabledState?(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }

  public focus(): void {
    setTimeout(() => {
      this.inputEl.nativeElement.focus();
    });
  }

  public blur() {
    this.inputEl.nativeElement.blur();
  }
}
