import { USERCOLORS } from "../usercolors.constant";
import { Component, ElementRef, OnInit, ViewChild } from "@angular/core";
import { FormGroup, FormControl, Validators, FormBuilder } from "@angular/forms";
import { User } from "src/models/user_drf.class";
import { BackendService } from '../services/drf/backend-service.service';
import { BackendUserDataService } from '../services/drf/backend-user-data.service';
// import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Router } from "@angular/router";
import { AuthService } from "../services/auth.service";
import { emailValidator, signUpUserNameValidator } from "../shared/validators/custom-validators";

@Component({
  selector: "auth-app-sign-up",
  templateUrl: "./auth-sign-up.component.html",
  styleUrls: ["./auth-sign-up.component.scss"],
})
export class AuthSignUpComponent implements OnInit {
  user = new User();

  signUpForm = new FormGroup({
    signUpUserName: new FormControl("", [Validators.required, signUpUserNameValidator]),
    signUpEmail: new FormControl("", [Validators.required, emailValidator]),
    signUpPassword: new FormControl("", [Validators.required, Validators.minLength(6)]),
  });

  isSubmitted = false;
  emailAdressAlreadyExists = false;

  private userColors: string[] = USERCOLORS;

  @ViewChild("authSuccess", { static: false }) authSuccess: ElementRef;

  constructor(
    // private firestore: AngularFirestore,
    private router: Router,
    private authService: AuthService,
    private fb: FormBuilder,
    private backendService: BackendService,
    private backendUserDataService: BackendUserDataService
  ) {}

  ngOnInit(): void {}

  mailFocus() {
    this.emailAdressAlreadyExists = false;
  }

  onSubmit() {
    // this.signUp();
    this.getUserData();
    this.sendUserToBackend();
  }

  sendUserToBackend() {
    this.backendService.createItem(this.user, "users").subscribe(
      (response) => {
        console.log("User created successfully:", response);
        this.backendUserDataService.lastUserAdded = response;
        this.backendUserDataService.lastUserAddedId = response.id.toString();
        this.backendUserDataService.userAddedSuccessfully = true;
        this.authSuccessAnimation();
      },
      (error) => {
        console.error("Error creating user:", error);
      }
    );
  }

  getUserData() {
    this.user.first_name = this.user.user_name.split(" ")[0];
    this.user.last_name = this.user.user_name.split(" ")[1];
    this.user.initials = this.user.first_name.charAt(0).toUpperCase() + this.user.last_name.charAt(0).toUpperCase();
    this.user.user_color = this.generateColorFromInitials(this.user.initials);
    this.user.phone_number = null;
    this.user.type = "user_from_signup";
    console.log("this.user", this.user);
  }

  signUp() {
    // const userData = this.getUserData();
    // this.authService.signUp(userData).then((res: any) => {
    //   this.populateUser(userData);
    //   this.processSuccessfulSignup();
    // }).catch((error: any) => {
    //   this.handleSignupError(error);
    // });
  }

  // populateUser(userData) {
  //   this.user.userName = userData.userName;
  //   this.user.userFirstName = userData.userFirstName;
  //   this.user.userSurName = userData.userSurName;
  //   this.user.userInitials = userData.userInitials;
  //   this.user.userEmailAddress = userData.email;
  //   this.user.userColor = this.generateColorFromInitials(this.user.userInitials);
  //   this.user.userPhoneNumber = "";
  //   this.user.type = "userSignUp";
  // }

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

  extractUserData() {
    const userName = this.signUpForm.value.signUpUserName;
    const userFirstName = userName.split(" ")[0];
    const userSurName = userName.split(" ")[1];
    const userInitials = userFirstName.charAt(0).toUpperCase() + userSurName.charAt(0).toUpperCase();
    const type = "userSignUp";

    return { userName, userFirstName, userSurName, userInitials, type };
  }

  createUserDataObject() {
    const { userName, userFirstName, userSurName, userInitials, type } = this.extractUserData();
    return {
      userName,
      userFirstName,
      userSurName,
      userInitials,
      email: this.signUpForm.value.signUpEmail,
      password: this.signUpForm.value.signUpPassword,
      type,
    };
  }

  // getUserData() {
  //   return this.createUserDataObject();
  // }

  private generateColorFromInitials(initials: string): string {
    const colorIndex = this.calculateColorIndex(initials);
    return this.userColors[colorIndex];
  }

  private calculateColorIndex(initials: string): number {
    const charCodes = initials.split("").map((char) => char.charCodeAt(0));
    const sum = charCodes.reduce((acc, curr) => acc + curr, 0);
    return sum % this.userColors.length;
  }

  navigateHome() {
    setTimeout(() => {
      this.router.navigate(["/"]);
    }, 1600);
  }

  prepareUserData() {
    const userData = this.user.toJSON();
    // delete userData.firebaseId;
    return userData;
  }

  // addUserToFirestore(userData) {
  //   this.firestore
  //     .collection('users')
  //     .add(userData)
  //     .then((docRef) => {
  //       return docRef.update({ firebaseId: docRef.id });
  //     })
  //     .catch((error) => {
  //       console.error("Error adding or updating document: ", error);
  //     });
  // }

  createNewUserData() {
    const userData = this.prepareUserData();
    // this.addUserToFirestore(userData);
  }

  authSuccessAnimation() {
    this.authSuccess.nativeElement.classList.add("is__active");
    setTimeout(() => {
      this.authSuccess.nativeElement.style.display = "none";
    }, 1450);
  }
}
