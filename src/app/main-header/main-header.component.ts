import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
// import { Firestore } from '@angular/fire/firestore';
import { Router } from '@angular/router';
import { getAuth, signOut } from "firebase/auth";
// import { collection } from 'firebase/firestore';

@Component({
  selector: 'app-main-header',
  templateUrl: './main-header.component.html',
  styleUrls: ['./main-header.component.scss']
})
export class MainHeaderComponent implements OnInit {

  currentUserAuth;
  allUsersData;
  currentUserData = [];
  currentUserName;

  constructor(private firestore: AngularFirestore,
              private router: Router) { }

  ngOnInit(): void {
    this.getCurrentUserAuth();
  }

  getCurrentUserAuth() {
    const auth = getAuth();
    auth.onAuthStateChanged((user) => {
      if (user != null) {
        this.currentUserAuth = user;
        this.getAllUsersData();
        // console.log("user", user);
        // const displayUserName = user.email;
        // console.log("this.displayUserName", displayUserName);
      } else {
        // No user is signed in.
      }
    });
  }

  getAllUsersData() {
    this.firestore
      .collection('users')
      .valueChanges()
      .subscribe((changes: any) => {
        console.log("changes", changes);
        this.allUsersData = changes;
        this.getCurrentUserData();
      })
  }

  getCurrentUserData() {
    for (const key in this.allUsersData) {
      if (this.allUsersData[key].userEmailAddress === this.currentUserAuth.email) {
        this.currentUserData.push(this.allUsersData[key]);
      }
    }
    this.currentUserName = this.currentUserData[0].userName;
  }

  logOut() {
    // console.log("logout");
    const auth = getAuth();
    signOut(auth).then(() => {
      this.router.navigateByUrl('/');
      // Sign-out successful.
    }).catch((error) => {
      // An error happened.
    });
  }
}
