import { Component } from '@angular/core';

@Component({
  selector: 'app-main-board',
  templateUrl: './main-board.component.html',
  styleUrls: ['./main-board.component.scss']
})
export class MainBoardComponent {

  constructor() { }

  ngOnInit(): void {
    // let currentUserData = JSON.parse(localStorage.getItem('currentUserData') || '[]');
    // console.log("currentUserData", currentUserData);
  }

}
