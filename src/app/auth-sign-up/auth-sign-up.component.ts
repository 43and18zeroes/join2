import { Component, ElementRef, OnInit, ViewChild, inject } from '@angular/core';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { User } from 'src/models/user.class';
import { Firestore, collection, collectionData } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

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

  @ViewChild('authSuccess', { static: false }) authSuccess: ElementRef;

  constructor(private firestore: AngularFirestore,
    private router: Router,
    private authService: AuthService,
    private fb: FormBuilder) { }

  ngOnInit(): void {
  }

  emailValidator(control: FormControl): { [key: string]: any } | null {
    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
    const valid = emailRegex.test(control.value);
    return valid ? null : { invalidEmail: true };
  }

  onSubmit() {
    // console.log("Current user is", this.user);
    // console.log("this.signUpForm", this.signUpForm);
    // this.firestore
    //   .collection('users')
    //   .add(this.user.toJSON())
    //   .then((result: any) => {
    //     console.log("adding user finished", result);
    //   });
    // this.signUpForm.reset();

    this.signUpWithEmailAndPassword();
    this.authSuccessAnimation();
    setTimeout(() => {
      this.router.navigate(['/']);
    }, 1600);
  }

  signUpWithEmailAndPassword() {
    console.log(this.signUpForm.value);
    const userData = Object.assign(this.signUpForm, {email: this.signUpForm.value.signUpEmail, password: this.signUpForm.value.signUpPassword});
    console.log("userData", userData);
    this.authService.signUpWithEmailAndPassword(userData).then((res: any) => {
      this.router.navigateByUrl('/');
    }).catch((error: any) => {
      console.error(error);
    });
  }

  authSuccessAnimation() {
    this.authSuccess.nativeElement.classList.add('is__active');
    setTimeout(() => {
      this.authSuccess.nativeElement.style.display = "none";
    }, 1450);
  }

}
