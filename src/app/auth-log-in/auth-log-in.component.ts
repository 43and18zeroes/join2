import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { emailValidator } from '../shared/validators/custom-validators';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { getAuth } from "firebase/auth";
import { Router } from '@angular/router';
import { UserService } from '../services/user-data.service';

@Component({
  selector: 'auth-app-log-in',
  templateUrl: './auth-log-in.component.html',
  styleUrls: ['./auth-log-in.component.scss']
})
export class AuthLogInComponent implements OnInit {

  allUsersData;
  currentUserAuth;
  currentUserData = [];
  currentUserName;

  showLoadingScreen = true;

  logInFailed = false;
  logInError = false;
  logInForm = this.fb.group({
    logInEmail: ['', [Validators.required, emailValidator]],
    logInPassword: ['', Validators.required],
    logInRememberMe: [false]
  });

  isSubmitted = false;

  constructor(private authService: AuthService,
    private fb: FormBuilder,
    private router: Router,
    private userService: UserService) { }

  ngOnInit(): void {
    this.userService.setAllUsersDataToLocalStorage();
    this.getAllUsersDataFromLocalStorage();
    console.log("allUsersData", this.allUsersData);
    if (sessionStorage.getItem('appLoaded')) {
      this.showLoadingScreen = false;
    } else {
      sessionStorage.setItem('appLoaded', 'true');
      setTimeout(() => {
        this.showLoadingScreen = false;
      }, 1500);
    }
  }

  getAllUsersDataFromLocalStorage() {
    this.allUsersData = JSON.parse(localStorage.getItem('users') || '[]');
  }

  onSubmit() {
    this.signIn();
  }

  signIn() {
    // console.log("this.logInForm.value.logInRememberMe", this.logInForm.value.logInRememberMe);
    const userData = Object.assign(this.logInForm, {email: this.logInForm.value.logInEmail, password: this.logInForm.value.logInPassword});

    this.authService.signIn(userData).then((res: any) => {
      this.getCurrentUserData();
      this.isSubmitted = true;
      this.logInFailed = false;
      this.router.navigateByUrl('main');
    }).catch((error: any) => {
      console.error(error);
      this.logInFailed = true;
    });
  }

  logInGuest() {
    const userData = Object.assign(this.logInForm, {email: "gast@gast.de", password: "123456"});
    this.authService.signIn(userData).then((res: any) => {
      this.getCurrentUserData();
      this.isSubmitted = true;
      this.logInFailed = false;
      this.router.navigateByUrl('main');
    }).catch((error: any) => {
      console.error(error);
      this.logInFailed = true;
    });
  }

  async getCurrentUserData() {
    await this.getCurrentUserAuth();
    this.filterCurrentUserData();
  }

  getCurrentUserAuth(): Promise<void> {
    const auth = getAuth();
    return new Promise((resolve, reject) => {
      auth.onAuthStateChanged((user) => {
        if (user != null) {
          this.currentUserAuth = user;
          resolve();
        } else {
          resolve();
        }
      });
    });
  }

  filterCurrentUserData() {
    for (const key in this.allUsersData) {
      if (this.allUsersData[key].userEmailAddress === this.currentUserAuth.email) {
        this.currentUserData.push(this.allUsersData[key]);
      }
    }
    this.currentUserName = this.currentUserData[0].userName;
    console.log("this.currentUserName", this.currentUserName);
  }
}
