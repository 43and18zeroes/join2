import { Component, OnInit } from '@angular/core';
import { MainComponent } from '../main/main.component';
// import { UserService } from '../services/user-data.service';

@Component({
  selector: 'app-main-summary',
  templateUrl: './main-summary.component.html',
  styleUrls: ['./main-summary.component.scss']
})
export class MainSummaryComponent implements OnInit {

  showGreetingScreen = true;
  currentUserData;

  constructor(public mainComponent: MainComponent) { }

  ngOnInit(): void {
    this.currentUserData = this.mainComponent.currentUserData;
  }

}
