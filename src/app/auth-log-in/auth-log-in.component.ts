import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';
import { emailValidator } from '../shared/validators/custom-validators';

@Component({
  selector: 'auth-app-log-in',
  templateUrl: './auth-log-in.component.html',
  styleUrls: ['./auth-log-in.component.scss']
})
export class AuthLogInComponent implements OnInit {

  showLoadingScreen = true;

  logInFailed = false;
  logInError = false;
  logInForm = this.fb.group({
    logInEmail: ['', [Validators.required, emailValidator]],
    logInPassword: ['', Validators.required]
    // logInRememberMe: [false]
  });

  isSubmitted = false;

  constructor(private authService: AuthService,
    private fb: FormBuilder,
    private router: Router) { }

  ngOnInit(): void {
    if (sessionStorage.getItem('appLoaded')) {
      this.showLoadingScreen = false;
    } else {
      sessionStorage.setItem('appLoaded', 'true');
      setTimeout(() => {
        this.showLoadingScreen = false;
      }, 1500);
    }
  }

  // emailValidator(control: FormControl): { [key: string]: any } | null {
  //   const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
  //   const valid = emailRegex.test(control.value);
  //   return valid ? null : { invalidEmail: true };
  // }

  onSubmit() {
    this.signIn();

    // if (this.logInForm.valid) {
    //   const { logInEmail, logInPassword, logInRememberMe } = this.logInForm.value;
    //   if (logInRememberMe) {
    //     // Handle das Speichern der Session oder eines Tokens, damit der Benutzer eingeloggt bleibt.
    //   } else {
    //     // Verhalte dich wie gewohnt beim Login.
    //     this.logInError = true; // Falls Daten im Backend nicht übereinstimmen
    //   }
    // }
  }

  signIn() {
    console.log(this.logInForm.value);
    const userData = Object.assign(this.logInForm, {email: this.logInForm.value.logInEmail, password: this.logInForm.value.logInPassword});

    this.authService.signIn(userData).then((res: any) => {
      this.isSubmitted = true;
      this.logInFailed = false;
      this.router.navigateByUrl('main');
    }).catch((error: any) => {
      console.error(error);
      this.logInFailed = true;
    });
  }

}
