import { Component, ElementRef, QueryList, Renderer2, ViewChild, ViewChildren } from "@angular/core";
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from "@angular/forms";
import { MainCommunicationService } from "../services/main-communication.service";
import { AngularFirestore } from "@angular/fire/compat/firestore";
import { MainDialogAddContactComponent } from "../main-dialog-add-contact/main-dialog-add-contact.component";
import { MatDialog } from "@angular/material/dialog";
import { UserService } from "../services/user-data.service";
import { TaskDataService } from "../services/task-data.service";
import { BackendService } from "../services/drf/backend-service.service";

@Component({
  selector: "app-main-add-task",
  templateUrl: "./main-add-task.component.html",
  styleUrls: ["./main-add-task.component.scss"],
})
export class MainAddTaskComponent {
  @ViewChild("subTaskEditCurrentInput") subTaskEditCurrentInput: ElementRef;
  @ViewChild("submitBtn") submitBtn: ElementRef;
  @ViewChild("assignSelectedOptionRef") assignSelectedOptionRef: ElementRef;
  @ViewChild("assignSelectRef") assignSelectRef: ElementRef;
  @ViewChild("categorySelect") categorySelect: ElementRef;
  @ViewChild("categorySelectRef") categorySelectRef: ElementRef;
  @ViewChild("subTasksInput") subTasksInput: ElementRef;
  @ViewChildren("subtaskEditInput") subtaskEditInputs!: QueryList<ElementRef>;

  allUsersData;
  currentUserData;
  addTaskForm: FormGroup;
  showAssignedDropdown: boolean = false;
  selectedUsers: any[] = [];
  today: string;
  selectedPriority: string;
  showCategoryDropdown: boolean = false;
  subTasksInputEmpty: boolean = true;
  subTasksMaxReached: boolean = false;
  subTasksArray: string[] = [];
  subTaskCurrentlyEditing: string | null = null;
  subTasksInputHasFocus: boolean = false;
  formSubmitted: boolean = false;
  titleValid: boolean = true;
  dateValid: boolean = true;
  categoryValid: boolean = true;

  editing = false;

  private globalClickListener: Function;

  constructor(
    private firestore: AngularFirestore,
    private fb: FormBuilder,
    private mainCommService: MainCommunicationService,
    private renderer: Renderer2,
    public dialog: MatDialog,
    private userService: UserService,
    private backendService: BackendService,
    public taskDataService: TaskDataService
  ) {
    this.initializeTaskForm();
    this.today = this.getTodaysDate();
  }

  private initializeTaskForm(): void {
    this.addTaskForm = this.fb.group({
      title: ["", Validators.required],
      description: [""],
      users: [[]],
      due_date: ["", Validators.required],
      priority: ["low"],
      category: ["", Validators.required],
      // subTasks: [],
      // subTasksCompleted: [],
      status: "todo",
      position: 0,
      // taskColumnOrder: 0

      subtasks: this.fb.array([]),
    });
  }

  ngOnInit(): void {
    this.getUsersData();
    this.currentUserData = this.userService.currentUserData;
    this.initListeners();
  }

