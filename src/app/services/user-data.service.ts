import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { getAuth } from "firebase/auth";

@Injectable({
  providedIn: 'root'
})
export class UserService {

  allUsersData;
  allContactsData;
  allTasksData;
  currentUserAuth;
  currentUserData;
  usersAndContactsMerged;

  constructor(private firestore: AngularFirestore) { }

  setAllDataToVarAndLocal() {
    this.setAllUsersDataToVarAndLocal();
    this.setAllContactsDataToVarAndLocal();
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

  setAllContactsDataToVarAndLocal() {
    this.firestore
      .collection('contacts')
      .valueChanges()
      .subscribe((changes: any) => {
        this.allContactsData = changes;
        localStorage.removeItem('allContactsData');
        localStorage.setItem('allContactsData', JSON.stringify(changes));
      })
  }

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
        } else {
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

  getContactsDataMain() {
    if (!(this.allContactsData !== undefined)) {
      this.allContactsData = JSON.parse(localStorage.getItem('allContactsData') || '[]');
    }
    this.sortContactsData();
  }

  sortContactsData() {
    this.allContactsData.sort((a, b) => {
      if (a.contactFirstName.toLowerCase() < b.contactFirstName.toLowerCase()) {
        return -1;
      }
      if (a.contactFirstName.toLowerCase() > b.contactFirstName.toLowerCase()) {
        return 1;
      }
      return 0;
    });
  }

  addToContactsData(newContact) {
    this.allContactsData.push(newContact);
    localStorage.removeItem('allContactsData');
    localStorage.setItem('allContactsData', JSON.stringify(this.allContactsData));
    this.sortContactsData();
    this.mergeUsersAndContactsData();
  }

  getTasksDataMain() {
    if (!(this.allTasksData !== undefined)) {
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

  mergeUsersAndContactsData() {
    const keyMappings = this.defineMapping();
    const adjustedArray1 = this.adjustArray(keyMappings);
    this.usersAndContactsMerged = adjustedArray1.concat(this.allUsersData);
    this.sortUsersAndContactsMerged();
  }

  defineMapping() {
    return {
      contactInitials: 'userInitials',
      contactSurName: 'userSurName',
      contactName: 'userName',
      contactFirstName: 'userFirstName',
      contactColor: 'userColor',
      contactEmailAddress: 'userEmailAddress',
      contactPhoneNumber: 'userPhoneNumber'
    };
  }

  adjustArray(keyMappings) {
    return this.allContactsData.map(obj => {
      const adjustedObj = {};
      for (const key in obj) {
        if (keyMappings[key]) {
          adjustedObj[keyMappings[key]] = obj[key];
        } else {
          adjustedObj[key] = obj[key];
        }
      }
      return adjustedObj;
    });
  }

  sortUsersAndContactsMerged() {
    this.usersAndContactsMerged.sort((a, b) => {
      if (a.userFirstName.toLowerCase() < b.userFirstName.toLowerCase()) {
        return -1;
      }
      if (a.userFirstName.toLowerCase() > b.userFirstName.toLowerCase()) {
        return 1;
      }
      return 0;
    });
  }
}