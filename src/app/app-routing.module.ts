import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ShiftScheduleComponent } from './modules/shift-schedule/shift-schedule.component';
import { EmployeeCalendarComponent } from './modules/employee-calendar/employee-calendar.component';
import { LoginComponent } from './modules/login/login.component';
import { AuthGuard } from './core/guards/auth.guard';
import { NavComponent } from './modules/nav/nav.component';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { AuthInterceptor } from './core/interceptors/auth.interceptor';
import { AppComponent } from './app.component';

const routes: Routes = [
  {
    path: 'login',
    component: LoginComponent
  },

  {
    path: '',
    component: NavComponent,
    canActivate: [AuthGuard],
    children: [
      {
        path: '',
        component: ShiftScheduleComponent
      },
      {
        path: 'employee-calendar',
        component: EmployeeCalendarComponent
      }
    ]
  },

  {
    path: '**',
    redirectTo: 'login'
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true
    }
  ],
  bootstrap: [AppComponent],
  exports: [RouterModule]
})
export class AppRoutingModule { }
