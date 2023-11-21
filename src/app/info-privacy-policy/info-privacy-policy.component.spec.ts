import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InfoPrivacyPolicyComponent } from './info-privacy-policy.component';

describe('InfoPrivacyPolicyComponent', () => {
  let component: InfoPrivacyPolicyComponent;
  let fixture: ComponentFixture<InfoPrivacyPolicyComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [InfoPrivacyPolicyComponent]
    });
    fixture = TestBed.createComponent(InfoPrivacyPolicyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
