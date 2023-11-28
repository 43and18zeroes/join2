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

  private colors: string[] = [
    '#003366', '#004080', '#00509E', '#0055A4', '#005FB3', '#006633',
    '#007040', '#007B4F', '#008060', '#008755', '#8B0000', '#9B111E',
    '#A31220', '#A92328', '#B22222', '#800080', '#872657', '#8B008B',
    '#93218E', '#992E92', '#00CED1', '#20B2AA', '#40E0D0', '#48D1CC',
    '#5F9EA0', '#FF4500', '#FF6347', '#FF7F50', '#FF8C00', '#993333',
    '#996633', '#996600', '#CC9900', '#C7A317', '#003B6F', '#00428A',
    '#004DA1', '#0052B1', '#005BC3', '#006F42', '#007A58', '#008269',
    '#008C7A', '#009688', '#9B1B1E', '#A51821', '#AF1F27', '#B92B2E',
    '#C33A3A', '#872272', '#8E2D80', '#952D8A', '#9C3193', '#A43B9D',
    '#10D3D1', '#30DAC2', '#40DFB3', '#58E5A0', '#66EB90', '#FF5010',
    '#FF6C38', '#FF8245', '#FF9955', '#882211', '#884411', '#886611',
    '#D9C742', '#DAC952', '#004380', '#004B95', '#0055A5', '#0060B5',
    '#006CC8', '#007850', '#008365', '#009079', '#009D90', '#00B0A2',
    '#A52229', '#B02E31', '#BC3C3C', '#C84848', '#D35959', '#903290',
    '#97389A', '#A140A5', '#A946AF', '#B250BA', '#50E8B0', '#64EC9F',
    '#78EF8F', '#8CF280', '#A0F672', '#884400', '#886600', '#FFBF50',
    '#FFCA68', '#773311'
  ];

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
      this.populateUser(userData);
      this.processSuccessfulSignup();
    }).catch((error: any) => {
      this.handleSignupError(error);
    });
  }

  populateUser(userData) {
    this.user.userName = userData.userName;
    this.user.userFirstName = userData.userFirstName;
    this.user.userSurName = userData.userSurName;
    this.user.userInitials = userData.userInitials;
    this.user.userEmailAddress = userData.email;
    this.user.userColor = this.generateColorFromInitials(this.user.userInitials);
    this.user.userPhoneNumber = "";
    this.user.type = "userSignUp";
  }

  processSuccessfulSignup() {
    this.isSubmitted = true;
    this.createNewUserData();
    this.authSuccessAnimation();
    this.navigateHome();
  }

  handleSignupError(error: any) {
    console.error(error);
    this.emailAdressAlreadyExists = true;
  }

  getUserData() {
    const userName = this.signUpForm.value.signUpUserName;
    const userFirstName = userName.split(' ')[0];
    const userSurName = userName.split(' ')[1];
    const userInitials = userFirstName.charAt(0).toUpperCase() + userSurName.charAt(0).toUpperCase();
    const type = "userSignUp"

    return {
      userName: userName,
      userFirstName: userFirstName,
      userSurName: userSurName,
      userInitials: userInitials,
      email: this.signUpForm.value.signUpEmail,
      password: this.signUpForm.value.signUpPassword,
      type: type
    };
  }

  private generateColorFromInitials(initials: string): string {
    const colorIndex = this.calculateColorIndex(initials);
    return this.colors[colorIndex];
  }

  private calculateColorIndex(initials: string): number {
    const charCodes = initials.split('').map(char => char.charCodeAt(0));
    const sum = charCodes.reduce((acc, curr) => acc + curr, 0);
    return sum % this.colors.length;
  }

  navigateHome() {
    setTimeout(() => {
      this.router.navigate(['/']);
    }, 1600);
  }

  createNewUserData() {
    const userData = this.user.toJSON();
    delete userData.firebaseId;

    this.firestore
      .collection('users')
      .add(userData)
      .then((docRef) => {
        return docRef.update({ firebaseId: docRef.id });
      })
      .then(() => {
      })
      .catch((error) => {
        console.error("Error adding or updating document: ", error);
      });
  }

  authSuccessAnimation() {
    this.authSuccess.nativeElement.classList.add('is__active');
    setTimeout(() => {
      this.authSuccess.nativeElement.style.display = "none";
    }, 1450);
  }

}
