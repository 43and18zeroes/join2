import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { getAuth } from "firebase/auth";

@Injectable({
  providedIn: 'root'
})
export class UserService {

  allUsersData;
  allTasksData;
  currentUserAuth;
  currentUserData;

  constructor(private firestore: AngularFirestore) { }

  setAllDataToVarAndLocal() {
    this.setAllUsersDataToVarAndLocal();
    // this.setAllContactsDataToVarAndLocal();
    this.setAllTasksDataToVarAndLocal();
  }

  setAllUsersDataToVarAndLocal() {
    this.firestore
      .collection('users')
      .valueChanges()
      .subscribe((changes: any) => {
        this.allUsersData = changes;
        localStorage.removeItem('allUsersData');
        localStorage.setItem('allUsersData', JSON.stringify(changes));
      })
  }

  // setAllContactsDataToVarAndLocal() {
  //   this.firestore
  //     .collection('contacts')
  //     .valueChanges()
  //     .subscribe((changes: any) => {
  //       this.allContactsData = changes;
  //       localStorage.removeItem('allContactsData');
  //       localStorage.setItem('allContactsData', JSON.stringify(changes));
  //     })
  // }

  setAllTasksDataToVarAndLocal() {
    this.firestore
      .collection('tasks')
      .valueChanges()
      .subscribe((changes: any) => {
        this.allTasksData = changes;
        localStorage.removeItem('allTasksData');
        localStorage.setItem('allTasksData', JSON.stringify(changes));
      })
  }

  getCurrentUserAuth(): Promise<void> {
    const auth = getAuth();
    return new Promise((resolve, reject) => {
      auth.onAuthStateChanged((user) => {
        if (user != null) {
          this.currentUserAuth = user;
          resolve();
        }
        else {
          resolve();
        }
      });
    });
  }

  getUsersDataMain() {
    if (!this.allUsersData) {
      this.currentUserData = JSON.parse(localStorage.getItem('currentUserData') || '[]');
      this.allUsersData = JSON.parse(localStorage.getItem('allUsersData') || '[]');
    }
    this.sortUsersData();
  }

  private sortUsersData(): void {
    this.allUsersData.sort((a, b) => {
      if (a.userFirstName.toLowerCase() < b.userFirstName.toLowerCase()) {
        return -1;
      }
      if (a.userFirstName.toLowerCase() > b.userFirstName.toLowerCase()) {
        return 1;
      }
      return 0;
    });
  }

  // getContactsDataMain() {
  //   if (!this.allContactsData) {
  //     this.allContactsData = JSON.parse(localStorage.getItem('allContactsData') || '[]');
  //   }
  //   this.sortContactsData();
  // }

  // sortContactsData() {
  //   this.allContactsData.sort((a, b) => {
  //     if (a.contactFirstName.toLowerCase() < b.contactFirstName.toLowerCase()) {
  //       return -1;
  //     }
  //     if (a.contactFirstName.toLowerCase() > b.contactFirstName.toLowerCase()) {
  //       return 1;
  //     }
  //     return 0;
  //   });
  // }

  addToUsersData(newContact) {
    this.allUsersData.push(newContact);
    localStorage.removeItem('allUsersData');
    localStorage.setItem('allUsersData', JSON.stringify(this.allUsersData));
    // this.sortContactsData();
    // this.mergeUsersAndContactsData();
  }

  // addToContactsData(newContact) {
  //   this.allContactsData.push(newContact);
  //   localStorage.removeItem('allContactsData');
  //   localStorage.setItem('allContactsData', JSON.stringify(this.allContactsData));
  //   this.sortContactsData();
  //   this.mergeUsersAndContactsData();
  // }

  updateToUsersData(updatedUser) {
    this.updateAllUsersData(updatedUser);
    console.log("updateToUsersData", updatedUser);
    this.firestore
      .collection('users')
      .doc(updatedUser.firebaseId)
      .update(updatedUser);
      this.setAllUsersDataToVarAndLocal();
  }

  updateAllUsersData(updatedUser) {
    console.log("updateAllUsersData updatedUser", updatedUser)
    console.log("updateAllUsersData allUsersData", this.allUsersData)
    for (let index = 0; index < this.allUsersData.length; index++) {
      if (this.allUsersData[index].userEmailAddress === updatedUser.userEmailAddress) {
        this.allUsersData[index] = updatedUser;
      }
      
    }
  }

