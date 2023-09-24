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
}
