import { Component, OnInit, inject } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { User } from 'src/models/user.class';
import { Firestore, collection, collectionData } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { AngularFirestore } from '@angular/fire/compat/firestore';

@Component({
  selector: 'auth-app-sign-up',
  templateUrl: './auth-sign-up.component.html',
  styleUrls: ['./auth-sign-up.component.scss']
})
export class AuthSignUpComponent implements OnInit {


  user = new User();

  signUpForm = new FormGroup({
    signUpUserName: new FormControl('', Validators.required),
    signUpEmail: new FormControl('', [Validators.required, this.emailValidator]),
    signUpPassword: new FormControl('', [Validators.required, Validators.minLength(6)])
  });

  constructor(private firestore: AngularFirestore) {

  }

  ngOnInit(): void {
  }

  emailValidator(control: FormControl): { [key: string]: any } | null {
    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
    const valid = emailRegex.test(control.value);
    return valid ? null : { invalidEmail: true };
  }

  onSubmit() {
    console.log(this.signUpForm.value);
    // Hier können Sie z.B. einen Service aufrufen, um die Daten an einen Server zu senden.
  }

  saveUser() {
    console.log("Current user is", this.user);

    this.firestore
      .collection('users')
      .add(this.user.toJSON())
      .then((result: any) => {
        console.log("adding user finished", result);
      });
  }

}
