import { Component } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";

@Component({
  selector: "app-privacy-policy",
  templateUrl: "./privacy-policy.component.html",
  styleUrls: ["./privacy-policy.component.scss"],
})
export class PrivacyPolicyComponent {

    constructor(
      public dialog: MatDialog,
    ) { }

    closeDialog() {
      this.dialog.closeAll();
    }
}
