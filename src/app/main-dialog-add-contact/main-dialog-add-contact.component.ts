import { USERCOLORS } from '../usercolors.constant';
import { Component, ElementRef, ViewChild } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { FormBuilder, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatDialogRef } from '@angular/material/dialog';
import { User } from 'src/models/user_drf.class';
import { emailValidator, signUpUserNameValidator, phoneValidator } from '../shared/validators/custom-validators';
import { UserService } from '../services/user-data.service';
import { BackendService } from '../services/drf/backend-service.service';
import { BackendUserDataService } from '../services/drf/backend-user-data.service';

@Component({
  selector: 'app-main-dialog-add-contact',
  templateUrl: './main-dialog-add-contact.component.html',
  styleUrls: ['./main-dialog-add-contact.component.scss']
})
export class MainDialogAddContactComponent {

  @ViewChild('newUserSubmitBtn') newUserSubmitBtn: ElementRef;

  private colors: string[] = USERCOLORS;
  
  user = new User();
  userNameValid: boolean = true;
  userEmailAddressValid: boolean = true;
  userPhoneNumberValid: boolean = true;
  addUserFormSubmitted: boolean = false;

  addUserForm = this.fb.group({
    userName: ['', [Validators.required, signUpUserNameValidator]],
    userEmailAddress: ['', [Validators.required, emailValidator]],
    userPhoneNumber: ['', [Validators.required, phoneValidator]]
  });

  constructor(
    public dialog: MatDialog,
    public dialogRef: MatDialogRef<MainDialogAddContactComponent>,
    private fb: FormBuilder,
    private firestore: AngularFirestore,
    private userService: UserService,
    private backendService: BackendService,
    private backendUserDataService: BackendUserDataService
  ) { }

  ngOnInit(): void {
  }

  closeDialog() {
    this.dialogRef.close();
  }

  onSubmit() {
    this.checkSingleInputs();
    if (this.addUserForm.valid) {
      this.addUserFormSubmitted = true;
      this.getUserData();
      // this.userService.addUser(this.user);
      // this.addNewUserOutro();
      this.backendService.createItem(this.user, 'users').subscribe(
        (response) => {
          console.log('User created successfully:', response);
          this.backendUserDataService.lastUserAdded = response;
          this.backendUserDataService.lastUserAddedId = response.id.toString();
          this.backendUserDataService.userAddedSuccessfully = true;
          this.addNewUserOutro();
        },
        (error) => {
          console.error('Error creating user:', error);
        }
      );
    }
  }

  checkSingleInputs() {
    if (!this.user.user_name) this.userNameValid = false;
    else this.userNameValid = true;
    if (!this.user.email) this.userEmailAddressValid = false;
    else this.userEmailAddressValid = true;
    if (!this.user.phone_number) this.userPhoneNumberValid = false;
    else this.userPhoneNumberValid = true;
  }

  getUserData() {
    this.user.first_name = this.user.user_name.split(' ')[0];
    this.user.last_name = this.user.user_name.split(' ')[1];
    this.user.initials = this.user.first_name.charAt(0).toUpperCase() + this.user.last_name.charAt(0).toUpperCase();
    this.user.user_color = this.generateColorFromInitials(this.user.initials);
    this.user.phone_number = this.user.phone_number.replace(/\s/g, '');
    this.user.type = "user_from_contacts";
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

  addNewUserOutro() {
    this.newUserSubmitBtn.nativeElement.classList.add("btn__success");
    setTimeout(() => {
      this.closeDialog();
    }, 1500);
  }

}
