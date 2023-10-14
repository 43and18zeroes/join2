import { Component } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Contact } from 'src/models/contact.class';

@Component({
  selector: 'app-main-dialog-add-contact',
  templateUrl: './main-dialog-add-contact.component.html',
  styleUrls: ['./main-dialog-add-contact.component.scss']
})
export class MainDialogAddContactComponent {

  contact = new Contact();

  addUserForm: FormGroup;

  constructor(public dialog: MatDialog,
    private fb: FormBuilder,) {
      this.addUserForm = this.fb.group({
        contactName: [''],
        contactEmailAddress: [''],
        contactPhoneNumber: ['']
      });
    }

  ngOnInit(): void {

  }

  onSubmit() {
    this.getContactData();
    console.log("contact", this.contact);
  }

  getContactData() {
    this.contact.contactFirstName = this.contact.contactName.split(' ')[0];
    this.contact.contactSurName = this.contact.contactName.split(' ')[1];
    this.contact.contactInitials = this.contact.contactFirstName.charAt(0).toUpperCase() + this.contact.contactSurName.charAt(0).toUpperCase();
  }
}
