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
        contactName: ['']
      });
    }

  ngOnInit(): void {

  }

  onSubmit() {
    console.log("contact", this.contact);
  }
}
