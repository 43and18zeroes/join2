import { Component, ElementRef, Inject, QueryList, Renderer2, ViewChild, ViewChildren } from "@angular/core";
import { TaskDetailsCommService } from "../services/task-details-comm.service";
import { MainDialogTaskDetailsAndEditComponent } from "../main-dialog-task-details-and-edit/main-dialog-task-details-and-edit.component";
import { FormArray, FormBuilder, FormControl, Validators } from "@angular/forms";
// import { AngularFirestore } from "@angular/fire/compat/firestore";
import { BoardCommService } from "../services/board-comm.service";
import { MainCommunicationService } from "../services/main-communication.service";
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from "@angular/material/dialog";
import { UserService } from "../services/user-data.service";
import { TaskDataService } from "../services/task-data.service";
import { MainDialogAddTaskComponent } from "../main-dialog-add-task/main-dialog-add-task.component";
import { MainDialogAddContactComponent } from "../main-dialog-add-contact/main-dialog-add-contact.component";
import { BackendService } from "../services/drf/backend-service.service";
import { BackendUserDataService } from "../services/drf/backend-user-data.service";

@Component({
  selector: "app-main-dialog-task-details-and-edit-edit-view",
  templateUrl: "./main-dialog-task-details-and-edit-edit-view.component.html",
  styleUrls: ["./main-dialog-task-details-and-edit-edit-view.component.scss"],
})
export class MainDialogTaskDetailsAndEditEditViewComponent {
  @ViewChild("assignSelectedOptionRef") assignSelectedOptionRef: ElementRef;
  @ViewChild("assignSelectRef") assignSelectRef: ElementRef;
  @ViewChild("categorySelect") categorySelect: ElementRef;
  @ViewChild("categorySelectRef") categorySelectRef: ElementRef;
  @ViewChild("subTasksInput") subTasksInput: ElementRef;
  @ViewChild("subTaskEditCurrentInput") subTaskEditCurrentInput: ElementRef;
  @ViewChild("submitBtn") submitBtn: ElementRef;
  @ViewChildren("subtaskEditInput") subtaskEditInputs!: QueryList<ElementRef>;

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
    private backendUserDataService: BackendUserDataService,
    private taskDetailsCommService: TaskDetailsCommService,
    public mainDialogTaskDetailsAndEditComponent: MainDialogTaskDetailsAndEditComponent,
    private fb: FormBuilder,
    // private firestore: AngularFirestore,
    public boardCommService: BoardCommService,
    private mainCommService: MainCommunicationService,
    private renderer: Renderer2,
    public dialog: MatDialog,
    private userService: UserService,
    public taskDataService: TaskDataService,
    public dialogRef: MatDialogRef<MainDialogAddTaskComponent>,
    private backendService: BackendService,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.initializeEditTaskForm();
    this.today = this.getTodaysDate();
  }

  // initializeEditTaskForm() {
  //   this.editTaskForm = this.fb.group({
  //     title: ["", Validators.required],
  //     description: [""],
  //     assignedTo: [[]],
  //     dueDate: ["", Validators.required],
  //     priority: [""],
  //     category: ["", Validators.required],
  //     subTasks: [],
  //     subTasksCompleted: [],
  //     taskStatus: [],
  //     taskColumnOrder: 0,
  //   });
  // }

  initializeEditTaskForm() {
    this.editTaskForm = this.fb.group({
      title: ["", Validators.required],
      description: [""],
      users: [[]],
      due_date: ["", Validators.required],
      priority: [""],
      category: ["", Validators.required],
      // subTasks: [],
      // subTasksCompleted: [],
      status: [],
      // taskColumnOrder: 0
      position: 0,
      subtasks: this.fb.array([]),
    });
  }

  ngOnInit(): void {
    this.taskData = this.mainDialogTaskDetailsAndEditComponent.taskData;
    this.updatedTaskData = this.mainDialogTaskDetailsAndEditComponent.taskData;
    // this.userService.sortUsersData();
    // this.allUsersData = this.userService.allUsersData;
    this.getUsersData();
    this.currentUserData = this.userService.currentUserData;
    this.initListeners();
  }

  getUsersData() {
    this.backendUserDataService.clearUserCache();
    this.backendUserDataService.getUsers().subscribe((data) => {
      this.allUsersData = data;
      console.log("this.allUsersData", this.allUsersData);
      this.sortUsersData();
    });
  }

  private sortUsersData(): void {
    this.allUsersData.sort((a, b) => {
      const firstNameA = a.first_name.toLowerCase();
      const firstNameB = b.first_name.toLowerCase();

      if (firstNameA < firstNameB) {
        return -1;
      }
      if (firstNameA > firstNameB) {
        return 1;
      }
      return 0;
    });
  }

  initListeners() {
    this.globalClickListener = this.renderer.listen("document", "click", (event) => {
      if (!this.assignSelectRef.nativeElement.contains(event.target)) {
        this.assignCloseDropdown();
      }
    });
    this.globalClickListener = this.renderer.listen("document", "click", (event) => {
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
    this.allUsersData.forEach((user) => (user.selected = false));
    this.globalClickListener();
  }

  determineAssignees() {
    // for (let index = 0; index < this.allUsersData.length; index++) {
    //   const singleUser = this.allUsersData[index];
    //   if (this.taskData.assignedTo.includes(singleUser.userEmailAddress)) {
    //     this.selectedUsers.push(singleUser);
    //   }
    // }
    const users = this.taskData?.users || [];
    this.selectedUsers = [...users];
  }

  getDueDate() {
    if (this.taskData && this.taskData.due_date) {
      this.editTaskForm.patchValue({
        due_date: this.taskData.due_date,
      });
    }
  }

  getPriority() {
    if (this.taskData.priority) {
      this.editTaskForm.patchValue({
        priority: this.taskData.priority,
      });
      this.selectedPriority = this.taskData.priority;
    }
  }

  getCategory() {
    if (this.taskData.category) {
      this.editTaskForm.patchValue({
        category: this.taskData.category,
      });
    }
  }

  // getSubTasks() {
  //   if (this.taskData.subtasks) {
  //     this.editTaskForm.patchValue({
  //       subTasks: this.taskData.subTasks,
  //     });
  //     this.subTasksArray = this.taskData.subTasks;
  //     this.subTaskCheckAmount();
  //   }
  // }

  getSubTasks() {
    if (this.taskData?.subtasks?.length) {
      const subtasksFormArray = this.editTaskForm.get("subtasks") as FormArray;
      subtasksFormArray.clear(); // Alte Werte entfernen
      this.taskData.subtasks.forEach((subtask: any) => {
        subtasksFormArray.push(
          this.fb.group({
            title: [subtask.title, Validators.required],
            editing: [false],
          })
        );
      });
      // this.checkSubtaskLimit();
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
    // this.allUsersData = this.userService.allUsersData;
    // this.showAssignedDropdown = !this.showAssignedDropdown;
    // for (let index = 0; index < this.selectedUsers.length; index++) {
    //   const selectedUser = this.selectedUsers[index];
    //   for (let index = 0; index < this.allUsersData.length; index++) {
    //     const allUser = this.allUsersData[index];
    //     if (selectedUser.userEmailAddress === allUser.userEmailAddress) {
    //       allUser.selected = true;
    //     }
    //     if (selectedUser.userEmailAddress === this.currentUserData.userEmailAddress) {
    //       this.currentUserData.selected = true;
    //     }
    //   }
    // }

    // this.allUsersData = this.taskData?.users || [];
    this.showAssignedDropdown = !this.showAssignedDropdown;
    for (let i = 0; i < this.selectedUsers.length; i++) {
      const selectedUser = this.selectedUsers[i];
      for (let j = 0; j < this.allUsersData.length; j++) {
        const user = this.allUsersData[j];
        if (selectedUser.email === user.email) {
          user.selected = true;
        }
        // if (selectedUser.email === this.currentUserData.email) {
        //   this.currentUserData.selected = true;
        // }
      }
    }
  }

  // assignSelectOption(user: any) {
  //   if (user) {
  //     const index = this.selectedUsers.findIndex((u) => u.firebaseId === user.firebaseId);
  //     user.selected = !user.selected;
  //     if (user.selected) {
  //       this.selectedUsers.push(user);
  //     } else if (!user.selected && index !== -1) {
  //       this.selectedUsers.splice(index, 1);
  //     }
  //     this.taskData.assignedTo = this.selectedUsers.map((user) => user.userEmailAddress);
  //   }
  // }

  assignSelectOption(user: any) {
    console.log("this.selectedUsers", this.selectedUsers);
    if (user) {
      user.selected = !user.selected;
      if (user.selected) {
        this.selectedUsers.push(user);
      } else {
        // const index = this.selectedUsers.indexOf(user);
        const index = this.selectedUsers.findIndex((u) => u.id === user.id);
        if (index !== -1) {
          this.selectedUsers.splice(index, 1);
        }
      }
    }
    this.assignSelectedOptionRef.nativeElement.focus();
    console.log("this.selectedUsers", this.selectedUsers);
  }

  assignPreventFocusLoss(event: MouseEvent) {
    event.preventDefault();
  }

  openAddUserDialog() {
    const dialogRef = this.dialog.open(MainDialogAddContactComponent, {
      panelClass: "popup__contact__add",
    });
    dialogRef.afterClosed().subscribe((result) => {
      // this.userService.sortUsersData();
      this.getUsersData();
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
    const month = (now.getMonth() + 1).toString().padStart(2, "0");
    const day = now.getDate().toString().padStart(2, "0");
    return `${year}-${month}-${day}`;
  }

  setPriority(priority: string) {
    this.selectedPriority = priority;
    this.editTaskForm.controls["priority"].setValue(priority);
  }

  categoryToggleDropdown() {
    this.showCategoryDropdown = !this.showCategoryDropdown;
  }

  selectCategory(category: string) {
    this.editTaskForm.controls["category"].setValue(category);
    this.categoryToggleDropdown();
  }

  subTasksInputFocus() {
    this.subTasksInputHasFocus = true;
    this.subTasksInput.nativeElement.focus();
  }

  subTasksInputCheckValue() {
    if (this.subTasksInput.nativeElement.value == "") {
      this.subTasksInputEmpty = true;
    } else {
      this.subTasksInputEmpty = false;
      this.subTasksInputHasFocus = true;
    }
  }

  subTasksInputClear() {
    this.subTasksInput.nativeElement.value = "";
    this.subTasksInputHasFocus = false;
    this.subTasksInputCheckValue();
  }

  subTaskInputEnterPressed(event: Event) {
    if (event instanceof KeyboardEvent && event.key === "Enter") {
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
    this.editTaskForm.controls["subTasks"].setValue(this.subTasksArray);
    this.subTasksInput.nativeElement.value = "";
  }

  clearForm() {
    this.resetFormModel();
    this.currentUserData.selected = false;
    this.allUsersData.forEach((user) => (user.selected = false));
    this.selectedUsers = [];
    this.selectedPriority = "undefined";
    this.subTasksArray = [];
    this.subTasksInput.nativeElement.value = "";
    this.subTasksInputHasFocus = false;
    this.subTasksInputCheckValue();
    this.subTaskCheckAmount();
    this.resetFormValidators();
  }

  resetFormModel() {
    this.editTaskForm = this.fb.group({
      title: ["", Validators.required],
      description: [""],
      // assignedTo: [[]],
      due_date: ["", Validators.required],
      priority: ["low"],
      category: ["", Validators.required],
      subTasks: [],
      // subTasksCompleted: [],
      status: [],
      // taskColumnOrder: 0,
      position: 0,
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
    // this.updatedTaskData.assignedTo = this.taskData.assignedTo;
    this.updatedTaskData.due_date = this.editTaskForm.value.due_date;
    this.updatedTaskData.priority = this.editTaskForm.value.priority;
    this.updatedTaskData.category = this.editTaskForm.value.category;
    this.updatedTaskData.subtasks = this.editTaskForm.value.subtasks;
    this.updatedTaskData.users = this.selectedUsers;
  }

  trimmTaskArray() {
    const trimmedTask = this.trimTask();
    // this.addAssignedTo(trimmedTask);
    // if (trimmedTask.subTasks === null) trimmedTask.subTasks = [];
    this.updatedTaskData = trimmedTask;
  }

  checkRequiredInputs() {
    if (this.editTaskForm.value.title === "") this.titleValid = false;
    else this.titleValid = true;
    if (this.editTaskForm.value.due_date) this.dateValid = true;
    else this.dateValid = false;
    if (this.editTaskForm.value.category === "") this.categoryValid = false;
    else this.categoryValid = true;
  }

  trimTask() {
    const untrimmedTask = this.updatedTaskData;
    let trimmedTask = this.updatedTaskData;
    trimmedTask.title = untrimmedTask.title.trim();
    trimmedTask.description = untrimmedTask.description.trim();
    // delete trimmedTask.category_choices;
    delete trimmedTask.subTasks;
    delete trimmedTask.taskColumnOrder;
    delete trimmedTask.taskStatus;
    trimmedTask = this.removeUserEmail(trimmedTask);
    return trimmedTask;
  }

  removeUserEmail(trimmedTask) {
    for (let index = 0; index < trimmedTask.users.length; index++) {
      const element = trimmedTask.users[index];
      delete element.email;
    }
    return trimmedTask;
  }

  // addAssignedTo(trimmedTask) {
  //   let assignedMailAdresses = [];
  //   for (const item of this.selectedUsers) {
  //     if (item.userEmailAddress) {
  //       assignedMailAdresses.push(item.userEmailAddress);
  //     }
  //   }
  //   trimmedTask.assignedTo = assignedMailAdresses;
  //   return trimmedTask;
  // }

  onSubmitOutro() {
    this.submitBtn.nativeElement.classList.add("btn__success");
  }

  async updateTaskSingleBackend() {
    this.backendService.updateItem(this.updatedTaskData, "tasks").subscribe(
      (response) => {
        console.log("Task updated successfully:", response);
      },
      (error) => {
        console.error("Error updating user:", error);
      }
    );
    this.boardCommService.reloadAfterNewTask();
  }

  get subtasks() {
    return this.editTaskForm.get("subtasks") as FormArray;
  }

  addSubtaskInput(value: string): void {
    const trimmedValue = value.trim();
    if (trimmedValue) {
      this.addSubtask(trimmedValue);
      this.subTasksInput.nativeElement.value = "";
      this.subTasksInputHasFocus = false;
      // this.checkSubtaskLimit();
    }
  }

  addSubtask(title: string): void {
    this.subtasks.push(
      this.fb.group({
        title: [title, Validators.required],
        editing: [false],
      })
    );
    // this.checkSubtaskLimit();
  }

  editSubtask(index: number): void {
    this.subtasks.at(index).patchValue({ editing: true });
    setTimeout(() => {
      const inputsArray = this.subtaskEditInputs.toArray();
      if (inputsArray[index]) {
        inputsArray[index].nativeElement.focus();
      } else {
        console.warn("Eingabefeld nicht gefunden.");
      }
    });
  }

  deleteSubtask(index: number): void {
    this.subtasks.removeAt(index);
    // this.checkSubtaskLimit();
  }

  getSubtaskNameControl(index: number): FormControl {
    return this.subtasks.at(index).get("title") as FormControl;
  }

  saveSubtask(index: number): void {
    const subtask = this.subtasks.at(index);
    subtask.patchValue({ editing: false });
  }

  // checkSubtaskLimit(): void {
  //   this.subTasksMaxReached = this.subtasks.length >= 2;
  // }
}
