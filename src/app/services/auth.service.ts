import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { GoogleAuthProvider } from 'firebase/auth';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private afs: AngularFireAuth) { }

  signInWithGoogle() {
    return this.afs.signInWithPopup(new GoogleAuthProvider()); 
  }

  signUp(user : {email: string, password: string}) {
    return this.afs.createUserWithEmailAndPassword(user.email, user.password);
  }

  signWithEmailAndPassword(user : {email: string, password: string}) {
    return this.afs.signInWithEmailAndPassword(user.email, user.password);
  }
}
