import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MainSummaryComponent } from './main-summary.component';

describe('MainSummaryComponent', () => {
  let component: MainSummaryComponent;
  let fixture: ComponentFixture<MainSummaryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MainSummaryComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MainSummaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
