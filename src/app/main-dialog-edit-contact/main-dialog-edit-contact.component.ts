import { Component, ElementRef, ViewChild } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Contact } from 'src/models/contact.class';
import { emailValidator, signUpUserNameValidator, phoneValidator } from '../shared/validators/custom-validators';
import { UserService } from '../services/user-data.service';

@Component({
  selector: 'app-main-dialog-edit-contact',
  templateUrl: './main-dialog-edit-contact.component.html',
  styleUrls: ['./main-dialog-edit-contact.component.scss']
})
export class MainDialogEditContactComponent {

  contact = new Contact();
  editContactForm = this.fb.group({
    contactName: ['', [Validators.required, signUpUserNameValidator]],
    contactEmailAddress: ['', [Validators.required, emailValidator]],
    contactPhoneNumber: ['', [Validators.required, phoneValidator]]
  });

  contactNameValid: boolean = true;
  contactEmailAddressValid: boolean = true;
  contactPhoneNumberValid: boolean = true;
  addUserFormSubmitted: boolean = false;
  @ViewChild('newUserSubmitBtn') newUserSubmitBtn: ElementRef;

  constructor(
    public dialog: MatDialog,
    private fb: FormBuilder,
    private firestore: AngularFirestore,
    private userService: UserService
  ) { }

  ngOnInit(): void {
    console.log("contact", this.contact)
  }

  closeDialog() {
    this.dialog.closeAll();
  }

  onSubmit() {

  }
}
