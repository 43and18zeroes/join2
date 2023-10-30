import { Component, ElementRef, HostListener, QueryList, ViewChild, ViewChildren } from '@angular/core';

@Component({
  selector: 'app-main-board',
  templateUrl: './main-board.component.html',
  styleUrls: ['./main-board.component.scss']
})
export class MainBoardComponent {

  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    this.checkForHorizontalScroll();
  }

  @ViewChild('mainContainer') mainContainer: ElementRef;
  // @ViewChild('sectionBody') sectionBody: ElementRef;
  @ViewChildren('sectionBody') sectionBodys: QueryList<ElementRef>;

  constructor() { }

  ngOnInit(): void {
  }

  ngAfterViewInit() {
    this.checkForHorizontalScroll();
  }

  private checkForHorizontalScroll() {
    const mainElement: HTMLDivElement = this.mainContainer.nativeElement;

    this.sectionBodys.forEach((sectionBody: ElementRef) => {
      const divElement: HTMLDivElement = sectionBody.nativeElement;
      if (mainElement.scrollWidth > mainElement.clientWidth) {
        divElement.classList.add('has-horizontal-scroll');
        console.log("bar vorhanden")
      }
      else {
        divElement.classList.remove('has-horizontal-scroll');
        console.log("bar nicht vorhanden")
      }
    });
  }
}
