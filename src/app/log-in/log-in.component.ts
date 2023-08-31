import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-log-in',
  templateUrl: './log-in.component.html',
  styleUrls: ['./log-in.component.scss']
})
export class LogInComponent implements OnInit {

  loginError = false;
  loginForm = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', Validators.required],
    rememberMe: [false]

  });

  constructor(private fb: FormBuilder) { }

  ngOnInit(): void {
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
