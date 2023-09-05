import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-auth-confirm-new-password',
  templateUrl: './auth-confirm-new-password.component.html',
  styleUrls: ['./auth-confirm-new-password.component.scss']
})
export class AuthConfirmNewPasswordComponent implements OnInit {

  confirmNewPasswordForm = new FormGroup({
    confirmNewPasswordPassword: new FormControl('', [Validators.required, Validators.minLength(6)])
  });

  constructor() { }

  ngOnInit(): void {
  }

  onSubmit() {
    // Hier können Sie z.B. einen Service aufrufen, um die Daten an einen Server zu senden.
  }
}
