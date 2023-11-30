import { USERCOLORS } from '../usercolors.constant';
import { Component, ElementRef, ViewChild } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { FormBuilder, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { User } from 'src/models/user.class';
import { signUpUserNameValidator } from '../shared/validators/custom-validators';
import { UserService } from '../services/user-data.service';

@Component({
  selector: 'app-main-dialog-edit-contact',
  templateUrl: './main-dialog-edit-contact.component.html',
  styleUrls: ['./main-dialog-edit-contact.component.scss']
})
export class MainDialogEditContactComponent {

  @ViewChild('newUserSubmitBtn') newUserSubmitBtn: ElementRef;

  user = new User();
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
    private firestore: AngularFirestore,
    private userService: UserService
  ) { }

  closeDialog() {
    this.dialog.closeAll();
  }

  onSubmit() {
    this.checkSingleInputs();
    if (this.editUserForm.valid) {
      this.editUserFormSubmitted = true;
      this.getUserData();
      this.userService.updateUser(this.user);
      this.addNewUserOutro();
    }
  }

  checkSingleInputs() {
    if (!this.user.userName) this.userNameValid = false;
    else this.userNameValid = true;
  }

  getUserData() {
    this.user.userFirstName = this.user.userName.split(' ')[0];
    this.user.userSurName = this.user.userName.split(' ')[1];
    this.user.userInitials = this.user.userFirstName.charAt(0).toUpperCase() + this.user.userSurName.charAt(0).toUpperCase();
    this.user.userColor = this.generateColorFromInitials(this.user.userInitials);
    if(this.user.userPhoneNumber) {
      this.user.userPhoneNumber = this.user.userPhoneNumber.replace(/\s/g, '');
    } else {
      this.user.userPhoneNumber = '';
    }
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
    this.userService.deleteContact(userToDelete);
    this.closeDialog();
  }

  addNewUserOutro() {
    this.newUserSubmitBtn.nativeElement.classList.add("btn__success");
    setTimeout(() => {
      this.dialog.closeAll();
    }, 1500);
  }
}
