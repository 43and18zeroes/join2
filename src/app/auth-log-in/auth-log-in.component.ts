import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'auth-app-log-in',
  templateUrl: './auth-log-in.component.html',
  styleUrls: ['./auth-log-in.component.scss']
})
export class AuthLogInComponent implements OnInit {

  showLoadingScreen = true;
  logInError = false;
  logInForm = this.fb.group({
    logInEmail: ['', [Validators.required, Validators.email]],
    logInPassword: ['', Validators.required]
    // logInRememberMe: [false]

  });

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

  onSubmit() {
    this.loginWithEmailAndPassword();

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

  loginWithEmailAndPassword() {
    console.log(this.logInForm.value);
    const userData = Object.assign(this.logInForm, {email: this.logInForm.value.logInEmail, password: this.logInForm.value.logInPassword});

    this.authService.signWithEmailAndPassword(userData).then((res: any) => {
      this.router.navigateByUrl('main');
    }).catch((error: any) => {
      console.error(error);
    });
  }

}
