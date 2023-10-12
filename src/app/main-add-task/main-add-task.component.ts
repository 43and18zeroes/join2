import { Component, ElementRef, Renderer2, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MainComponent } from '../main/main.component';
import { AngularFirestore } from '@angular/fire/compat/firestore';

@Component({
  selector: 'app-main-add-task',
  templateUrl: './main-add-task.component.html',
  styleUrls: ['./main-add-task.component.scss']
})
export class MainAddTaskComponent {

  allUsersData;
  currentUserData;
  addTaskForm: FormGroup;
  showAssignedDropdown: boolean = false;
  @ViewChild('assignSelectedOptionRef') assignSelectedOptionRef: ElementRef;
  @ViewChild('assignSelectRef') assignSelectRef: ElementRef;
  private globalClickListener: Function;
  selectedUsers: any[] = [];
  today: string;
  selectedPriority: string;
  showCategoryDropdown: boolean = false;
  @ViewChild('categorySelect') categorySelect: ElementRef;
  @ViewChild('categorySelectRef') categorySelectRef: ElementRef;
  subTasksInputHasFocus: boolean = false;
  @ViewChild('subTasksInput') subTasksInput: ElementRef;
  subTasksInputEmpty: boolean = true;
  subTasksMaxReached: boolean = false;
  subTasksArray: string[] = [];
  subTaskCurrentlyEditing: string | null = null;
  @ViewChild('subTaskEditCurrentInput') subTaskEditCurrentInput: ElementRef;

  titleValid: boolean = true;
  dateValid: boolean = true;
  categoryValid: boolean = true;

  constructor(
    private firestore: AngularFirestore,
    private fb: FormBuilder,
    public mainComponent: MainComponent,
    private renderer: Renderer2) {
    this.addTaskForm = this.fb.group({
      title: ['', Validators.required],
      description: [''],
      assignedTo: [[]],
      dueDate: ['', Validators.required],
      priority: ['low'],
      category: ['', Validators.required],
      subTasks: []
    });

    this.today = this.getTodaysDate();
  }

  ngOnInit(): void {
    this.allUsersData = this.mainComponent.allUsersData;
    this.currentUserData = this.mainComponent.currentUserData;
    this.globalClickListener = this.renderer.listen('document', 'click', (event) => {
      if (!this.assignSelectRef.nativeElement.contains(event.target)) {
        this.assignCloseDropdown();
      }
    });
    this.globalClickListener = this.renderer.listen('document', 'click', (event) => {
      if (!this.categorySelectRef.nativeElement.contains(event.target)) {
        this.categoryCloseDropdown();
      }
    });
  }

  ngOnDestroy() {
    this.globalClickListener();
  }

  formGroupEnterKey(event: Event): void {
    event.preventDefault();
  }

  assignToggleDropdown() {
    this.showAssignedDropdown = !this.showAssignedDropdown;
  }

  assignSelectOption(user: any) {
    if (user) {
      user.selected = !user.selected;
      if (user.selected) {
        this.selectedUsers.push(user);
      } else {
        const index = this.selectedUsers.indexOf(user);
        if (index !== -1) {
          this.selectedUsers.splice(index, 1);
        }
      }
    }
    this.assignSelectedOptionRef.nativeElement.focus();
  }

  assignPreventFocusLoss(event: MouseEvent) {
    event.preventDefault();
  }

  categoryPreventFocusLoss(event: MouseEvent) {
    event.preventDefault();
    this.categorySelect.nativeElement.focus();
  }

  assignCloseDropdown() {
    this.showAssignedDropdown = false;
  }

  categoryCloseDropdown() {
    this.showCategoryDropdown = false;
  }

