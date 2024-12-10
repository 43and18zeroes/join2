import { Injectable } from '@angular/core';
// import { AngularFireAuth } from '@angular/fire/compat/auth';
// import { getAuth } from 'firebase/auth';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(
    // private afs: AngularFireAuth
  ) { }

  // signUp(user : {userName: string, email: string, password: string}) {
  //   return this.afs.createUserWithEmailAndPassword(user.email, user.password);
  // }

  // signIn(user : {email: string, password: string}) {
  //   return this.afs.signInWithEmailAndPassword(user.email, user.password);
  // }

  // sendPasswordResetEmail(email: string): Promise<void> {
  //   return this.afs.sendPasswordResetEmail(email);
  // }
}
