import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  allUsersData;

  constructor(private firestore: AngularFirestore) { }

  setAllUsersDataToVar() {
    this.firestore
      .collection('users')
      .valueChanges()
      .subscribe((changes: any) => {
        this.allUsersData = changes;
        console.log("this.allUsersData", this.allUsersData);
        // localStorage.removeItem('users');
        // localStorage.setItem('users', JSON.stringify(changes));
      })
  }

  // Eine Methode, um auf die Daten von außen zuzugreifen
  getAllUsersData() {
    return this.allUsersData;
  }
}