import { USERCOLORS } from '../../usercolors.constant';
import { Component, ElementRef, ViewChild } from '@angular/core';
// import { AngularFirestore } from '@angular/fire/compat/firestore';
import { FormBuilder, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { User } from 'src/models/user_drf.class';
import { signUpUserNameValidator } from '../../shared/validators/custom-validators';
import { UserService } from '../../services/user-data.service';
import { BackendService } from '../../services/drf/backend-service.service';
import { BackendUserDataService } from 'src/app/services/drf/backend-user-data.service';

@Component({
  selector: 'app-main-dialog-edit-contact',
  templateUrl: './main-dialog-edit-contact.component.html',
  styleUrls: ['./main-dialog-edit-contact.component.scss']
})
export class MainDialogEditContactComponent {

  @ViewChild('saveChangesSubmitBtn') saveChangesSubmitBtn: ElementRef;

  user = new User();
  userFullNameDisplay: string;
  userEmailDisplay: string;
  userNameValid: boolean = true;
  userEmailAddressValid: boolean = true;
  userPhoneNumberValid: boolean = true;
  editUserFormSubmitted: boolean = false;

  editUserForm = this.fb.group({
    userName: ['', [Validators.required, signUpUserNameValidator]],
    userEmailAddress: [{value: '', disabled: true}],
    userPhoneNumber: ['']
  });

  private userColors: string[] = USERCOLORS;

  constructor(
    public dialog: MatDialog,
    private fb: FormBuilder,
    // private firestore: AngularFirestore,
    private userService: UserService,
    private backendService: BackendService,
    private backendUserDataService: BackendUserDataService,
  ) { }

  ngOnInit() {
    console.log('this.user', this.user);
    this.userFullNameDisplay = `${this.user.first_name} ${this.user.last_name}`
    this.userEmailDisplay = this.user.email;
  }

  closeDialog() {
    this.dialog.closeAll();
  }

  onSubmit() {
    this.checkSingleInputs();
    if (this.editUserForm.valid) {
      this.editUserFormSubmitted = true;
      this.getUserData();
      // this.userService.updateUser(this.user);

      this.backendUserDataService.updateUserData(this.user).subscribe(
        (response) => {
          console.log('User updated successfully:', response);
          // this.backendUserDataService.lastUserAdded = response;
          // this.backendUserDataService.lastUserAddedId = response.id.toString();
          // this.backendUserDataService.userAddedSuccessfully = true;
          this.saveChangesOutro();
        },
        (error) => {
          console.error('Error creating user:', error);
        }
      )
    }
  }

  checkSingleInputs() {
    if (!this.user.user_name) this.userNameValid = false;
    else this.userNameValid = true;
  }

  getUserData() {
    console.log('editUserForm', this.editUserForm);
    // this.user.first_name = this.user.first_name;
    // this.user.last_name = this.user.last_name;
    this.user.first_name = this.editUserForm.value.userName.split(' ')[0];
    this.user.last_name = this.editUserForm.value.userName.split(' ')[1];
    this.user.initials = this.user.first_name.charAt(0).toUpperCase() + this.user.last_name.charAt(0).toUpperCase();
    this.user.user_color = this.generateColorFromInitials(this.user.initials);
    if (this.user.phone_number) this.user.phone_number = this.user.phone_number.replace(/\s/g, '');
    else this.user.phone_number = '';
  }

  private generateColorFromInitials(initials: string): string {
    const colorIndex = this.calculateColorIndex(initials);
    return this.userColors[colorIndex];
  }

  private calculateColorIndex(initials: string): number {
    const charCodes = initials.split('').map(char => char.charCodeAt(0));
    const sum = charCodes.reduce((acc, curr) => acc + curr, 0);
    return sum % this.userColors.length;
  }

  deleteContact(userToDelete) {
    this.backendUserDataService.deleteUser(userToDelete.id).subscribe(
      (response) => {
        console.log('User deleted successfully:', response);
      },
      (error) => {
        console.error('Error deleting user:', error);
      }
    )
    this.closeDialog();
  }

  saveChangesOutro() {
    this.saveChangesSubmitBtn.nativeElement.classList.add("btn__success");
    setTimeout(() => {
      this.dialog.closeAll();
    }, 1500);
  }
}
