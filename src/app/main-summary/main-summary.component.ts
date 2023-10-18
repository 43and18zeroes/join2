import { Component, OnInit } from '@angular/core';
import { MainComponent } from '../main/main.component';
import { UserService } from '../services/user-data.service';

@Component({
  selector: 'app-main-summary',
  templateUrl: './main-summary.component.html',
  styleUrls: ['./main-summary.component.scss']
})
export class MainSummaryComponent implements OnInit {

  showGreetingScreenMobile = true;
  currenUserIsGuest = true;
  currentUserData;
  currentDate = new Date();
  futureDate = new Date(this.currentDate);

  constructor(
    public mainComponent: MainComponent,
    private userService: UserService
    )
    {
    this.futureDate.setDate(this.currentDate.getDate() + 8);
  }

  ngOnInit(): void {
    this.showGreetingScreenMobile = this.mainComponent.showGreetingScreenMobile;
    this.currentUserData = this.userService.currentUserData;
    if (this.currentUserData.userName !== "Gast") {
      this.currenUserIsGuest = false;
    }
  }

}
