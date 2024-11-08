import { USERCOLORS } from '../usercolors.constant';
import { Component, ElementRef, ViewChild } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { FormBuilder, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatDialogRef } from '@angular/material/dialog';
import { User } from 'src/models/user.class';
import { emailValidator, signUpUserNameValidator, phoneValidator } from '../shared/validators/custom-validators';
import { UserService } from '../services/user-data.service';

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
    private userService: UserService
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
      this.addNewUserOutro();
    }
  }

  checkSingleInputs() {
    if (!this.user.userName) this.userNameValid = false;
    else this.userNameValid = true;
    if (!this.user.userEmailAddress) this.userEmailAddressValid = false;
    else this.userEmailAddressValid = true;
    if (!this.user.userPhoneNumber) this.userPhoneNumberValid = false;
    else this.userPhoneNumberValid = true;
  }

  getUserData() {
    this.user.userFirstName = this.user.userName.split(' ')[0];
    this.user.userSurName = this.user.userName.split(' ')[1];
    this.user.userInitials = this.user.userFirstName.charAt(0).toUpperCase() + this.user.userSurName.charAt(0).toUpperCase();
    this.user.userColor = this.generateColorFromInitials(this.user.userInitials);
    this.user.userPhoneNumber = this.user.userPhoneNumber.replace(/\s/g, '');
    this.user.type = "userFromContacts";
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
