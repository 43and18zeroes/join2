import { Component } from '@angular/core';
import { getAuth, signOut } from "firebase/auth";
import { Router } from '@angular/router';
import { MainCommunicationService } from '../services/main-communication.service';

@Component({
  selector: 'app-main-header-profile-dialog',
  templateUrl: './main-header-profile-dialog.component.html',
  styleUrls: ['./main-header-profile-dialog.component.scss']
})
export class MainHeaderProfileDialogComponent {

  constructor(
    private mainCommService: MainCommunicationService,
    private router: Router
    ) { }

  displayPrivacyPolicy() {
    // this.mainComponent.currentlyDisplayed = "help";
    // this.mainComponent.currentlyClicked = "default";
    this.mainCommService.displayPrivacyPolicyService('privacyPolicy');
  }
  
  logOut() {
    this.mainCommService.displaySummaryService('summary');
    const auth = getAuth();
    signOut(auth).then(() => {
      this.router.navigateByUrl('/');
    }).catch((error) => {
    });
  }
}
