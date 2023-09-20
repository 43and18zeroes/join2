import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss']
})
export class MainComponent implements OnInit {

  aktuellAngezeigt: 'summary' | 'addTask' | 'board' | 'contacts' = 'summary';

  anzeigen(zustand: 'summary' | 'addTask' | 'board' | 'contacts') {
    this.aktuellAngezeigt = zustand;
  }

  constructor() { }

  ngOnInit(): void {
  }

}
