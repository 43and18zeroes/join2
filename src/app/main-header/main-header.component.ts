import { Component, HostListener, OnInit } from '@angular/core';
import { BreakpointObserver } from '@angular/cdk/layout';
import { MainComponent } from '../main/main.component';
import { Router } from '@angular/router';
import { UserService } from '../services/user-data.service';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { MainHeaderProfileDialogComponent } from './main-header-profile-dialog/main-header-profile-dialog.component';
import { BackendUserDataService } from '../services/drf/backend-user-data.service';

@Component({
  selector: 'app-main-header',
  templateUrl: './main-header.component.html',
  styleUrls: ['./main-header.component.scss']
})
export class MainHeaderComponent implements OnInit {

  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    this.updateBreakpoint();
  }

  userData: any = null;
  currentUserInitials;
  isSmallScreen = this.breakpointObserver.isMatched('(max-width: 992px)');

  constructor(
    private backendUserDataService: BackendUserDataService,
    public breakpointObserver: BreakpointObserver,
    public dialog: MatDialog,
    public mainComponent: MainComponent,
    private router: Router,
    private userService: UserService) { }

  ngOnInit(): void {
    this.backendUserDataService.getUserDataObservable().subscribe((data) => {
      this.userData = data;
    });
  }

  displayHelp() {
    this.mainComponent.currentlyDisplayed = "help";
    this.mainComponent.currentlyClicked = "default";
  }

  openProfileDialog() {
    const dialogConfig = new MatDialogConfig();
    this.checkBreakpoint(dialogConfig);
    dialogConfig.panelClass = 'profile__dialog';
    const dialogRef = this.dialog.open(MainHeaderProfileDialogComponent, dialogConfig);
  }

  checkBreakpoint(dialogConfig) {
    if (this.isSmallScreen) {
      dialogConfig.position = {
        top: '80px',
        right: '10px'
      };
    } else {
      dialogConfig.position = {
        top: '96px',
        right: '30px'
      };
    }
  }

  updateBreakpoint() {
    this.isSmallScreen = this.breakpointObserver.isMatched('(max-width: 992px)');
  }
}
