import { FormControl } from '@angular/forms';

export function emailValidator(control: FormControl): { [key: string]: any } | null {
    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
    const valid = emailRegex.test(control.value);
    return valid ? null : { invalidEmail: true };
}