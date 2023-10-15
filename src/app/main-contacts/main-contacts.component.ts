import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MainDialogAddContactComponent } from '../main-dialog-add-contact/main-dialog-add-contact.component';

@Component({
  selector: 'app-main-contacts',
  templateUrl: './main-contacts.component.html',
  styleUrls: ['./main-contacts.component.scss']
})
export class MainContactsComponent {

  constructor(public dialog: MatDialog) { }

  ngOnInit(): void {
    this.openAddUserDialog();
  }

  openAddUserDialog() {
    this.dialog.open(MainDialogAddContactComponent, {
      panelClass: 'popup__contact__add'
    });
  }
}
