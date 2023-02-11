import { AbstractControl, ValidatorFn } from '@angular/forms';

export default class Validation {
  static match(controlName: string, checkControlName: string): ValidatorFn {
    return (controls: AbstractControl) => {
      const control = controls.get(controlName);
      const checkControl = controls.get(checkControlName);

      if (!control || !checkControl) return null;

      if (checkControl.errors && !checkControl.hasError('notMatching')) {
        return null;
      }

      if (control.value !== checkControl.value) {
        control.setErrors({ notMatching: true });
        checkControl.setErrors({ notMatching: true });
        return { notMatching: true };
      } else {
        control.setErrors(null);
        checkControl.setErrors(null);
        return null;
      }
    };
  }
}
