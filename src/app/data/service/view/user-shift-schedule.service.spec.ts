/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { UserShiftScheduleService } from './user-shift-schedule.service';

describe('Service: UserShiftSchedule', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [UserShiftScheduleService]
    });
  });

  it('should ...', inject([UserShiftScheduleService], (service: UserShiftScheduleService) => {
    expect(service).toBeTruthy();
  }));
});
