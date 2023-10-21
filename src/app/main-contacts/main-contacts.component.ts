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
      console.log('The dialog was closed');
      // Hier können Sie auf das Ergebnis zugreifen oder was auch immer Sie nach dem Schließen des Dialogs tun möchten
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

  deleteUserOrContact(profile) {
    this.userService.deleteUserOrContact(profile.userEmailAddress);
  }
}
