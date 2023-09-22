import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { getAuth } from "firebase/auth";

@Injectable({
  providedIn: 'root'
})
export class UserService {

  allUsersData;
  currentUserAuth;
  currentUserData = [];

  constructor(private firestore: AngularFirestore) { }

  setAllUsersDataToVar() {
    this.firestore
      .collection('users')
      .valueChanges()
      .subscribe((changes: any) => {
        this.allUsersData = changes;
        console.log("user-data this.allUsersData", this.allUsersData);
        // localStorage.removeItem('users');
        // localStorage.setItem('users', JSON.stringify(changes));
      })
  }

  // Eine Methode, um auf die Daten von außen zuzugreifen
  // getAllUsersData() {
  //   return this.allUsersData;
  // }

  getCurrentUserAuth(): Promise<void> {
    const auth = getAuth();
    return new Promise((resolve, reject) => {
      auth.onAuthStateChanged((user) => {
        if (user != null) {
          this.currentUserAuth = user;
          console.log("user-data this.currentUserAuth", this.currentUserAuth);
          resolve();
        } else {
          resolve();
        }
      });
    });
  }

  filterCurrentUserData() {

    for (const key in this.allUsersData) {

      console.log("filter this.allUsersData", this.allUsersData);
      console.log("filter this.allUsersData[key]", this.allUsersData[key]);
      console.log("filter this.allUsersData[key].userEmailAddress", this.allUsersData[key].userEmailAddress);
      console.log("filter this.currentUserAuth.email", this.currentUserAuth.email);

      if (this.allUsersData[key].userEmailAddress === this.currentUserAuth.email) {
        this.currentUserData.push(this.allUsersData[key]);
        console.log("filter this.currentUserData", this.currentUserData);
      }

    }
    
    // localStorage.removeItem('currentUserData');
    // localStorage.setItem('currentUserData', JSON.stringify(currentUserData[0]));
  }
}