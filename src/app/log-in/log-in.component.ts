import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-log-in',
  templateUrl: './log-in.component.html',
  styleUrls: ['./log-in.component.scss']
})
export class LogInComponent implements OnInit {

  showLoadingScreen = true;
  loginError = false;
  loginForm = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', Validators.required],
    rememberMe: [false]

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
      const { email, password, rememberMe } = this.loginForm.value;
      if (rememberMe) {
        // Handle das Speichern der Session oder eines Tokens, damit der Benutzer eingeloggt bleibt.
      } else {
        // Verhalte dich wie gewohnt beim Login.
        this.loginError = true; // Falls Daten im Backend nicht übereinstimmen
      }
    }
  }

}
