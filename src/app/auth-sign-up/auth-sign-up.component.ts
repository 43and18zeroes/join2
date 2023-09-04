import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'auth-app-sign-up',
  templateUrl: './auth-sign-up.component.html',
  styleUrls: ['./auth-sign-up.component.scss']
})
export class AuthSignUpComponent implements OnInit {

  signUpForm = new FormGroup({
    signUpUserName: new FormControl('', Validators.required),
    signUpEmail: new FormControl('', [Validators.required, Validators.email]),
    signUpPassword: new FormControl('', [Validators.required, Validators.minLength(6)])
  });

  constructor() { }

  ngOnInit(): void {
  }

  onSubmit() {
    console.log(this.signUpForm.value);
    // Hier können Sie z.B. einen Service aufrufen, um die Daten an einen Server zu senden.
  }

}
