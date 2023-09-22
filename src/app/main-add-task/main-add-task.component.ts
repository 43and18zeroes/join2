import { Component } from '@angular/core';
import { UserService } from '../services/user-data.service';

@Component({
  selector: 'app-main-add-task',
  templateUrl: './main-add-task.component.html',
  styleUrls: ['./main-add-task.component.scss']
})
export class MainAddTaskComponent {



  constructor(private userService: UserService) { }

  ngOnInit(): void {
  }

  testFunction() {
    console.log("this.userService.currentUserData[0]", this.userService.currentUserData[0]);
    this.userService.currentUserData[0] = {userName: 'Peter', userEmailAddress: 'gast@gast.de'};
    console.log("this.userService.currentUserData[0]", this.userService.currentUserData[0]);
    // localStorage.setItem('currentUserData', JSON.stringify(changes));
    // let currentUserData = JSON.parse(localStorage.getItem('currentUserData') || '[]');
    // console.log("this.currentUserData", currentUserData);
  }
}
