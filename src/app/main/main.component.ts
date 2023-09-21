import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss']
})
export class MainComponent implements OnInit {

  currentlyDisplayed: string = 'summary';
  currentlyClicked: string = 'summary';

  displayMainSection(condition: 'summary' | 'addTask' | 'board' | 'contacts') {
    this.currentlyDisplayed = condition;
    this.currentlyClicked = condition;
  }

  constructor() { }

  ngOnInit(): void {
  }

}