  getTodaysDate(): string {
    const now = new Date();
    const year = now.getFullYear().toString();
    const month = (now.getMonth() + 1).toString().padStart(2, '0');
    const day = now.getDate().toString().padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  setPriority(priority: string) {
    this.selectedPriority = priority;
    this.addTaskForm.controls['priority'].setValue(priority);
  }

  categoryToggleDropdown() {
    this.showCategoryDropdown = !this.showCategoryDropdown;
  }

  selectCategory(category: string) {
    this.addTaskForm.controls['category'].setValue(category);
    this.categoryToggleDropdown();
  }

  subTasksInputFocus() {
    this.subTasksInputHasFocus = true;
    this.subTasksInput.nativeElement.focus();
  }

  subTasksInputCheckValue() {
    if (this.subTasksInput.nativeElement.value == '') {
      this.subTasksInputEmpty = true;
    } else {
      this.subTasksInputEmpty = false;
      this.subTasksInputHasFocus = true;
    }
  }

  subTasksInputClear() {
    this.subTasksInput.nativeElement.value = '';
    this.subTasksInputHasFocus = false;
    this.subTasksInputCheckValue();
  }

  subTaskInputEnterPressed(event: Event) {
    if (event instanceof KeyboardEvent && event.key === 'Enter') {
      event.preventDefault();
      this.subTaskInputConfirm();
    }
  }

  subTaskInputConfirm() {
    const subTaskValue = this.subTasksInput.nativeElement.value.trim();
    if (subTaskValue) {
      this.subTasksArray.push(subTaskValue);
      this.setSubtasksForm();
      this.subTasksInput.nativeElement.value = "";
      this.subTasksInputHasFocus = false;
      this.subTasksInputCheckValue();
      this.subTaskCheckAmount();
    }
  }

  subTaskDelete(subTask) {
    for (let i = 0; i < this.subTasksArray.length; i++) {
      if (this.subTasksArray[i] === subTask) {
        this.subTasksArray.splice(i, 1);
        break;
      }
    }
    this.setSubtasksForm();
    this.subTaskCheckAmount();
  }

  subTaskCheckAmount() {
    if (this.subTasksArray.length >= 2) {
      this.subTasksInput.nativeElement.disabled = true;
      this.subTasksMaxReached = true;
    } else {
      this.subTasksInput.nativeElement.disabled = false;
      this.subTasksMaxReached = false;
    }
  }

  subTaskEdit(subTask: string): void {
    this.subTaskCurrentlyEditing = subTask;
    setTimeout(() => {
      this.subTaskEditCurrentInput.nativeElement.focus();
    }, 10);
  }

  subTaskSaveEdited(index: number): void {
    if (this.subTasksArray[index] !== undefined) {
      this.subTasksArray[index] = this.subTaskEditCurrentInput.nativeElement.value;
    }
    this.subTaskCurrentlyEditing = null;
    this.setSubtasksForm();
  }

  subTaskInputEditBlur() {
    if (this.subTaskEditCurrentInput && !this.subTaskEditCurrentInput.nativeElement.contains(document.activeElement)) {
      this.subTaskEditCancel();
    }
  }

  subTaskEditCancel(): void {
    this.subTaskCurrentlyEditing = null;
  }

  setSubtasksForm() {
    this.addTaskForm.controls['subTasks'].setValue(this.subTasksArray);
    this.subTasksInput.nativeElement.value = '';
  }

  onSubmit(): void {
    this.checkRequiredInputs();
    if (this.addTaskForm.valid) {
      const untrimmedTask = this.addTaskForm.value;
      const trimmedTask = untrimmedTask;
      trimmedTask.title = untrimmedTask.title.trim();
      trimmedTask.description = untrimmedTask.description.trim();
      this.addAssignedTo(trimmedTask)
      if (trimmedTask.subTasks === null) {
        trimmedTask.subTasks = [];
      }
      this.sendNewTaskToBackend(trimmedTask);
    }
  }

  checkRequiredInputs() {
    if (this.addTaskForm.value.title === "") {
      this.titleValid = false;
    } else {
      this.titleValid = true;
    }
    if (this.addTaskForm.value.dueDate) {
      this.dateValid = true;
    } else {
      this.dateValid = false;
    }
    if (this.addTaskForm.value.category === "") {
      this.categoryValid = false;
    } else {
      this.categoryValid = true;
    }
  }

  addAssignedTo(trimmedTask) {
    let assignedMailAdresses = [];
    for (const item of this.selectedUsers) {
      if (item.userEmailAddress) {
        assignedMailAdresses.push(item.userEmailAddress);
      }
    }
    trimmedTask.assignedTo = assignedMailAdresses;
    return trimmedTask;
  }

  clearForm() {
    this.addTaskForm = this.fb.group({
      title: ['', Validators.required],
      description: [''],
      assignedTo: [[]],
      dueDate: ['', Validators.required],
      priority: ['low'],
      category: ['', Validators.required],
      subTasks: []
    });
    this.currentUserData.selected = false;
    this.allUsersData.forEach(user => user.selected = false);
    this.selectedPriority = 'undefined';
    this.subTasksArray = [];
    this.subTasksInput.nativeElement.value = "";
    this.subTasksInputHasFocus = false;
    this.subTasksInputCheckValue();
    this.subTaskCheckAmount();
    this.titleValid = true;
    this.dateValid = true;
    this.categoryValid = true;
  }

  sendNewTaskToBackend(trimmedTask) {
    this.firestore
      .collection('allTasks')
      .add(trimmedTask)
      .then((result: any) => {
        console.log("Task to backend", result);
      })
  }
}
