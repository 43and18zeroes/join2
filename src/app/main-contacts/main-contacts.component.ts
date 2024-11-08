import { Component, HostListener } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MainDialogAddContactComponent } from '../main-dialog-add-contact/main-dialog-add-contact.component';
import { UserService } from '../services/user-data.service';
import { MainDialogEditContactComponent } from '../main-dialog-edit-contact/main-dialog-edit-contact.component';
import { BackendService } from '../services/backend-service.service';

@Component({
  selector: 'app-main-contacts',
  templateUrl: './main-contacts.component.html',
  styleUrls: ['./main-contacts.component.scss']
})
export class MainContactsComponent {

  @HostListener('window:resize', ['$event'])
  onResize(event) {
    this.isLargeScreen = window.innerWidth > 1100;
  }

  alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');;
  groupedContacts;
  currentUserData;
  allUsersData;
  selectedContactId: string | null = null;
  showContactDetails: boolean = false;
  clickedContactData;
  displayDeletionAnimation: boolean = false;
  isLargeScreen: boolean = window.innerWidth > 1100;  

  constructor(
    public dialog: MatDialog,
    private userService: UserService,
    private backendService: BackendService
    ) { }

  ngOnInit(): void {
    // this.currentUserData = this.userService.currentUserData;
    this.backendService.getUsers().subscribe(data => {
      this.allUsersData = data;
      console.log('this.allUsersData', this.allUsersData);
      this.generateUsersLists();
    });
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
      if (this.userService.userAddedSuccessfully) {
        this.generateUsersLists();
        this.highlightNewContact(this.userService.lastUserAdded.firebaseId);
        this.showContactDetails = true;
        this.clickedContactData = this.userService.lastUserAdded;
        this.userService.userAddedSuccessfully = false;
      }
    });
  }

  highlightNewContact(newContactId: string) {
    for (const key in this.groupedContacts) {
      if (this.groupedContacts.hasOwnProperty(key)) {
        const elementArray = this.groupedContacts[key];
        const foundElement = elementArray.find(element => element.firebaseId === newContactId);
        if (foundElement) {
          this.selectedContactId = `${key}-${elementArray.indexOf(foundElement)}`;
          this.clickedContactData = foundElement; // Optional, wenn Sie die Kontaktdetails auch anzeigen möchten
          return;
        }
      }
    }
  }

  hasContactsForLetter(letter: string): boolean {
    return !!this.groupedContacts[letter];
  }

  displayContactDetails(contactData, letter: string, index: number) {
    this.showContactDetails = true;
    this.clickedContactData = contactData;
    this.selectedContactId = `${letter}-${index}`;
  }

  deactiveContactDetails() {
    this.showContactDetails = false;
  }

  isActive(letter: string, index: number): boolean {
    return this.selectedContactId === `${letter}-${index}`;
  }

  editContact(clickedContactData) {
    const clickedContactDataID = clickedContactData.firebaseId;
    const dialogRef = this.dialog.open(MainDialogEditContactComponent, {
      panelClass: 'popup__contact__add'
    });
    dialogRef.componentInstance.user = { ...clickedContactData };
    dialogRef.afterClosed().subscribe((result) => {
      this.afterClosedEditContact(clickedContactDataID);
    });
  }

  afterClosedEditContact(clickedContactDataID) {
    if (this.userService.userDeletedSuccessfully) {
      this.showContactDetails = false;
      this.displayDeletionSuccessfulAnimation();
    }
    if (this.userService.userUpdatedSuccessfully || this.userService.userDeletedSuccessfully) {
      this.generateUsersLists();
      this.findEditedContactData(clickedContactDataID);
    }
    this.userService.userUpdatedSuccessfully = false;
    this.userService.userDeletedSuccessfully = false;
  }

  deleteContact(clickedContactData) {
    this.userService.deleteContact(clickedContactData);
    this.generateUsersLists();
    this.showContactDetails = false;
    this.selectedContactId = null;
    this.displayDeletionSuccessfulAnimation();
    this.userService.userDeletedSuccessfully = false;
  }

  displayDeletionSuccessfulAnimation() {
    this.displayDeletionAnimation = true;
    setTimeout(() => {
      this.displayDeletionAnimation = false;
    }, 1500);
  }

  findEditedContactData(clickedContactDataID) {
    for (const key in this.groupedContacts) {
      if (this.groupedContacts.hasOwnProperty(key)) {
        const elementArray = this.groupedContacts[key];
        for (const element of elementArray) {
          if (element.firebaseId === clickedContactDataID) {
            this.clickedContactData = element;
            this.selectedContactId = `${key}-${elementArray.indexOf(element)}`;
            return;
          }
        }
      }
    }
  }
}
