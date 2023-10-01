import { FormControl } from '@angular/forms';

export function emailValidator(control: FormControl): { [key: string]: any } | null {
    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
    const valid = emailRegex.test(control.value);
    return valid ? null : { invalidEmail: true };
}

export function signUpUserNameValidator(control: FormControl): { [key: string]: any } | null {
    const signUpUserNameRegex = /^(?=.{1,32}$)(.{1,31})\s+(.{1,31})$/;
    const valid = signUpUserNameRegex.test(control.value);
    return valid ? null : { invalidSignUpUserNameName: true };
}