import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { emailValidator } from '../shared/validators/custom-validators';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { UserService } from '../services/user-data.service';

@Component({
  selector: 'auth-app-log-in',
  templateUrl: './auth-log-in.component.html',
  styleUrls: ['./auth-log-in.component.scss']
})
export class AuthLogInComponent implements OnInit {

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
    this.userService.setAllDataToVarAndLocal();
    if (sessionStorage.getItem('appLoaded')) {
      this.showLoadingScreen = false;
    } else {
      sessionStorage.setItem('appLoaded', 'true');
      setTimeout(() => {
        this.showLoadingScreen = false;
      }, 1500);
    }
  }

  onSubmit() {
    const userData = Object.assign(this.logInForm, { email: this.logInForm.value.logInEmail, password: this.logInForm.value.logInPassword });
    // this.authService.signIn(userData).then((res: any) => {
    //   this.identifyCurrentUserData();
    //   this.isSubmitted = true;
    //   this.logInFailed = false;
    //   this.router.navigateByUrl('main');
    // }).catch((error: any) => {
    //   this.logInFailed = true;
    // });
  }

  logInGuest() {
    const userData = Object.assign(this.logInForm, { email: "gast@gast.de", password: "123456" });
    // this.authService.signIn(userData).then((res: any) => {
    //   this.identifyCurrentUserData();
    //   this.isSubmitted = true;
    //   this.logInFailed = false;
    //   this.router.navigateByUrl('main');
    // }).catch((error: any) => {
    //   this.logInFailed = true;
    // });
  }

  async identifyCurrentUserData() {
    // await this.userService.getCurrentUserAuth();
    this.userService.filterCurrentUserData();
    // this.userService.setCurrentUserDataToLocal();
  }
}
