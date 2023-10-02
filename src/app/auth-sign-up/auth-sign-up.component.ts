import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { User } from 'src/models/user.class';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { emailValidator, signUpUserNameValidator } from '../shared/validators/custom-validators';

@Component({
  selector: 'auth-app-sign-up',
  templateUrl: './auth-sign-up.component.html',
  styleUrls: ['./auth-sign-up.component.scss']
})
export class AuthSignUpComponent implements OnInit {

  user = new User();

  signUpForm = new FormGroup({
    signUpUserName: new FormControl('', [Validators.required, signUpUserNameValidator]),
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
    const userData = this.getUserData();
    
    this.authService.signUp(userData).then((res: any) => {
      this.user.userName = userData.userName;
      this.user.userFirstName = userData.userFirstName;
      this.user.userSurName = userData.userSurName;
      this.user.userInitials = userData.userInitials;
      this.user.userEmailAddress = userData.email;

      this.isSubmitted = true;
      this.createNewUserData();
      this.authSuccessAnimation();
      this.navigateHome();
    }).catch((error: any) => {
      console.error(error);
      this.emailAdressAlreadyExists = true;
    });
  }

  getUserData() {
    const userName = this.signUpForm.value.signUpUserName;
    const userFirstName = userName.split(' ')[0];
    const userSurName = userName.split(' ')[1];
    const userInitials = userFirstName.charAt(0).toUpperCase() + userSurName.charAt(0).toUpperCase();

    return {
      userName: userName,
      userFirstName: userFirstName,
      userSurName: userSurName,
      userInitials: userInitials,
      email: this.signUpForm.value.signUpEmail,
      password: this.signUpForm.value.signUpPassword
    };
  }

  navigateHome() {
    setTimeout(() => {
      this.router.navigate(['/']);
    }, 1600);
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
