import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InfoHelpComponent } from './info-help.component';

describe('InfoHelpComponent', () => {
  let component: InfoHelpComponent;
  let fixture: ComponentFixture<InfoHelpComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [InfoHelpComponent]
    });
    fixture = TestBed.createComponent(InfoHelpComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
