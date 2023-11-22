import { Component } from '@angular/core';
import { getAuth, signOut } from "firebase/auth";
import { Router } from '@angular/router';

@Component({
  selector: 'app-main-header-profile-dialog',
  templateUrl: './main-header-profile-dialog.component.html',
  styleUrls: ['./main-header-profile-dialog.component.scss']
})
export class MainHeaderProfileDialogComponent {

  constructor(private router: Router) { }

  displayPrivacyPolicy() {
    // this.mainComponent.currentlyDisplayed = "help";
    // this.mainComponent.currentlyClicked = "default";
  }
  
  logOut() {
    const auth = getAuth();
    signOut(auth).then(() => {
      this.router.navigateByUrl('/');
    }).catch((error) => {
    });
  }
}
