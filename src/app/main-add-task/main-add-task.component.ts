import { Component, ElementRef, Renderer2, ViewChild } from '@angular/core';
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
  subTasksArray: string[] = ['Test0', 'Test1'];
  // @ViewChild('subTask') subTask: ElementRef;
  subTaskCurrentlyEditing: string | null = null;
  @ViewChild('subTaskEditCurrentInput') subTaskEditCurrentInput: ElementRef;

  constructor(
    private fb: FormBuilder,
    public mainComponent: MainComponent,
    private renderer: Renderer2) {
    this.addTaskForm = this.fb.group({
      title: ['', Validators.required],
      description: [''],
      assignedTo: [''],
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
    this.globalClickListener();  // Listener entfernen, um Memory-Leaks zu vermeiden
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
    this.showAssignedDropdown = false;  // oder was auch immer Ihr Mechanismus zum Schließen des Dropdowns ist
  }

  categoryCloseDropdown() {
    this.showCategoryDropdown = false;  // oder was auch immer Ihr Mechanismus zum Schließen des Dropdowns ist
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
    }
  }

  subTasksInputClear() {
    this.subTasksInput.nativeElement.value = '';
    this.subTasksInputHasFocus = false;
    this.subTasksInputCheckValue();
  }

  confirmSubTask() {
    const subTaskValue = this.subTasksInput.nativeElement.value;
    if (subTaskValue) {
      this.subTasksArray.push(subTaskValue);
      this.setSubtasksForm();
      this.subTasksInput.nativeElement.value = "";
      this.subTasksInputCheckValue();
      this.subTasksInput.nativeElement.focus();
    }
  }

  subTaskDelete(subTask) {
    for (let i = 0; i < this.subTasksArray.length; i++) {
      if (this.subTasksArray[i] === subTask) {
        this.subTasksArray.splice(i, 1); // Entfernt das Element an Position i
        break; // Beende die Schleife, da das Element gefunden und entfernt wurde
      }
    }
    this.setSubtasksForm();
  }

  subTaskEdit(subTask: string): void {
    this.subTaskCurrentlyEditing = subTask;
    setTimeout(() => {
      this.subTaskEditCurrentInput.nativeElement.focus();
    }, 10);
    // this.subTask.nativeElement.classList.add('subtask__edit__class');
    // setTimeout(() => {
    //   this.subTaskEditCurrentInput.nativeElement.focus();
    //   this.subTaskEditCurrentInput.nativeElement.parentElement.parentElement.classList.add('subtask__edit__class');
    // }, 10);
  }

  subTaskSaveEdited(index: number): void {
    if (this.subTasksArray[index] !== undefined) {
      this.subTasksArray[index] = this.subTaskEditCurrentInput.nativeElement.value; // Optional: Entfernen von Leerzeichen am Anfang und Ende
    }
    this.subTaskCurrentlyEditing = null;
    // this.subTaskEditCurrentInput.nativeElement.parentElement.parentElement.classList.remove('subtask__edit__class');
    this.setSubtasksForm();
  }

  subTaskEditInputBlur(i, event: Event): void {
    this.subTaskSaveEdited(i);
    // this.subTaskEditCurrentInput.nativeElement.parentElement.parentElement.classList.remove('subtask__edit__class');
  }

  // cancelEditSubtask(): void {
  //   this.subTaskCurrentlyEditing = null;
  // }

  setSubtasksForm() {
    this.addTaskForm.controls['subTasks'].setValue(this.subTasksArray);
    this.subTasksInput.nativeElement.value = '';
    console.log("this.subTasksArray", this.subTasksArray);
    console.log("this.addTaskForm.value.subTasks", this.addTaskForm.value.subTasks);
  }

  onSubmit(): void {
    if (this.addTaskForm.valid) {
      // Handle the form submission.
      const newTask = this.addTaskForm.value;
      console.log(newTask);
    }
  }
}