  getUsersData() {
    this.backendService.getUsers().subscribe((data) => {
      this.allUsersData = data;
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

  ngOnDestroy() {
    this.allUsersData.forEach((user) => (user.selected = false));
    this.globalClickListener();
  }

  formGroupEnterKey(event: Event): void {
    event.preventDefault();
  }

  assignToggleDropdown() {
    // this.allUsersData = this.userService.allUsersData;
    this.showAssignedDropdown = !this.showAssignedDropdown;
    for (let i = 0; i < this.selectedUsers.length; i++) {
      const selectedUser = this.selectedUsers[i];
      for (let j = 0; j < this.allUsersData.length; j++) {
        const user = this.allUsersData[j];
        if (selectedUser.email === user.email) {
          user.selected = true;
        }
      }
    }
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
    this.addTaskForm.controls["priority"].setValue(priority);
  }

  categoryToggleDropdown() {
    this.showCategoryDropdown = !this.showCategoryDropdown;
  }

  selectCategory(category: string) {
    this.addTaskForm.controls["category"].setValue(category);
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

  // subTaskEdit(subTask: string): void {
  //   this.subTaskCurrentlyEditing = subTask;
  //   setTimeout(() => {
  //     this.subTaskEditCurrentInput.nativeElement.focus();
  //   }, 10);
  // }

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
    this.addTaskForm.controls["subTasks"].setValue(this.subTasksArray);
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
    this.addTaskForm = this.fb.group({
      title: ["", Validators.required],
      description: [""],
      users: [[]],
      due_date: ["", Validators.required],
      priority: ["low"],
      category: ["", Validators.required],
      // subTasks: [],
      // subTasksCompleted: [],
      status: "todo",
      position: 0,
      // taskColumnOrder: 0
    });
  }

  resetFormValidators() {
    this.titleValid = true;
    this.dateValid = true;
    this.categoryValid = true;
  }

  onSubmit(): void {
    this.checkRequiredInputs();
    if (this.addTaskForm.valid) {
      this.formSubmitted = true;
      const trimmedTask = this.trimTask();
      this.addAssignedTo(trimmedTask);
      this.sendNewTaskToBackend(trimmedTask);
      this.onSubmitOutro();
    }
  }

  checkRequiredInputs() {
    if (this.addTaskForm.value.title === "") this.titleValid = false;
    else this.titleValid = true;
    if (this.addTaskForm.value.due_date) this.dateValid = true;
    else this.dateValid = false;
    if (this.addTaskForm.value.category === "") this.categoryValid = false;
    else this.categoryValid = true;
  }

  trimTask() {
    const untrimmedTask = this.addTaskForm.value;
    const trimmedTask = this.addTaskForm.value;
    trimmedTask.title = untrimmedTask.title.trim();
    trimmedTask.description = untrimmedTask.description.trim();
    return trimmedTask;
  }

  addAssignedTo(trimmedTask) {
    // let assignedMailAdresses = [];
    // for (const item of this.selectedUsers) {
    //   if (item.userEmailAddress) {
    //     assignedMailAdresses.push(item.userEmailAddress);
    //   }
    // }
    // trimmedTask.users = assignedMailAdresses;
    const assignedUsers = this.selectedUsers.map((user) => ({
      id: user.id, // Wichtig: 'id' muss vorhanden sein
      first_name: user.first_name,
      last_name: user.last_name,
      email: user.userEmailAddress,
      phone_number: user.phone_number,
      user_color: user.user_color,
      type: user.type,
      initials: user.initials,
    }));

    trimmedTask.users = assignedUsers.length > 0 ? assignedUsers : [];
    return trimmedTask;
  }

  addSubtasksStatuses(trimmedTask) {
    let subTasksCompleted = [];
    for (let index = 0; index < trimmedTask.subTasks.length; index++) {
      subTasksCompleted.push(false);
    }
    trimmedTask.subTasksCompleted = subTasksCompleted;
    return trimmedTask;
  }

  sendNewTaskToBackend(trimmedTask) {
    this.backendService.createItem(trimmedTask, "tasks").subscribe(
      (response) => {
        console.log("Task created successfully:", response);
      },
      (error) => {
        console.error("Error creating task:", error);
      }
    );

    this.clearForm();
  }

  onSubmitOutro() {
    this.submitBtn.nativeElement.classList.add("btn__success");
    setTimeout(() => {
      this.mainCommService.displayMainBoard("board");
    }, 1500);
  }

  get subtasks() {
    return this.addTaskForm.get("subtasks") as FormArray;
  }

  addSubtaskInput(value: string): void {
    const trimmedValue = value.trim();
    if (trimmedValue) {
      this.addSubtask(trimmedValue);
      this.subTasksInput.nativeElement.value = "";
      this.subTasksInputHasFocus = false;
      this.checkSubtaskLimit();
    }
  }

  addSubtask(title: string): void {
    this.subtasks.push(
      this.fb.group({
        title: [title, Validators.required],
        editing: [false],
      })
    );
    this.checkSubtaskLimit();
    console.log("this.addTaskForm", this.addTaskForm);
  }

  removeSubtask(index: number): void {
    this.subtasks.removeAt(index);
    this.checkSubtaskLimit();
  }

  checkSubtaskLimit(): void {
    this.subTasksMaxReached = this.subtasks.length >= 2;
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
    this.checkSubtaskLimit();
  }

  saveSubtask(index: number): void {
    const subtask = this.subtasks.at(index);
    subtask.patchValue({ editing: false });
  }

  getSubtaskNameControl(index: number): FormControl {
    return this.subtasks.at(index).get("title") as FormControl;
  }
}
