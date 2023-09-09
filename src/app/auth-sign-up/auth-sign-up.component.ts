import { Component, ElementRef, OnInit, ViewChild, inject } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { User } from 'src/models/user.class';
import { Firestore, collection, collectionData } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Router } from '@angular/router';

@Component({
  selector: 'auth-app-sign-up',
  templateUrl: './auth-sign-up.component.html',
  styleUrls: ['./auth-sign-up.component.scss']
})
export class AuthSignUpComponent implements OnInit {

  user = new User();

  signUpForm = new FormGroup({
    signUpUserName: new FormControl('', [Validators.required, Validators.maxLength(16)]),
    signUpEmail: new FormControl('', [Validators.required, this.emailValidator]),
    signUpPassword: new FormControl('', [Validators.required, Validators.minLength(6)])
  });

  @ViewChild('signUpSuccess', { static: false }) signUpSuccess: ElementRef;

  constructor(private firestore: AngularFirestore,
    private router: Router) { }

  ngOnInit(): void {
  }

  emailValidator(control: FormControl): { [key: string]: any } | null {
    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
    const valid = emailRegex.test(control.value);
    return valid ? null : { invalidEmail: true };
  }

  onSubmit() {
    console.log("Current user is", this.user);
    console.log("this.signUpForm", this.signUpForm);
    this.firestore
      .collection('users')
      .add(this.user.toJSON())
      .then((result: any) => {
        console.log("adding user finished", result);
      });
    this.signUpForm.reset();
    this.signUpSuccessAnimation();
    setTimeout(() => {
      this.router.navigate(['/']);
    }, 1600);
  }

  signUpSuccessAnimation() {
    this.signUpSuccess.nativeElement.classList.add('is__active');
    setTimeout(() => {
      this.signUpSuccess.nativeElement.style.display = "none";
    }, 1450);
  }

}
