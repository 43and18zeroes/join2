import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MainDialogAddContactComponent } from '../main-dialog-add-contact/main-dialog-add-contact.component';
import { UserService } from '../services/user-data.service';

@Component({
  selector: 'app-main-contacts',
  templateUrl: './main-contacts.component.html',
  styleUrls: ['./main-contacts.component.scss']
})
export class MainContactsComponent {

  alphabet;
  groupedContacts;

  constructor(public dialog: MatDialog,
    private userService: UserService) { }

  ngOnInit(): void {
    this.alphabet = this.userService.alphabet;
    this.groupedContacts = this.userService.groupedContacts;
  }

  openAddUserDialog() {
    this.dialog.open(MainDialogAddContactComponent, {
      panelClass: 'popup__contact__add'
    });
  }
}
