import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private firestore: AngularFirestore) { }

  getAllUsersData() {
    this.firestore
      .collection('users')
      .valueChanges()
      .subscribe((changes: any) => {
        localStorage.removeItem('users');
        localStorage.setItem('users', JSON.stringify(changes));
      })
  }
}