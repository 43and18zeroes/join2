import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'auth-app-log-in',
  templateUrl: './auth-log-in.component.html',
  styleUrls: ['./auth-log-in.component.scss']
})
export class AuthLogInComponent implements OnInit {

  showLoadingScreen = true;
  loginError = false;
  loginForm = this.fb.group({
    logInEmail: ['', [Validators.required, Validators.email]],
    logInPassword: ['', Validators.required],
    loginRememberMe: [false]

  });

  constructor(private fb: FormBuilder) { }

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
    if (this.loginForm.valid) {
      const { logInEmail, logInPassword, loginRememberMe } = this.loginForm.value;
      if (loginRememberMe) {
        // Handle das Speichern der Session oder eines Tokens, damit der Benutzer eingeloggt bleibt.
      } else {
        // Verhalte dich wie gewohnt beim Login.
        this.loginError = true; // Falls Daten im Backend nicht übereinstimmen
      }
    }
  }

}
