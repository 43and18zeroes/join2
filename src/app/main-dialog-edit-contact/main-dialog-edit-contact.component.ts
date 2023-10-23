import { Component, ElementRef, ViewChild } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Contact } from 'src/models/contact.class';
import { emailValidator, signUpUserNameValidator, phoneValidator } from '../shared/validators/custom-validators';
import { UserService } from '../services/user-data.service';

@Component({
  selector: 'app-main-dialog-edit-contact',
  templateUrl: './main-dialog-edit-contact.component.html',
  styleUrls: ['./main-dialog-edit-contact.component.scss']
})
export class MainDialogEditContactComponent {

  contact = new Contact();
  editContactForm = this.fb.group({
    contactName: ['', [Validators.required, signUpUserNameValidator]],
    contactEmailAddress: [{value: '', disabled: true}],
    contactPhoneNumber: ['']
  });

  private colors: string[] = [
    '#003366', '#004080', '#00509E', '#0055A4', '#005FB3', '#006633',
    '#007040', '#007B4F', '#008060', '#008755', '#8B0000', '#9B111E',
    '#A31220', '#A92328', '#B22222', '#800080', '#872657', '#8B008B',
    '#93218E', '#992E92', '#00CED1', '#20B2AA', '#40E0D0', '#48D1CC',
    '#5F9EA0', '#FF4500', '#FF6347', '#FF7F50', '#FF8C00', '#993333',
    '#996633', '#996600', '#CC9900', '#C7A317', '#003B6F', '#00428A',
    '#004DA1', '#0052B1', '#005BC3', '#006F42', '#007A58', '#008269',
    '#008C7A', '#009688', '#9B1B1E', '#A51821', '#AF1F27', '#B92B2E',
    '#C33A3A', '#872272', '#8E2D80', '#952D8A', '#9C3193', '#A43B9D',
    '#10D3D1', '#30DAC2', '#40DFB3', '#58E5A0', '#66EB90', '#FF5010',
    '#FF6C38', '#FF8245', '#FF9955', '#882211', '#884411', '#886611',
    '#D9C742', '#DAC952', '#004380', '#004B95', '#0055A5', '#0060B5',
    '#006CC8', '#007850', '#008365', '#009079', '#009D90', '#00B0A2',
    '#A52229', '#B02E31', '#BC3C3C', '#C84848', '#D35959', '#903290',
    '#97389A', '#A140A5', '#A946AF', '#B250BA', '#50E8B0', '#64EC9F',
    '#78EF8F', '#8CF280', '#A0F672', '#884400', '#886600', '#FFBF50',
    '#FFCA68', '#773311'
  ];

  contactNameValid: boolean = true;
  contactEmailAddressValid: boolean = true;
  contactPhoneNumberValid: boolean = true;
  editUserFormSubmitted: boolean = false;
  @ViewChild('newUserSubmitBtn') newUserSubmitBtn: ElementRef;

  constructor(
    public dialog: MatDialog,
    private fb: FormBuilder,
    private firestore: AngularFirestore,
    private userService: UserService
  ) { }

  ngOnInit(): void {
    console.log("contact", this.contact)
    // this.contact.contactName = this.contact.userEmailAddress;
  }

  closeDialog() {
    this.dialog.closeAll();
  }

  onSubmit() {
    this.checkSingleInputs();
    if (this.editContactForm.valid) {
      this.editUserFormSubmitted = true;
      this.getContactData();
      console.log(this.contact)
      if (this.contact.type === "userFromContacts") {
        console.log("data to contacts collection");
        this.userService.updateToContactsData(this.contact);
      } else if (this.contact.type === "userSignUp") {
        console.log("data to users collection");
        this.userService.updateToUsersData(this.contact);
      } else {
        console.log("incorrect contact.type")
      }
      this.userService.generateUsersAndContactsLists();
      this.addNewUserOutro();
    }
  }

  checkSingleInputs() {
    if (!this.contact.contactName) this.contactNameValid = false;
    else this.contactNameValid = true;
    // if (!this.contact.contactPhoneNumber) this.contactPhoneNumberValid = false;
    // else this.contactPhoneNumberValid = true;
  }

  getContactData() {
    this.contact.contactFirstName = this.contact.contactName.split(' ')[0];
    this.contact.contactSurName = this.contact.contactName.split(' ')[1];
    this.contact.contactInitials = this.contact.contactFirstName.charAt(0).toUpperCase() + this.contact.contactSurName.charAt(0).toUpperCase();
    this.contact.contactColor = this.generateColorFromInitials(this.contact.contactInitials);
    if(this.contact.contactPhoneNumber) {
      this.contact.contactPhoneNumber = this.contact.contactPhoneNumber.replace(/\s/g, '');
    } else {
      this.contact.contactPhoneNumber = '';
    }
  }

  private generateColorFromInitials(initials: string): string {
    const colorIndex = this.calculateColorIndex(initials);
    return this.colors[colorIndex];
  }

  private calculateColorIndex(initials: string): number {
    const charCodes = initials.split('').map(char => char.charCodeAt(0));
    const sum = charCodes.reduce((acc, curr) => acc + curr, 0);
    return sum % this.colors.length;
  }

  addNewUserOutro() {
    this.newUserSubmitBtn.nativeElement.classList.add("btn__success");
    setTimeout(() => {
      this.dialog.closeAll();
    }, 1500);
  }
}
