import { Component, OnInit } from '@angular/core';
import { AddShiftScheduleComponent } from '../add-shift-schedule/add-shift-schedule.component';
import { MatDialog } from '@angular/material/dialog';

export interface Employee {
  id: number;
  name: string;
  gender: 'nam' | 'nữ';
}

@Component({
  selector: 'app-shift-schedule',
  templateUrl: './shift-schedule.component.html',
  styleUrls: ['./shift-schedule.component.scss']
})
export class ShiftScheduleComponent implements OnInit {
  currentUserGender: '' | 'nam' | 'nữ' = '';

  days = ['Thứ 2', 'Thứ 3', 'Thứ 4', 'Thứ 5', 'Thứ 6', 'Thứ 7', 'CN'];
  shifts = ['Sáng', 'Trưa', 'Tối'];

  scheduleData: any = {};

  openAddEmployeeDialog(shift?: string, day?: string): void {
    const dialogRef = this.dialog.open(AddShiftScheduleComponent, {
      width: '450px',
      data: { 
        days: this.days, 
        shifts: this.shifts,
        scheduleData: this.scheduleData,
        preSelectedShift: shift, 
        preSelectedDay: day
      }
    });

    dialogRef.afterClosed().subscribe((result: any) => {
      if (result) {
        const { shift, day, employees } = result;

        if (!this.scheduleData[shift]) {
          this.scheduleData[shift] = {};
        }
        
        this.scheduleData[shift][day] = employees;
      }
    });
  }

  constructor(public dialog: MatDialog) { }

  ngOnInit(): void {
  }

  getEmployeesForShift(shift: string, day: string): Employee[] {
    const employees: Employee[] = this.scheduleData[shift]?.[day] || [];

    return employees.filter(emp => emp.gender === this.currentUserGender || this.currentUserGender === '');
  }
}