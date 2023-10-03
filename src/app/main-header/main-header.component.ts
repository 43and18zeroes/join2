import { Component, OnInit } from '@angular/core';
import { getAuth, signOut } from "firebase/auth";
import { MainComponent } from '../main/main.component';
import { Router } from '@angular/router';
import { UserService } from '../services/user-data.service';

@Component({
  selector: 'app-main-header',
  templateUrl: './main-header.component.html',
  styleUrls: ['./main-header.component.scss']
})
export class MainHeaderComponent implements OnInit {

  currentUserInitials;

  constructor(
    public mainComponent: MainComponent,
    private router: Router,
    private userService: UserService) { }

  ngOnInit(): void {
    this.currentUserInitials = this.mainComponent.currentUserData.userInitials;
    // this.getInitials();
  }

  // getInitials() {
  //   let userName = this.mainComponent.currentUserData.userName;
  //   let nameParts = userName.split(' ');
  //   if (nameParts.length >= 2) {
  //     let initials = nameParts[0].charAt(0).toUpperCase() + nameParts[1].charAt(0).toUpperCase();
  //     this.currentUserInitial = initials;
  //   }
  //   else {
  //     this.currentUserInitial = '';
  //   }
  // }

  logOut() {
    const auth = getAuth();
    signOut(auth).then(() => {
      this.router.navigateByUrl('/');
    }).catch((error) => {
    });
  }
}
