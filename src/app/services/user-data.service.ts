import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private firestore: AngularFirestore) { }

  getAllUsersData() {
    // return this.firestore.collection('users').valueChanges();
    this.firestore
      .collection('users')
      .valueChanges()
      .subscribe((changes: any) => {
        let allUsersData = changes;
        // console.log("allUsersData", allUsersData);
        localStorage.setItem('users', JSON.stringify(changes));
      })
  }
}