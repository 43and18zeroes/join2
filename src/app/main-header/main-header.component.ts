import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { getAuth, signOut } from "firebase/auth";

@Component({
  selector: 'app-main-header',
  templateUrl: './main-header.component.html',
  styleUrls: ['./main-header.component.scss']
})
export class MainHeaderComponent implements OnInit {

  currentUserAuth;

  constructor(private router: Router) { }

  ngOnInit(): void {
    this.getCurrentUserAuth();
  }

  getCurrentUserAuth() {
    const auth = getAuth();
    auth.onAuthStateChanged((user) => {
      if (user != null) {
        this.currentUserAuth = user;
        // console.log("user", user);
        // const displayUserName = user.email;
        // console.log("this.displayUserName", displayUserName);
      } else {
        // No user is signed in.
      }
    });
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
