import { Component, ElementRef, Inject, Renderer2, ViewChild } from '@angular/core';
import { TaskDetailsCommService } from '../services/task-details-comm.service';
import { MainDialogTaskDetailsAndEditComponent } from '../main-dialog-task-details-and-edit/main-dialog-task-details-and-edit.component';
import { FormBuilder, Validators } from '@angular/forms';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { BoardCommService } from '../services/board-comm.service';
import { MainCommunicationService } from '../services/main-communication.service';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { UserService } from '../services/user-data.service';
import { TaskDataService } from '../services/task-data.service';
import { MainDialogAddTaskComponent } from '../main-dialog-add-task/main-dialog-add-task.component';
import { MainDialogAddContactComponent } from '../main-dialog-add-contact/main-dialog-add-contact.component';

@Component({
  selector: 'app-main-dialog-task-details-and-edit-edit-view',
  templateUrl: './main-dialog-task-details-and-edit-edit-view.component.html',
  styleUrls: ['./main-dialog-task-details-and-edit-edit-view.component.scss']
})
export class MainDialogTaskDetailsAndEditEditViewComponent {

  @ViewChild('assignSelectedOptionRef') assignSelectedOptionRef: ElementRef;
  @ViewChild('assignSelectRef') assignSelectRef: ElementRef;
  @ViewChild('categorySelect') categorySelect: ElementRef;
  @ViewChild('categorySelectRef') categorySelectRef: ElementRef;
  @ViewChild('subTasksInput') subTasksInput: ElementRef;
  @ViewChild('subTaskEditCurrentInput') subTaskEditCurrentInput: ElementRef;
  @ViewChild('submitBtn') submitBtn: ElementRef;

  taskData;
  updatedTaskData;
  editTaskForm;
  allUsersData;
  currentUserData;
  showAssignedDropdown: boolean = false;
  selectedUsers: any[] = [];
  today: string;
  selectedPriority: string;
  showCategoryDropdown: boolean = false;
  subTasksInputHasFocus: boolean = false;
  subTasksInputEmpty: boolean = true;
  subTasksMaxReached: boolean = false;
  subTasksArray: string[] = [];
  subTaskCurrentlyEditing: string | null = null;
  formSubmitted: boolean = false;
  titleValid: boolean = true;
  dateValid: boolean = true;
  categoryValid: boolean = true;

  private globalClickListener: Function;

  constructor(
    private taskDetailsCommService: TaskDetailsCommService,
    public mainDialogTaskDetailsAndEditComponent: MainDialogTaskDetailsAndEditComponent,
    private fb: FormBuilder,
    private firestore: AngularFirestore,
    public boardCommService: BoardCommService,
    private mainCommService: MainCommunicationService,
    private renderer: Renderer2,
    public dialog: MatDialog,
    private userService: UserService,
    public taskDataService: TaskDataService,
    public dialogRef: MatDialogRef<MainDialogAddTaskComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.initializeEditTaskForm();
    this.today = this.getTodaysDate();
  }

  initializeEditTaskForm() {
    this.editTaskForm = this.fb.group({
      title: ['', Validators.required],
      description: [''],
      assignedTo: [[]],
      dueDate: ['', Validators.required],
      priority: [''],
      category: ['', Validators.required],
      subTasks: [],
      subTasksCompleted: [],
      taskStatus: [],
      taskColumnOrder: 0
    });
  }

  ngOnInit(): void {
    this.taskData = this.mainDialogTaskDetailsAndEditComponent.taskData;
    this.updatedTaskData = this.mainDialogTaskDetailsAndEditComponent.taskData;
    this.userService.sortUsersData();
    this.allUsersData = this.userService.allUsersData;
    this.currentUserData = this.userService.currentUserData;
    this.initListeners();
  }

  initListeners() {
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

  ngAfterViewInit() {
    setTimeout(() => {
      this.determineAssignees();
      this.getDueDate();
      this.getPriority();
      this.getCategory();
      this.getSubTasks();
    });
  }

  ngOnDestroy() {
    this.globalClickListener();
  }

  determineAssignees() {
    for (let index = 0; index < this.allUsersData.length; index++) {
      const singleUser = this.allUsersData[index];
      if (this.taskData.assignedTo.includes(singleUser.userEmailAddress)) {
        this.selectedUsers.push(singleUser);
      }
    }
  }

  getDueDate() {
    if (this.taskData && this.taskData.dueDate) {
      this.editTaskForm.patchValue({
        dueDate: this.taskData.dueDate
      });
    }
  }

  getPriority() {
    if (this.taskData.priority) {
      this.editTaskForm.patchValue({
        priority: this.taskData.priority
      });
      this.selectedPriority = this.taskData.priority;
    }
  }

  getCategory() {
    if (this.taskData.category) {
      this.editTaskForm.patchValue({
        category: this.taskData.category
      });
    }
  }

  getSubTasks() {
    if (this.taskData.subTasks) {
      this.editTaskForm.patchValue({
        subTasks: this.taskData.subTasks
      });
      this.subTasksArray = this.taskData.subTasks;
      this.subTaskCheckAmount();
    }
  }

  closeDialog() {
    this.taskDetailsCommService.unsetEditMode();
    this.dialog.closeAll();
  }

  formGroupEnterKey(event: Event): void {
    event.preventDefault();
  }

  assignToggleDropdown() {
    this.allUsersData = this.userService.allUsersData;
    this.showAssignedDropdown = !this.showAssignedDropdown;
    for (let index = 0; index < this.selectedUsers.length; index++) {
      const selectedUser = this.selectedUsers[index];
      for (let index = 0; index < this.allUsersData.length; index++) {
        const allUser = this.allUsersData[index];
        if (selectedUser.userEmailAddress === allUser.userEmailAddress) {
          allUser.selected = true;
        }
        if (selectedUser.userEmailAddress === this.currentUserData.userEmailAddress) {
          this.currentUserData.selected = true;
        }
      }
    }
  }

  assignSelectOption(user: any) {
    if (user) {
      const index = this.selectedUsers.findIndex(u => u.firebaseId === user.firebaseId);
      user.selected = !user.selected;
      if (user.selected) {
        this.selectedUsers.push(user);
      } else if (!user.selected && index !== -1) {
        this.selectedUsers.splice(index, 1);
      }
      this.taskData.assignedTo = this.selectedUsers.map(user => user.userEmailAddress);
    }
  }

  assignPreventFocusLoss(event: MouseEvent) {
    event.preventDefault();
  }

  openAddUserDialog() {
    const dialogRef = this.dialog.open(MainDialogAddContactComponent, {
      panelClass: 'popup__contact__add'
    });
    dialogRef.afterClosed().subscribe((result) => {
      this.userService.sortUsersData();
    });
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
    this.editTaskForm.controls['priority'].setValue(priority);
  }

  categoryToggleDropdown() {
    this.showCategoryDropdown = !this.showCategoryDropdown;
  }

  selectCategory(category: string) {
    this.editTaskForm.controls['category'].setValue(category);
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
      this.updateSubTasksCompleted();
    }
  }

