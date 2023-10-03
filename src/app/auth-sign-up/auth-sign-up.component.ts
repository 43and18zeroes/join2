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

    return {
      userName: userName,
      userFirstName: userFirstName,
      userSurName: userSurName,
      userInitials: userInitials,
      email: this.signUpForm.value.signUpEmail,
      password: this.signUpForm.value.signUpPassword
    };
  }

  generateColorFromInitials(initials: string): string {
    // Liste von attraktiven und modernen Farben
    const colors = [
        '#FF5733', '#33FF57', '#5733FF', '#33FFF5', '#F533FF', '#FFC300', '#DAF7A6',
        '#FFC3A0', '#FF5733', '#C70039', '#9C27B0', '#673AB7', '#3F51B5', '#03A9F4',
        '#00BCD4', '#009688', '#4CAF50', '#8BC34A', '#CDDC39', '#FFEB3B', '#FFC107',
        '#FF9800', '#FF5722', '#795548', '#9E9E9E', '#607D8B', '#B71C1C', '#880E4F',
        '#4A148C', '#311B92', '#1A237E', '#0D47A1', '#01579B', '#006064', '#004D40',
        '#1B5E20', '#33691E', '#827717', '#F57F17', '#E65100', '#BF360C', '#3E2723',
        '#212121', '#263238', '#DD2C00', '#004D40'
    ];

    // ASCII-Werte der Initialen berechnen
    const charCodes = initials.split('').map(char => char.charCodeAt(0));
    const sum = charCodes.reduce((acc, curr) => acc + curr, 0);

    // Eine Farbe aus der Liste basierend auf den Initialen auswählen
    const colorIndex = sum % colors.length;
    return colors[colorIndex];
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
