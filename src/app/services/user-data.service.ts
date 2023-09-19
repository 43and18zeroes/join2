import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private firestore: AngularFirestore) { }

  setAllUsersDataToLocalStorage() {
    this.firestore
      .collection('users')
      .valueChanges()
      .subscribe((changes: any) => {
        localStorage.removeItem('users');
        localStorage.setItem('users', JSON.stringify(changes));
      })
  }
}