import { Component, OnInit } from "@angular/core";
// import { AuthService } from '../services/auth.service';
import { emailValidator } from "../shared/validators/custom-validators";
import { FormBuilder, FormControl, Validators } from "@angular/forms";
import { Router } from "@angular/router";
// import { UserService } from "../services/user-data.service";
import { AuthService } from "../services/drf/auth.service";
import { BackendUserDataService } from "../services/drf/backend-user-data.service";

@Component({
  selector: "auth-app-log-in",
  templateUrl: "./auth-log-in.component.html",
  styleUrls: ["./auth-log-in.component.scss"],
})
export class AuthLogInComponent implements OnInit {
  showLoadingScreen = true;
  logInFailed = false;
  logInError = false;
  logInForm = this.fb.group({
    logInEmail: ["", [Validators.required, emailValidator]],
    logInPassword: ["", Validators.required],
    logInRememberMe: [false],
  });

  isSubmitted = false;

  constructor(
    private backendUserDataService: BackendUserDataService,
    private authService: AuthService,
    private fb: FormBuilder,
    private router: Router
    // private userService: UserService
  ) {}

  ngOnInit(): void {
    this.backendUserDataService.clearUserCache();
    // this.userService.setAllDataToVarAndLocal();
    if (sessionStorage.getItem("appLoaded")) {
      this.showLoadingScreen = false;
    } else {
      sessionStorage.setItem("appLoaded", "true");
      setTimeout(() => {
        this.showLoadingScreen = false;
      }, 1500);
    }

    const token = localStorage.getItem('authToken');
    if (token) {
      this.router.navigate(['/main']); // Benutzer ist bereits eingeloggt
      return;
    }
  }

  onSubmit() {
    if (this.logInForm.invalid) {
      return; // Stoppe, falls das Formular ungültig ist
    }

    const userData = {
      email: this.logInForm.value.logInEmail,
      password: this.logInForm.value.logInPassword,
    };

    this.signIn(userData);

    // const userData = Object.assign(this.logInForm, { email: this.logInForm.value.logInEmail, password: this.logInForm.value.logInPassword });

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
    // const userData = Object.assign(this.logInForm, { email: "gast@gast.de", password: "123456" });
    const userData = {
      email: "guest@example.com",
      password: "123456",
    };
    this.signIn(userData);
    // this.authService.signIn(userData).then((res: any) => {
    //   this.identifyCurrentUserData();
    //   this.isSubmitted = true;
    //   this.logInFailed = false;
    //   this.router.navigateByUrl('main');
    // }).catch((error: any) => {
    //   this.logInFailed = true;
    // });
  }

  signIn(userData) {
    this.authService.signIn(userData).subscribe({
      next: (res: any) => {
        this.isSubmitted = true;
        this.logInFailed = false;

        // Speichere Token und navigiere zur Hauptseite
        localStorage.setItem("authToken", res.token);
        this.router.navigateByUrl("/main");
      },
      error: (err) => {
        console.error("Login-Fehler:", err);
        this.logInFailed = true;
      },
    });
  }

  async identifyCurrentUserData() {
    // await this.userService.getCurrentUserAuth();
    // this.userService.filterCurrentUserData();
    // this.userService.setCurrentUserDataToLocal();
  }
}
