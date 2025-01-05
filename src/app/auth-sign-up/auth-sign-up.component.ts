import { Component, ElementRef, OnInit, ViewChild } from "@angular/core";
import { FormGroup, FormControl, Validators } from "@angular/forms";
import { Router } from "@angular/router";
import { USERCOLORS } from "../usercolors.constant";
import { User } from "src/models/user_drf.class";
import { BackendService } from "../services/drf/backend-service.service";
import { BackendUserDataService } from "../services/drf/backend-user-data.service";
import { emailValidator, signUpUserNameValidator } from "../shared/validators/custom-validators";
import { SignupService } from "../services/drf/signup.service";
import { MatDialog } from "@angular/material/dialog";
import { PrivacyPolicyComponent } from "./privacy-policy/privacy-policy.component";

@Component({
  selector: "auth-app-sign-up",
  templateUrl: "./auth-sign-up.component.html",
  styleUrls: ["./auth-sign-up.component.scss"],
})
export class AuthSignUpComponent implements OnInit {
  @ViewChild("authSuccess", { static: false }) authSuccess: ElementRef;

  signUpForm: FormGroup;
  user: User = new User();
  userColors: string[] = USERCOLORS;
  isSubmitted = false;
  emailAdressAlreadyExists = false;

  constructor(
    private router: Router,
    private backendService: BackendService,
    private backendUserDataService: BackendUserDataService,
    private signupService: SignupService,
    public dialog: MatDialog
  ) {
    this.signUpForm = this.initializeForm();
  }

  ngOnInit(): void {
    this.openPrivacyDialogOnLoad();
  }

  private openPrivacyDialogOnLoad(): void {
    this.dialog.open(PrivacyPolicyComponent, {
      // width: '600px',
      // data: { message: 'Hier ist Ihre Datenschutzerklärung.' }
    });
  }

  private initializeForm(): FormGroup {
    return new FormGroup({
      signUpUserName: new FormControl("", [Validators.required, signUpUserNameValidator]),
      signUpEmail: new FormControl("", [Validators.required, emailValidator]),
      signUpPassword: new FormControl("", [Validators.required, Validators.minLength(6)]),
      privacyCheckbox: new FormControl("", [Validators.required])
    });
  }

  mailFocus(): void {
    this.emailAdressAlreadyExists = false;
  }

  onSubmit(): void {
    if (this.signUpForm.valid) {
      this.populateUserData();
      this.createUserInBackend();
    } else {
      console.warn("Form is invalid.");
    }
  }

  // private createUserInBackend(): void {
  //   this.backendService.createItem(this.user, "users").subscribe(
  //     (response) => {
  //       console.log("User created successfully:", response);
  //       this.handleSuccessfulUserCreation(response);
  //     },
  //     (error) => {
  //       console.error("Error creating user:", error);
  //     }
  //   );
  // }

  private createUserInBackend(): void {
    this.signupService.createItem(this.user, "auth/registration").subscribe(
      (response) => {
        console.log("User created successfully:", response);
        this.handleSuccessfulUserCreation(response);
      },
      (error) => {
        console.error("Error creating user:", error);
      }
    );
  }

  private handleSuccessfulUserCreation(response: any): void {

    // this.backendUserDataService.lastUserAdded = response;
    // this.backendUserDataService.lastUserAddedId = response.id.toString();
    // this.backendUserDataService.userAddedSuccessfully = true;
    this.triggerAuthSuccessAnimation();
    this.redirectToHome();
  }

  private populateUserData(): void {
    const [firstName, lastName] = this.extractNameParts(this.user.user_name);
    this.user.first_name = firstName;
    this.user.last_name = lastName;
    this.user.initials = this.generateInitials(firstName, lastName);
    this.user.user_color = this.generateColorFromInitials(this.user.initials);
    this.user.phone_number = "";
    this.user.type = "user_from_signup";
    this.user.password = this.signUpForm.value.signUpPassword;
  }

  private extractNameParts(userName: string): [string, string] {
    const parts = userName.split(" ");
    return [parts[0] || "", parts[1] || ""];
  }

  private generateInitials(firstName: string, lastName: string): string {
    return (
      firstName.charAt(0).toUpperCase() + lastName.charAt(0).toUpperCase()
    );
  }

  private generateColorFromInitials(initials: string): string {
    const colorIndex = this.calculateColorIndex(initials);
    return this.userColors[colorIndex];
  }

  private calculateColorIndex(initials: string): number {
    const charCodesSum = initials
      .split("")
      .reduce((sum, char) => sum + char.charCodeAt(0), 0);
    return charCodesSum % this.userColors.length;
  }

  private redirectToHome(): void {
    setTimeout(() => {
      this.router.navigate(["/"]);
    }, 1600);
  }

  private triggerAuthSuccessAnimation(): void {
    const authSuccessElement = this.authSuccess.nativeElement;
    authSuccessElement.classList.add("is__active");
    setTimeout(() => {
      authSuccessElement.style.display = "none";
    }, 1450);
  }

  openPrivacyDialog(event: Event): void {
    event.preventDefault();
    this.dialog.open(PrivacyPolicyComponent, {
      // width: '600px',
      // data: { message: 'Hier ist Ihre Datenschutzerklärung.' }
    });
  }
}


// signUp() {
// const userData = this.getUserData();
// this.authService.signUp(userData).then((res: any) => {
//   this.populateUser(userData);
//   this.processSuccessfulSignup();
// }).catch((error: any) => {
//   this.handleSignupError(error);
// });
// }

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

// processSuccessfulSignup() {
//   this.isSubmitted = true;
//   this.createNewUserData();
//   this.authSuccessAnimation();
//   this.navigateHome();
// }

// handleSignupError(error: any) {
//   console.error(error);
//   this.emailAdressAlreadyExists = true;
// }

// extractUserData() {
//   const userName = this.signUpForm.value.signUpUserName;
//   const userFirstName = userName.split(" ")[0];
//   const userSurName = userName.split(" ")[1];
//   const userInitials = userFirstName.charAt(0).toUpperCase() + userSurName.charAt(0).toUpperCase();
//   const type = "userSignUp";

//   return { userName, userFirstName, userSurName, userInitials, type };
// }

// createUserDataObject() {
//   const { userName, userFirstName, userSurName, userInitials, type } = this.extractUserData();
//   return {
//     userName,
//     userFirstName,
//     userSurName,
//     userInitials,
//     email: this.signUpForm.value.signUpEmail,
//     password: this.signUpForm.value.signUpPassword,
//     type,
//   };
// }

// getUserData() {
//   return this.createUserDataObject();
// }

// prepareUserData() {
//   const userData = this.user.toJSON();
//   // delete userData.firebaseId;
//   return userData;
// }

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