  // updateToContactsData(updatedContact) {
  //   for (let i = 0; i < this.allContactsData.length; i++) {
  //     if (this.allContactsData[i].contactEmailAddress === updatedContact.contactEmailAddress) {
  //       this.allContactsData[i].contactColor = updatedContact.contactColor;
  //       this.allContactsData[i].contactFirstName = updatedContact.contactFirstName;
  //       this.allContactsData[i].contactSurName = updatedContact.contactSurName;
  //       this.allContactsData[i].contactInitials = updatedContact.contactInitials;
  //       this.allContactsData[i].contactName = updatedContact.contactName;
  //       this.allContactsData[i].contactPhoneNumber = updatedContact.contactPhoneNumber;
  //     }
  //   }
  //   this.deleteUnnecessaryValues(updatedContact);
  //   this.updateContactBackend(updatedContact);
  //   localStorage.removeItem('allContactsData');
  //   localStorage.setItem('allContactsData', JSON.stringify(this.allContactsData));
  //   this.sortContactsData();
  //   this.mergeUsersAndContactsData();
  //   console.log("updated contact", updatedContact);
  // }

  // deleteUnnecessaryValues(updatedContact) {
  //   const keysToDelete = [
  //     'userColor',
  //     'userEmailAddress',
  //     'userFirstName',
  //     'userInitials',
  //     'userName',
  //     'userPhoneNumber',
  //     'userSurName',
  //     'updatedContact'
  //   ]
  //   keysToDelete.forEach(key => {
  //     delete updatedContact[key]
  //   })
  //   return updatedContact;
  // }

  // updateContactBackend(updatedContact) {
  //   this.firestore
  //     .collection('contacts')
  //     .doc(updatedContact.firebaseId)
  //     .update(updatedContact);
  // }

  // updateToUsersData(updatedContact) {
  //   console.log("updatedContact", updatedContact);
  // }

  getTasksDataMain() {
    if (!this.allTasksData) {
      this.allTasksData = JSON.parse(localStorage.getItem('allTasksData') || '[]');
    }
  }

  filterCurrentUserData() {
    this.currentUserData = [];
    for (const key in this.allUsersData) {
      if (this.allUsersData[key].userEmailAddress === this.currentUserAuth.email) {
        this.currentUserData.push(this.allUsersData[key]);
      }
    }
    this.currentUserData = this.currentUserData[0];
  }

  setCurrentUserDataToLocal() {
    localStorage.removeItem('currentUserData');
    localStorage.setItem('currentUserData', JSON.stringify(this.currentUserData));
  }

  // mergeUsersAndContactsData() {
  //   const keyMappings = this.defineMapping();
  //   const adjustedArray1 = this.adjustArray(keyMappings);
  //   this.usersAndContactsMerged = adjustedArray1.concat(this.allUsersData);
  //   this.sortUsersAndContactsMerged();
  // }

  // defineMapping() {
  //   return {
  //     contactInitials: 'userInitials',
  //     contactSurName: 'userSurName',
  //     contactName: 'userName',
  //     contactFirstName: 'userFirstName',
  //     contactColor: 'userColor',
  //     contactEmailAddress: 'userEmailAddress',
  //     contactPhoneNumber: 'userPhoneNumber'
  //   };
  // }

  // adjustArray(keyMappings) {
  //   return this.allContactsData.map(obj => {
  //     const adjustedObj = {};
  //     for (const key in obj) {
  //       if (keyMappings[key]) {
  //         adjustedObj[keyMappings[key]] = obj[key];
  //       } else {
  //         adjustedObj[key] = obj[key];
  //       }
  //     }
  //     return adjustedObj;
  //   });
  // }

  // sortUsersAndContactsMerged() {
  //   this.usersAndContactsMerged.sort((a, b) => {
  //     if (a.userFirstName.toLowerCase() < b.userFirstName.toLowerCase()) {
  //       return -1;
  //     }
  //     if (a.userFirstName.toLowerCase() > b.userFirstName.toLowerCase()) {
  //       return 1;
  //     }
  //     return 0;
  //   });
  // }

  

  // generateUsersAndContactsLists() {
  //   this.groupedContacts = {};
  //   this.usersAndContactsMerged.forEach(index => {
  //     const firstLetter = index.userFirstName.charAt(0).toUpperCase();
  //     if (!this.groupedContacts[firstLetter]) {
  //       this.groupedContacts[firstLetter] = [];
  //     }
  //     this.groupedContacts[firstLetter].push(index);
  //   });
  // }

  // deleteUserOrContact(emailToDelete) {
  //   console.log("allUsersData", this.allUsersData);
  //   console.log("allContactsData", this.allContactsData);

  //   let deleteUserIndex = -1;

  //   for (let i = 0; i < this.allUsersData.length; i++) {
  //     if (this.allUsersData[i].userEmailAddress === emailToDelete) {
  //       deleteUserIndex = i;
  //       break; // Beendet die Schleife, wenn das Element gefunden wurde
  //     }
  //   }

  //   if (deleteUserIndex !== -1) {
  //     this.allUsersData.splice(deleteUserIndex, 1);
  //     this.mergeUsersAndContactsData();
  //     this.generateUsersAndContactsLists();
  //   } else {
  //     console.warn('Kein Nutzer mit der angegebenen E-Mail gefunden!');
  //   }
  // }
}