import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-main-add-task',
  templateUrl: './main-add-task.component.html',
  styleUrls: ['./main-add-task.component.scss']
})
export class MainAddTaskComponent {

  addTaskForm: FormGroup;

  constructor(private fb: FormBuilder) {
    this.addTaskForm = this.fb.group({
      title: ['', Validators.required],
      description: [''],
      assignedTo: [''],
      dueDate: ['', Validators.required],
      priority: ['low'],
      category: ['', Validators.required]
    });
  }

  ngOnInit(): void {
  }

  onSubmit(): void {
    if (this.addTaskForm.valid) {
      // Handle the form submission.
      const newTask = this.addTaskForm.value;
      console.log(newTask);
    }
  }

  setPriority(priority: string) {
    this.addTaskForm.controls['priority'].setValue(priority);
  }
}
