import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MainContactsComponent } from './main-contacts.component';

describe('MainContactsComponent', () => {
  let component: MainContactsComponent;
  let fixture: ComponentFixture<MainContactsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MainContactsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MainContactsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
