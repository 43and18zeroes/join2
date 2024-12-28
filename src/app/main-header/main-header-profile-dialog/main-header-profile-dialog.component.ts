import { Component } from "@angular/core";
// import { getAuth, signOut } from "firebase/auth";
import { Router } from "@angular/router";
import { MainCommunicationService } from "../../services/main-communication.service";
import { MatDialog } from "@angular/material/dialog";
import { AuthService } from "src/app/services/drf/auth.service";

@Component({
  selector: "app-main-header-profile-dialog",
  templateUrl: "./main-header-profile-dialog.component.html",
  styleUrls: ["./main-header-profile-dialog.component.scss"],
})
export class MainHeaderProfileDialogComponent {
  constructor(
    private authService: AuthService,
    private mainCommService: MainCommunicationService,
    public dialog: MatDialog,
    private router: Router
  ) {}

  displayPrivacyPolicy() {
    this.mainCommService.displayPrivacyPolicyService("privacyPolicy");
    this.dialog.closeAll();
  }

  logOut() {
    this.authService.logOut().subscribe({
      next: () => {
        // Erfolgreich ausgeloggt
        localStorage.removeItem("authToken");
        this.router.navigateByUrl("/");
        this.dialog.closeAll();
        setTimeout(() => {
          this.mainCommService.displaySummaryService("summary");
        }, 1);
      },
      error: (err) => {
        console.error("Logout-Fehler:", err);
      },
    });
  }

  // logOut() {
  //   // const auth = getAuth();
  //   // signOut(auth).then(() => {
  //   //   this.router.navigateByUrl('/');
  //   // }).catch((error) => {
  //   // });
  //   this.dialog.closeAll();
  //   setTimeout(() => {
  //     this.mainCommService.displaySummaryService('summary');
  //   }, 1);
  // }
}