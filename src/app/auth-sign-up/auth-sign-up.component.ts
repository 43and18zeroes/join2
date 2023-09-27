import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { User } from 'src/models/user.class';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { emailValidator } from '../shared/validators/custom-validators';

@Component({
  selector: 'auth-app-sign-up',
  templateUrl: './auth-sign-up.component.html',
  styleUrls: ['./auth-sign-up.component.scss']
})
export class AuthSignUpComponent implements OnInit {

  user = new User();

  signUpForm = new FormGroup({
    signUpUserName: new FormControl('', [Validators.required, Validators.maxLength(32)]),
    signUpEmail: new FormControl('', [Validators.required, emailValidator]),
    signUpPassword: new FormControl('', [Validators.required, Validators.minLength(6)])
  });

  isSubmitted = false;
  emailAdressAlreadyExists = false;

  @ViewChild('authSuccess', { static: false }) authSuccess: ElementRef;

  constructor(private firestore: AngularFirestore,
    private router: Router,
    private authService: AuthService,
    private fb: FormBuilder) { }

  ngOnInit(): void {
  }

  mailFocus() {
    this.emailAdressAlreadyExists = false;
  }

  onSubmit() {
    this.signUp();
  }

  signUp() {
    const userData = Object.assign(this.signUpForm, { userName: this.signUpForm.value.signUpUserName, email: this.signUpForm.value.signUpEmail, password: this.signUpForm.value.signUpPassword });
    this.authService.signUp(userData).then((res: any) => {
      this.isSubmitted = true;
      this.createNewUserData();
      this.authSuccessAnimation();
      setTimeout(() => {
        this.router.navigate(['/']);
      }, 1600);
    }).catch((error: any) => {
      console.error(error);
      this.emailAdressAlreadyExists = true;
    });
  }

  createNewUserData() {
    this.firestore
      .collection('users')
      .add(this.user.toJSON())
      .then((result: any) => {
        console.log("Adding user finished", result);
      })
  }

  authSuccessAnimation() {
    this.authSuccess.nativeElement.classList.add('is__active');
    setTimeout(() => {
      this.authSuccess.nativeElement.style.display = "none";
    }, 1450);
  }

}
