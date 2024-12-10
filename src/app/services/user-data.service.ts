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
    
    // this.taskDataService.setAllTasksDataToVarAndLocal();
  }

  setAllUsersDataToVarAndLocal() {
    this.firestore
      .collection('users')
      .valueChanges()
      .subscribe((changes: any) => {
        this.allUsersData = changes;
        // localStorage.removeItem('allUsersData');
        // localStorage.setItem('allUsersData', JSON.stringify(changes));
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
    // if (!this.allUsersData) {
      // this.currentUserData = JSON.parse(localStorage.getItem('currentUserData') || '[]');
      // this.allUsersData = JSON.parse(localStorage.getItem('allUsersData') || '[]');
    // }
    // this.sortUsersData();
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

  addUser(addedUser) {
    this.addToUsersDataVar(addedUser);
    this.addUserDataBackend(addedUser);
    this.setAllUsersDataToVarAndLocal();
    this.userAddedSuccessfully = true;
  }

  addUserDataBackend(addedUser) {
    const userData = addedUser.toJSON();
    delete userData.firebaseId;
    this.firestore.collection('users').add(userData).then((docRef) => {
        addedUser.firebaseId = docRef.id;
        this.lastUserAdded = addedUser;
        return docRef.update({ firebaseId: docRef.id });
      })
      .then(() => {})
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
    this.identifyTaskWithContact(userToDelete);
    this.deleteFromVar(userToDelete);
    this.deleteFromBackend(userToDelete);
    this.setAllUsersDataToVarAndLocal();
    this.userDeletedSuccessfully = true;
  }

  identifyTaskWithContact(userToDelete) {
    let tasksToUpdate = [];
    for (let index = 0; index < this.taskDataService.allTasksData.length; index++) {
      const singleTask = this.taskDataService.allTasksData[index];
      if (singleTask.assignedTo.includes(userToDelete.userEmailAddress)) {
        const updatedAssignedTo = singleTask.assignedTo.filter(email => email !== userToDelete.userEmailAddress);
        singleTask.assignedTo = updatedAssignedTo;
        tasksToUpdate.push(singleTask);
      }
    }
    this.updateBackendWithTasks(tasksToUpdate);
  }

  updateBackendWithTasks(tasksToUpdate) {
    tasksToUpdate.forEach(element => {
      this.firestore
        .collection('tasks')
        .doc(element.firebaseId)
        .update(element)
        .then(() => {
        })
        .catch((error) => {
          console.error('Fehler beim Aktualisieren der Aufgabe: ', error);
        });
    });
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
      })
      .catch((error) => {
        console.error("Fehler beim Löschen des Benutzers: ", error);
      });;
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

  // setCurrentUserDataToLocal() {
  //   localStorage.removeItem('currentUserData');
  //   localStorage.setItem('currentUserData', JSON.stringify(this.currentUserData));
  // }

  
  
  
  
  
  

  
  
  
  
  
  
  
  
  
  
  

  
  
  
  
  
  
  
  
  
  
  
  
  

  
  
  
  
  
  
  
  
  
  
  



  
  
  
  
  
  
  
  
  
  

  


  

  
  
  
  
  
  

  
  
  
  
  
  
  
  
}