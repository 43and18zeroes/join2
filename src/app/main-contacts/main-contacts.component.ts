import { Component, ElementRef, ViewChild } from '@angular/core';
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

  @ViewChild('successAnimationOverlay', { static: false }) successAnimationOverlayRef: ElementRef;
  @ViewChild('successAnimationText', { static: false }) successAnimationText: ElementRef;

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
      this.generateUsersLists();
      this.highlightNewContact(this.userService.lastUserAdded.firebaseId);
      this.showContactDetails = true;
      this.clickedContactData = this.userService.lastUserAdded;
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
      this.generateUsersLists();
      this.findEditedContactData(clickedContactDataID);
    });
  }

  deleteContact(clickedContactData) {
    this.userService.deleteContact(clickedContactData);
    this.generateUsersLists();
    this.showContactDetails = false;
    this.selectedContactId = null;
    this.displayDeletionSuccessfulAnimation();
  }

  displayDeletionSuccessfulAnimation() {
    this.successAnimationOverlayRef.nativeElement.classList.add('active');
    this.successAnimationText.nativeElement.classList.add('show');
    setTimeout(() => {
      this.successAnimationOverlayRef.nativeElement.classList.remove('active');
      this.successAnimationText.nativeElement.classList.remove('show');
    }, 1500);
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
