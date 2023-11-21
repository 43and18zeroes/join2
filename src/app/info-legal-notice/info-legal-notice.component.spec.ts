import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InfoLegalNoticeComponent } from './info-legal-notice.component';

describe('InfoLegalNoticeComponent', () => {
  let component: InfoLegalNoticeComponent;
  let fixture: ComponentFixture<InfoLegalNoticeComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [InfoLegalNoticeComponent]
    });
    fixture = TestBed.createComponent(InfoLegalNoticeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
