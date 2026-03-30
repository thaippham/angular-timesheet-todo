/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { ShiftScheduleService } from './shift-schedule.service';

describe('Service: ShiftSchedule', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ShiftScheduleService]
    });
  });

  it('should ...', inject([ShiftScheduleService], (service: ShiftScheduleService) => {
    expect(service).toBeTruthy();
  }));
});
