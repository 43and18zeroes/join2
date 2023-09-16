import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { getAuth, signOut } from "firebase/auth";

@Component({
  selector: 'app-main-header',
  templateUrl: './main-header.component.html',
  styleUrls: ['./main-header.component.scss']
})
export class MainHeaderComponent implements OnInit {

  constructor(private router: Router) { }

  ngOnInit(): void {
    getCurrentUserAuth();
  }

  getCurrentUserAuth() {
    const auth = getAuth();
    const user = auth.currentUser;
    auth.onAuthStateChanged(function(user) {
      if (user != null) {
        console.log("user2", user);
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
