import { Component, HostListener, ElementRef, Renderer2 } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MainDialogAddContactComponent } from '../main-dialog-add-contact/main-dialog-add-contact.component';
import { UserService } from '../services/user-data.service';
import { MainDialogEditContactComponent } from '../main-dialog-edit-contact/main-dialog-edit-contact.component';
import { BackendService } from '../services/drf/backend-service.service';
import { BackendUserDataService } from '../services/drf/backend-user-data.service';

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
    private backendService: BackendService,
    private backendUserDataService: BackendUserDataService,
    private el: ElementRef,
    private renderer: Renderer2
    ) { }

  ngOnInit(): void {
    this.currentUserData = this.userService.currentUserData;
    this.fetchUsers();
  }

  fetchUsers() {
    this.backendService.getUsers().subscribe(data => {
      this.allUsersData = data;
      this.generateUsersLists();
    });
  }

  generateUsersLists() {
    // this.userService.sortUsersData();
    // this.allUsersData = this.userService.allUsersData;
    this.groupedContacts = {};
    this.allUsersData.forEach(index => {
      console.log('this.currentUserData', this.currentUserData);
      // if (index.email !== this.currentUserData.userEmailAddress) {
        const firstLetter = index.first_name.charAt(0).toUpperCase();
        if (!this.groupedContacts[firstLetter]) {
          this.groupedContacts[firstLetter] = [];
        }
        this.groupedContacts[firstLetter].push(index);
      // }
    });
    this.sortGroupedContacts(this.groupedContacts);
  }

  sortGroupedContacts(groupedContacts: { [key: string]: any[] }): void {
    for (const key in groupedContacts) {
      if (groupedContacts.hasOwnProperty(key)) {
        groupedContacts[key].sort((a, b) => {
          const nameA = a.first_name.toLowerCase();
          const nameB = b.first_name.toLowerCase();
          if (nameA < nameB) {
            return -1;
          }
          if (nameA > nameB) {
            return 1;
          }
          return 0;
        });
      }
    }
  }

  openAddUserDialog(): void {
    const dialogRef = this.dialog.open(MainDialogAddContactComponent, {
      panelClass: 'popup__contact__add'
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (this.backendUserDataService.userAddedSuccessfully) {
        this.fetchUsers();
        // this.highlightNewContact(this.userService.lastUserAdded.firebaseId);
        this.highlightNewContact(this.backendUserDataService.lastUserAddedId);
        this.showContactDetails = true;
        this.clickedContactData = this.backendUserDataService.lastUserAdded;
        this.backendUserDataService.userAddedSuccessfully = false;
        // this.userService.userAddedSuccessfully = false;
        this.removeHighlight();
      }
    });
  }

  highlightNewContact(newContactId: string) {
    for (const key in this.groupedContacts) {
      if (this.groupedContacts.hasOwnProperty(key)) {
        const entries = this.groupedContacts[key];
        let foundEntry = entries.find(entry => entry.id === newContactId);
        if (foundEntry) {
          this.selectedContactId = `${key}-${entries.indexOf(foundEntry)}`;
          this.clickedContactData = foundEntry; // Optional, wenn Sie die Kontaktdetails auch anzeigen möchten
          return;
        }
      }
    }
    // for (const key in this.groupedContacts) {
    //   if (this.groupedContacts.hasOwnProperty(key)) {
    //     const elementArray = this.groupedContacts[key];
    //     const foundElement = elementArray.find(element => element.firebaseId === newContactId);
    //     if (foundElement) {
    //       this.selectedContactId = `${key}-${elementArray.indexOf(foundElement)}`;
    //       this.clickedContactData = foundElement; // Optional, wenn Sie die Kontaktdetails auch anzeigen möchten
    //       return;
    //     }
    //   }
    // }
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
    const clickedContactDataID = clickedContactData.id;
    const dialogRef = this.dialog.open(MainDialogEditContactComponent, {
      panelClass: 'popup__contact__add'
    });
    dialogRef.componentInstance.user = { ...clickedContactData };
    dialogRef.afterClosed().subscribe((result) => {
      this.afterClosedEditContact(clickedContactDataID);
    });
  }

  afterClosedEditContact(clickedContactDataID) {
    this.showContactDetails = false;
    this.fetchUsers();
    if (this.userService.userDeletedSuccessfully) {
      // this.showContactDetails = false;
      this.displayDeletionSuccessfulAnimation();
    }
    // if (this.userService.userUpdatedSuccessfully || this.userService.userDeletedSuccessfully) {
    //   // this.generateUsersLists();
    //   this.findEditedContactData(clickedContactDataID);
    // }
    this.userService.userUpdatedSuccessfully = false;
    this.userService.userDeletedSuccessfully = false;
    this.removeHighlight();
  }

  deleteContact(clickedContactData) {
    // this.userService.deleteContact(clickedContactData);
    this.backendService.deleteItem(clickedContactData.id, 'users').subscribe(
      (response) => {
        console.log('User deleted successfully:', response);
        this.fetchUsers();
      },
      (error) => {
        console.error('Error deleting user:', error);
      }
    )
    // this.generateUsersLists();
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

  // findEditedContactData(clickedContactDataID) {
  //   for (const key in this.groupedContacts) {
  //     if (this.groupedContacts.hasOwnProperty(key)) {
  //       const elementArray = this.groupedContacts[key];
  //       for (const element of elementArray) {
  //         if (element.firebaseId === clickedContactDataID) {
  //           this.clickedContactData = element;
  //           this.selectedContactId = `${key}-${elementArray.indexOf(element)}`;
  //           return;
  //         }
  //       }
  //     }
  //   }
  // }

  removeHighlight() {
    this.showContactDetails = false;
    this.selectedContactId = null;
  
    // Entferne die Klasse active__class aus allen Elementen
    const activeElements = this.el.nativeElement.querySelectorAll('.active__class');
    activeElements.forEach(element => {
      this.renderer.removeClass(element, 'active__class');
    });
  }
}
