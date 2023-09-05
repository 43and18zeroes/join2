import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-auth-confirm-new-password',
  templateUrl: './auth-confirm-new-password.component.html',
  styleUrls: ['./auth-confirm-new-password.component.scss']
})
export class AuthConfirmNewPasswordComponent implements OnInit {

  passwordMailForm = new FormGroup({
    passwordMailEmail: new FormControl('', [Validators.required, Validators.email])
  });

  constructor() { }

  ngOnInit(): void {
  }

  onSubmit() {
    // Hier können Sie z.B. einen Service aufrufen, um die Daten an einen Server zu senden.
  }
}
