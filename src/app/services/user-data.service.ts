import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { getAuth } from "firebase/auth";
import { TaskDataService } from '../services/task-data.service';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  allUsersData;
  currentUserAuth;
  currentUserData;
  lastUserAdded;
  userAddedSuccessfully = false;
  userUpdatedSuccessfully = false;
  userDeletedSuccessfully = false;

  constructor
    (
      private firestore: AngularFirestore,
      public taskDataService: TaskDataService
    ) { }

  setAllDataToVarAndLocal() {
    this.setAllUsersDataToVarAndLocal();
    // this.setAllContactsDataToVarAndLocal();
    this.taskDataService.setAllTasksDataToVarAndLocal();
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

  public sortUsersData(): void {
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

  // addToContactsData(newContact) {
  //   this.allContactsData.push(newContact);
  //   localStorage.removeItem('allContactsData');
  //   localStorage.setItem('allContactsData', JSON.stringify(this.allContactsData));
  //   this.sortContactsData();
  //   this.mergeUsersAndContactsData();
  // }

  addUser(addedUser) {
    this.addToUsersDataVar(addedUser);
    this.addUserDataBackend(addedUser);
    this.setAllUsersDataToVarAndLocal();
    this.userAddedSuccessfully = true;
  }

  addUserDataBackend(addedUser) {
    const userData = addedUser.toJSON();
    delete userData.firebaseId;
    this.firestore
      .collection('users')
      .add(userData)
      .then((docRef) => {
        console.log("Document written with ID: ", docRef.id);
        addedUser.firebaseId = docRef.id;
        this.lastUserAdded = addedUser;
        // this.idLastUserAdded = addedUser.firebaseId;
        return docRef.update({ firebaseId: docRef.id });
      })
      .then(() => {
        console.log('Document successfully updated with firebaseId!');
      })
      .catch((error) => {
        console.error("Error adding or updating document: ", error);
      });
  }

  addToUsersDataVar(addedUser) {
    this.allUsersData.push(addedUser);
  }

  updateUser(updatedUser) {
    this.updateAllUsersDataVar(updatedUser);
    this.updateUserDataBackend(updatedUser);
    this.setAllUsersDataToVarAndLocal();
    this.userUpdatedSuccessfully = true;
  }

  updateUserDataBackend(updatedUser) {
    this.firestore
      .collection('users')
      .doc(updatedUser.firebaseId)
      .update(updatedUser);
  }

  updateAllUsersDataVar(updatedUser) {
    for (let index = 0; index < this.allUsersData.length; index++) {
      if (this.allUsersData[index].userEmailAddress === updatedUser.userEmailAddress) {
        this.allUsersData[index] = updatedUser;
      }
    }
  }

  deleteContact(userToDelete) {
    this.deleteFromTasks(userToDelete);
    this.deleteFromVar(userToDelete);
    this.deleteFromBackend(userToDelete);
    this.setAllUsersDataToVarAndLocal();
    this.userDeletedSuccessfully = true;
  }

  deleteFromTasks(userToDelete) {
    console.log("userToDelete", userToDelete)
    console.log("this.taskDataService.allTasksData", this.taskDataService.allTasksData);
    let tasksToUpdate;
    for (let index = 0; index < this.taskDataService.allTasksData.length; index++) {
      const allTasks = this.taskDataService.allTasksData[index];
      console.log("allTasks", allTasks)
      for (let index = 0; index < allTasks.length; index++) {
        const singleTask = allTasks[index];
        console.log("singleTask", singleTask)
        if (singleTask.assignedTo.includes(userToDelete.userEmailAddress)) {
          tasksToUpdate.push(singleTask);
        }
      }
    }
    console.log("tasksToUpdate", tasksToUpdate)
  }

  deleteFromVar(userToDelete) {
    for (let index = 0; index < this.allUsersData.length; index++) {
      if (this.allUsersData[index].userEmailAddress === userToDelete.userEmailAddress) {
        this.allUsersData.splice(index, 1);
      }
    }
  }

  deleteFromBackend(userToDelete) {
    this.firestore
      .collection('users')
      .doc(userToDelete.firebaseId)
      .delete()
      .then(() => {
        console.log("Benutzer erfolgreich gelöscht!");
      })
      .catch((error) => {
        console.error("Fehler beim Löschen des Benutzers: ", error);
      });;
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