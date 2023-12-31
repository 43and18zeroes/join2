import { FormControl } from '@angular/forms';

export function signUpUserNameValidator(control: FormControl): { [key: string]: any } | null {
    const signUpUserNameRegex = /^[a-zA-ZäöüÄÖÜß\-]+\s[a-zA-ZäöüÄÖÜß\-]+$/;
    const valid = signUpUserNameRegex.test(control.value);
    return valid ? null : { invalidSignUpUserNameName: true };
}

export function emailValidator(control: FormControl): { [key: string]: any } | null {
    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
    const valid = emailRegex.test(control.value);
    return valid ? null : { invalidEmail: true };
}

export function phoneValidator(control: FormControl): { [key: string]: any } | null {
    const phoneRegex = /^(?:(?:\+)?\d[-\s]*){4,32}$/;
    const valid = phoneRegex.test(control.value);
    return valid ? null : { invalidPhone: true };
}