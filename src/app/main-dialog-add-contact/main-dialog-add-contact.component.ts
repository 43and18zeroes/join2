import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Contact } from 'src/models/contact.class';

@Component({
  selector: 'app-main-dialog-add-contact',
  templateUrl: './main-dialog-add-contact.component.html',
  styleUrls: ['./main-dialog-add-contact.component.scss']
})
export class MainDialogAddContactComponent {

  contact = new Contact();

  constructor(public dialog: MatDialog) {}

  ngOnInit(): void {

  }

  onSubmit() {
    
  }
}
