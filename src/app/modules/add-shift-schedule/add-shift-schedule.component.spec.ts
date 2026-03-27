import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddShiftScheduleComponent } from './add-shift-schedule.component';

describe('AddShiftScheduleComponent', () => {
  let component: AddShiftScheduleComponent;
  let fixture: ComponentFixture<AddShiftScheduleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddShiftScheduleComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddShiftScheduleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
