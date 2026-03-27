import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ShiftScheduleComponent } from './modules/shift-schedule/shift-schedule.component';
import { EmployeeCalendarComponent } from './modules/employee-calendar/employee-calendar.component';

const routes: Routes = [
  {
    path: '',
    component: ShiftScheduleComponent,
  },
  {
    path: 'employee-calendar',
    component: EmployeeCalendarComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
