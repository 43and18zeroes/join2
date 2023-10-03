import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MainComponent } from '../main/main.component';

@Component({
  selector: 'app-main-add-task',
  templateUrl: './main-add-task.component.html',
  styleUrls: ['./main-add-task.component.scss']
})
export class MainAddTaskComponent {

  addTaskForm: FormGroup;
  today: string;
  selectedPriority: string;

  allUsersData;
  currentUserData;

  constructor(
    private fb: FormBuilder,
    public mainComponent: MainComponent) {
    this.addTaskForm = this.fb.group({
      title: ['', Validators.required],
      description: [''],
      assignedTo: [''],
      dueDate: ['', Validators.required],
      priority: ['low'],
      category: ['', Validators.required],
      subTask: ['']
    });

    this.today = this.getTodaysDate();
  }

  ngOnInit(): void {
    this.allUsersData = this.mainComponent.allUsersData;
    this.currentUserData = this.mainComponent.currentUserData;
    console.log("this.currentUserData add task", this.currentUserData);
  }

  onSubmit(): void {
    if (this.addTaskForm.valid) {
      // Handle the form submission.
      const newTask = this.addTaskForm.value;
      console.log(newTask);
    }
  }

  getTodaysDate(): string {
    const now = new Date();
    const year = now.getFullYear().toString();
    const month = (now.getMonth() + 1).toString().padStart(2, '0'); // Monat mit führender Null
    const day = now.getDate().toString().padStart(2, '0'); // Tag mit führender Null
    return `${year}-${month}-${day}`;
  }

  setPriority(priority: string) {
    this.selectedPriority = priority;
    this.addTaskForm.controls['priority'].setValue(priority);
  }
}
