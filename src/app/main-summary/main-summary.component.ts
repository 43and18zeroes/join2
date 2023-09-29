import { Component, ElementRef, OnInit, ViewChild, AfterViewInit, HostListener  } from '@angular/core';
import { MainComponent } from '../main/main.component';
// import { UserService } from '../services/user-data.service';

@Component({
  selector: 'app-main-summary',
  templateUrl: './main-summary.component.html',
  styleUrls: ['./main-summary.component.scss']
})
export class MainSummaryComponent implements OnInit, AfterViewInit {

  showGreetingScreenMobile = true;
  currenUserIsGuest = true;
  currentUserData;
  currentDate = new Date();
  futureDate = new Date(this.currentDate);

  @ViewChild('toDoBoxWidth') toDoBoxWidth: ElementRef;
  @ViewChild('urgentBoxWidth') urgentBoxWidth: ElementRef;

  constructor(public mainComponent: MainComponent) {
    this.futureDate.setDate(this.currentDate.getDate() + 8);
  }

  ngOnInit(): void {
    this.showGreetingScreenMobile = this.mainComponent.showGreetingScreenMobile;
    this.currentUserData = this.mainComponent.currentUserData;
    if (this.currentUserData.userName !== "Gast") {
      this.currenUserIsGuest = false;
    }
  }

  ngAfterViewInit(): void {
    this.matchWidths();
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: Event): void {
    this.matchWidths();
  }

  matchWidths(): void {
    console.log("this.toDoBoxWidth.nativeElement.offsetWidth", this.toDoBoxWidth.nativeElement.offsetWidth);
    if (this.toDoBoxWidth && this.toDoBoxWidth.nativeElement.offsetWidth) {
      this.urgentBoxWidth.nativeElement.style.width = `${this.toDoBoxWidth.nativeElement.offsetWidth - 50}px`;
    }
  }

}
