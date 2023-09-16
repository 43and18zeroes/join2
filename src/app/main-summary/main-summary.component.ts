import { Component, OnInit } from '@angular/core';
// import { getAuth } from "firebase/auth";

@Component({
  selector: 'app-main-summary',
  templateUrl: './main-summary.component.html',
  styleUrls: ['./main-summary.component.scss']
})
export class MainSummaryComponent implements OnInit {

  // auth = getAuth();
  // user = this.auth.currentUser;

  constructor() { }

  ngOnInit(): void {
    // console.log("currentUser ", this.user);
  }

}