  subTaskDelete(subTask) {
    for (let i = 0; i < this.subTasksArray.length; i++) {
      if (this.subTasksArray[i] === subTask) {
        this.subTasksArray.splice(i, 1);
        this.deleteSubTasksCompleted(i);
        break;
      }
    }
    this.setSubtasksForm();
    this.subTaskCheckAmount();
  }

  deleteSubTasksCompleted(i) {
    this.updatedTaskData.subTasksCompleted.splice(i, 1);
  }

  updateSubTasksCompleted() {
    this.updatedTaskData.subTasksCompleted.push(false);
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
    this.editTaskForm.controls['subTasks'].setValue(this.subTasksArray);
    this.subTasksInput.nativeElement.value = '';
  }

  clearForm() {
    this.resetFormModel();
    this.currentUserData.selected = false;
    this.allUsersData.forEach(user => user.selected = false);
    this.selectedUsers = [];
    this.selectedPriority = 'undefined';
    this.subTasksArray = [];
    this.subTasksInput.nativeElement.value = "";
    this.subTasksInputHasFocus = false;
    this.subTasksInputCheckValue();
    this.subTaskCheckAmount();
    this.resetFormValidators();
  }

  resetFormModel() {
    this.editTaskForm = this.fb.group({
      title: ['', Validators.required],
      description: [''],
      assignedTo: [[]],
      dueDate: ['', Validators.required],
      priority: ['low'],
      category: ['', Validators.required],
      subTasks: [],
      subTasksCompleted: [],
      taskStatus: [],
      taskColumnOrder: 0
    });
  }

  resetFormValidators() {
    this.titleValid = true;
    this.dateValid = true;
    this.categoryValid = true;
  }

  onSubmit(): void {
    this.checkRequiredInputs();
    if (this.editTaskForm.valid) {
      this.updateTaskArray();
      this.trimmTaskArray();
      this.boardCommService.updatedTaskData = this.updatedTaskData;
      this.boardCommService.updateSingleTaskVar();
      this.updateTaskSingleBackend();
      this.taskDetailsCommService.unsetEditMode();
      this.onSubmitOutro();
    }
  }

  updateTaskArray() {
    this.formSubmitted = true;
    this.updatedTaskData.title = this.taskData.title;
    this.updatedTaskData.description = this.taskData.description;
    this.updatedTaskData.assignedTo = this.taskData.assignedTo;
    this.updatedTaskData.dueDate = this.editTaskForm.value.dueDate;
    this.updatedTaskData.priority = this.editTaskForm.value.priority;
    this.updatedTaskData.category = this.editTaskForm.value.category;
    this.updatedTaskData.subTasks = this.taskData.subTasks;
  }

  trimmTaskArray() {
    const trimmedTask = this.trimTask();
    this.addAssignedTo(trimmedTask)
    if (trimmedTask.subTasks === null) trimmedTask.subTasks = [];
    this.updatedTaskData = trimmedTask;
  }

  checkRequiredInputs() {
    if (this.editTaskForm.value.title === "") this.titleValid = false;
    else this.titleValid = true;
    if (this.editTaskForm.value.dueDate) this.dateValid = true;
    else this.dateValid = false;
    if (this.editTaskForm.value.category === "") this.categoryValid = false;
    else this.categoryValid = true;
  }

  trimTask() {
    const untrimmedTask = this.updatedTaskData;
    const trimmedTask = this.updatedTaskData;
    trimmedTask.title = untrimmedTask.title.trim();
    trimmedTask.description = untrimmedTask.description.trim();
    return trimmedTask;
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

  sendNewTaskToBackend(trimmedTask) {
    delete trimmedTask.firebaseId;
    this.firestore.collection('tasks').add(trimmedTask).then((docRef) => {
      trimmedTask.firebaseId = docRef.id;
      return docRef.update({ firebaseId: docRef.id });
    })
      .then(() => {
      })
      .catch((error) => {
        console.error("Error adding or updating document: ", error);
      });
    this.clearForm();
  }

  onSubmitOutro() {
    this.submitBtn.nativeElement.classList.add("btn__success");
  }

  async updateTaskSingleBackend() {
    await this.firestore
      .collection('tasks')
      .doc(this.updatedTaskData.firebaseId)
      .update(this.updatedTaskData);
    this.boardCommService.reloadAfterNewTask();
  }
}
