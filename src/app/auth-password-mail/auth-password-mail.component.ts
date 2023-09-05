import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-auth-password-mail',
  templateUrl: './auth-password-mail.component.html',
  styleUrls: ['./auth-password-mail.component.scss']
})
export class AuthPasswordMailComponent implements OnInit {

  signUpForm = new FormGroup({
    signUpUserName: new FormControl('', Validators.required),
    signUpEmail: new FormControl('', [Validators.required, Validators.email]),
    signUpPassword: new FormControl('', [Validators.required, Validators.minLength(6)])
  });

  constructor() { }

  ngOnInit(): void {
  }

  onSubmit() {
    // Hier können Sie z.B. einen Service aufrufen, um die Daten an einen Server zu senden.
  }

}
