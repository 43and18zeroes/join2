import { Component, OnInit } from '@angular/core';
import { MainComponent } from '../main/main.component';
// import { UserService } from '../services/user-data.service';

@Component({
  selector: 'app-main-summary',
  templateUrl: './main-summary.component.html',
  styleUrls: ['./main-summary.component.scss']
})
export class MainSummaryComponent implements OnInit {

  showGreetingScreenMobile = true;
  currenUserIsGuest = true;
  currentUserData;

  constructor(public mainComponent: MainComponent) { }

  ngOnInit(): void {
    this.currentUserData = this.mainComponent.currentUserData;
    if (this.currentUserData.userName !== "Gast") {
      this.currenUserIsGuest = false;
    }
  }

}
