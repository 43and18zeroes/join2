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

  setAllUsersDataToVarAndLocal() {
    this.firestore
      .collection('users')
      .valueChanges()
      .subscribe((changes: any) => {
        this.allUsersData = changes;
        // console.log("var this.allUsersData", this.allUsersData);
        localStorage.removeItem('allUsersData');
        localStorage.setItem('allUsersData', JSON.stringify(changes));
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
          // console.log("this.currentUserAuth", this.currentUserAuth);
          resolve();
        } else {
          resolve();
        }
      });
    });
  }

  filterCurrentUserData() {
    this.currentUserData = [];
    for (const key in this.allUsersData) {
      if (this.allUsersData[key].userEmailAddress === this.currentUserAuth.email) {
        this.currentUserData.push(this.allUsersData[key]);
      }
    }

    // localStorage.removeItem('currentUserData');
    // localStorage.setItem('currentUserData', JSON.stringify(currentUserData[0]));
  }

  CurrentUserDataToLocal() {
    localStorage.removeItem('currentUserData');
    localStorage.setItem('currentUserData', JSON.stringify(this.currentUserData[0]));
  }
}