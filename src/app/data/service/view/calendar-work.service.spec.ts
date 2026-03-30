/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { CalendarWorkService } from './calendar-work.service';

describe('Service: CalendarWork', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [CalendarWorkService]
    });
  });

  it('should ...', inject([CalendarWorkService], (service: CalendarWorkService) => {
    expect(service).toBeTruthy();
  }));
});
