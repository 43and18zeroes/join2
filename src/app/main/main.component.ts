import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { UserService } from '../services/user-data.service';
import { MainCommunicationService } from '../services/main-communication.service';
import { TaskDataService } from '../services/task-data.service';
import { BackendService } from '../services/backend-service.service';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss']
})
export class MainComponent implements OnInit {

  showGreetingScreenMobile = true;
  currentUserData;
  allUsersData;
  allContactsData;
  allTasksData;
  // items: any[] = [];
  
  @ViewChild('mainSection') mainSection: ElementRef;

  currentlyDisplayed: string = 'summary';
  currentlyClicked: string = 'summary';
  displayMainSection(condition: 'summary' | 'board' | 'addTask' | 'contacts' | 'privacyPolicy' | 'legalNotice') {
    this.currentlyDisplayed = condition;
    this.currentlyClicked = condition;
  }

  constructor(
    private userService: UserService,
    private mainCommService: MainCommunicationService,
    public taskDataService: TaskDataService,
    private backendService: BackendService
  ) {
    this.subscribeBoardObservable();
    this.subscribePrivacyPolicyServiceObservable();
    this.subscribeSummaryServiceObservable();
  }

  ngOnInit(): void {
    this.userService.getUsersDataMain();
    this.backendService.getUsers().subscribe(data => {
      this.allUsersData = data;
    });
    setTimeout(() => {
      this.showGreetingScreenMobile = false;
    }, 2500);
    this.implementAndroidHeight();
  }

  subscribeBoardObservable() {
    this.mainCommService.displayBoardObservable.subscribe((section) => {
      if  (section !== 'default') {
        this.displayMainSection('board');
      }
    });
  }

  subscribePrivacyPolicyServiceObservable() {
    this.mainCommService.displayPrivacyPolicyServiceObservable.subscribe((section) => {
      if  (section !== 'default') {
        this.displayMainSection('privacyPolicy');
      }
    });
  }

  subscribeSummaryServiceObservable() {
    this.mainCommService.displaySummaryServiceObservable.subscribe((section) => {
      if  (section !== 'default') {
        this.displayMainSection('summary');
      }
    });
  }

  implementAndroidHeight() {
    document.addEventListener('DOMContentLoaded', () => {
      const isAndroid = /Android/i.test(navigator.userAgent);
      if (isAndroid) {
        this.mainSection.nativeElement.classList.add('android__height');
      }
    });
  }
}
