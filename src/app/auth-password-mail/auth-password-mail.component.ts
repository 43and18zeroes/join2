import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-auth-password-mail',
  templateUrl: './auth-password-mail.component.html',
  styleUrls: ['./auth-password-mail.component.scss']
})
export class AuthPasswordMailComponent implements OnInit {

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
