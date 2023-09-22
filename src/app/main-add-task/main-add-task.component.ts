import { Component } from '@angular/core';

@Component({
  selector: 'app-main-add-task',
  templateUrl: './main-add-task.component.html',
  styleUrls: ['./main-add-task.component.scss']
})
export class MainAddTaskComponent {



  constructor() { }

  ngOnInit(): void {
  }

  testFunction() {
    let changes = {userName: 'Christoph', userEmailAddress: 'gast@gast.de'}
    localStorage.setItem('currentUserData', JSON.stringify(changes));
    let currentUserData = JSON.parse(localStorage.getItem('currentUserData') || '[]');
    console.log("this.currentUserData", currentUserData);
  }
}
