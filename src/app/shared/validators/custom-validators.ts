import { FormControl } from '@angular/forms';

export function signUpUserNameValidator(control: FormControl): { [key: string]: any } | null {
    const signUpUserNameRegex = /^[a-zA-ZäöüÄÖÜ\-]+\s[a-zA-ZäöüÄÖÜ\-]+$/;
    const valid = signUpUserNameRegex.test(control.value);
    return valid ? null : { invalidSignUpUserNameName: true };
}

export function emailValidator(control: FormControl): { [key: string]: any } | null {
    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
    const valid = emailRegex.test(control.value);
    return valid ? null : { invalidEmail: true };
}