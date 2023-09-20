import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss']
})
export class MainComponent implements OnInit {

  currentlyDisplayed: 'summary' | 'addTask' | 'board' | 'contacts' = 'summary';

  displayMainSection(condition: 'summary' | 'addTask' | 'board' | 'contacts') {
    this.currentlyDisplayed = condition;
  }

  constructor() { }

  ngOnInit(): void {
  }

}
