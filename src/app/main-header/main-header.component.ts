import { Component, OnInit } from '@angular/core';
import { getAuth, signOut } from "firebase/auth";
import { MainComponent } from '../main/main.component';
import { Router } from '@angular/router';
import { UserService } from '../services/user-data.service';
import { MatDialog } from '@angular/material/dialog';
import { MainHeaderProfileDialogComponent } from '../main-header-profile-dialog/main-header-profile-dialog.component';

@Component({
  selector: 'app-main-header',
  templateUrl: './main-header.component.html',
  styleUrls: ['./main-header.component.scss']
})
export class MainHeaderComponent implements OnInit {

  currentUserInitials;

  constructor(
    public dialog: MatDialog,
    public mainComponent: MainComponent,
    private router: Router,
    private userService: UserService) { }

  ngOnInit(): void {
    this.currentUserInitials = this.userService.currentUserData.userInitials;
  }

  displayHelp() {
    this.mainComponent.currentlyDisplayed = "help";
    this.mainComponent.currentlyClicked = "default";
  }

  openProfileDialog() {
    // this.saveBoardStatus();
    // this.updateTasksStatus();
    const dialogRef = this.dialog.open(MainHeaderProfileDialogComponent, {
      panelClass: 'profile__dialog'
      // data: { taskStatus: taskStatus }
    });
    // dialogRef.afterClosed().subscribe((result) => {
      // this.allUsersData = this.userService.allUsersData;
      // this.resetSearchFunction();
      // this.allTasksData = this.userService.allTasksData;
      // this.convertTasksDataToLists();
      // this.sortTasksInColumns();
    // });
  }
}
