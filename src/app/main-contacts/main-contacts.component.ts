import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MainDialogAddContactComponent } from '../main-dialog-add-contact/main-dialog-add-contact.component';
import { UserService } from '../services/user-data.service';
import { MainDialogEditContactComponent } from '../main-dialog-edit-contact/main-dialog-edit-contact.component';

@Component({
  selector: 'app-main-contacts',
  templateUrl: './main-contacts.component.html',
  styleUrls: ['./main-contacts.component.scss']
})
export class MainContactsComponent {

  alphabet;
  groupedContacts;

  selectedContactId: string | null = null;
  showContactDetails: boolean = false;
  clickedContactData;

  constructor(public dialog: MatDialog,
    private userService: UserService) { }

  ngOnInit(): void {
    this.alphabet = this.userService.alphabet;
    this.groupedContacts = this.userService.groupedContacts;

    this.displayContactDetails(this.groupedContacts['A'][0], "A", 0)
  }

  openAddUserDialog(): void {
    const dialogRef = this.dialog.open(MainDialogAddContactComponent, {
      panelClass: 'popup__contact__add'
    });

    dialogRef.afterClosed().subscribe((result) => {
      this.groupedContacts = this.userService.groupedContacts;
    });
  }

  hasContactsForLetter(letter: string): boolean {
    return !!this.groupedContacts[letter];
  }

  displayContactDetails(contactData, letter: string, index: number) {
    this.showContactDetails = true;
    this.clickedContactData = contactData;
    this.selectedContactId = `${letter}-${index}`;
  }

  isActive(letter: string, index: number): boolean {
    return this.selectedContactId === `${letter}-${index}`;
  }

  editContact(clickedContactData) {
    console.log("editContact clickedContactData", clickedContactData)
    const clickedContactDataID = clickedContactData.firebaseId;
    const dialogRef = this.dialog.open(MainDialogEditContactComponent, {
      panelClass: 'popup__contact__add'
    });
    clickedContactData.contactName = clickedContactData.userName;
    clickedContactData.contactEmailAddress = clickedContactData.userEmailAddress;
    clickedContactData.contactPhoneNumber = clickedContactData.userPhoneNumber;
    dialogRef.componentInstance.user = clickedContactData;
    dialogRef.afterClosed().subscribe((result) => {
      this.groupedContacts = this.userService.groupedContacts;
      this.findEditedContactData(clickedContactDataID);
    });
  }

  findEditedContactData(clickedContactDataID) {
    for (const key in this.groupedContacts) {
      if (this.groupedContacts.hasOwnProperty(key)) {
        const elementArray = this.groupedContacts[key];
        for (const element of elementArray) { 
          if (element.firebaseId === clickedContactDataID) {
            console.log("findEditedContactData", element);
            this.clickedContactData = element;
          }
        }
      }
    }
  }
}
