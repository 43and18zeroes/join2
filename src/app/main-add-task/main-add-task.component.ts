import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MainComponent } from '../main/main.component';

@Component({
  selector: 'app-main-add-task',
  templateUrl: './main-add-task.component.html',
  styleUrls: ['./main-add-task.component.scss']
})
export class MainAddTaskComponent {

  allUsersData;
  currentUserData;

  addTaskForm: FormGroup;

  title: string = 'Select a contact to assign';
  showDropdown: boolean = false;
  options: any[] = [
    { name: 'Option 1', selected: false },
    { name: 'Option 2', selected: false },
    { name: 'Option 3', selected: false },
    // ... mehr Optionen
  ];

  today: string;
  selectedPriority: string;

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

  toggleDropdown() {
    this.showDropdown = !this.showDropdown;
  }

  selectOption(user: any) {
    if (user) {
        user.selected = !user.selected;
    }
    // Sie können hier auch weitere Logik hinzufügen, falls notwendig
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

  onSubmit(): void {
    if (this.addTaskForm.valid) {
      // Handle the form submission.
      const newTask = this.addTaskForm.value;
      console.log(newTask);
    }
  }
}
