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

  alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');;
  groupedContacts;
  currentUserData;
  allUsersData;

  selectedContactId: string | null = null;
  showContactDetails: boolean = false;
  clickedContactData;

  constructor(public dialog: MatDialog,
    private userService: UserService) { }

  ngOnInit(): void {
    this.currentUserData = this.userService.currentUserData;
    this.generateUsersLists();
  }

  generateUsersLists() {
    this.userService.sortUsersData();
    this.allUsersData = this.userService.allUsersData;
    this.groupedContacts = {};
    this.allUsersData.forEach(index => {
      if (index.userEmailAddress !== this.currentUserData.userEmailAddress) {
        const firstLetter = index.userFirstName.charAt(0).toUpperCase();
        if (!this.groupedContacts[firstLetter]) {
          this.groupedContacts[firstLetter] = [];
        }
        this.groupedContacts[firstLetter].push(index);
      }
    });
  }

  openAddUserDialog(): void {
    const dialogRef = this.dialog.open(MainDialogAddContactComponent, {
      panelClass: 'popup__contact__add'
    });

    dialogRef.afterClosed().subscribe((result) => {
      console.log("this.idLastUserAdded", this.userService.idLastUserAdded);
      this.generateUsersLists();
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
    dialogRef.componentInstance.user = {...clickedContactData};
    dialogRef.afterClosed().subscribe((result) => {
      this.generateUsersLists();
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
            this.selectedContactId = `${key}-${elementArray.indexOf(element)}`;
            return;
          }
        }
      }
    }
  }
}
