import { JwtTokenService } from './../../data/service/jwtToken/jwtToken.service';
import { Component, OnInit } from '@angular/core';
import { AddShiftScheduleComponent } from '../add-shift-schedule/add-shift-schedule.component';
import { MatDialog } from '@angular/material/dialog';
import { ShiftScheduleService } from 'src/app/data/service/view/shift-schedule.service';


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
  isManager = false;

  days = ['Thứ 2', 'Thứ 3', 'Thứ 4', 'Thứ 5', 'Thứ 6', 'Thứ 7', 'CN'];
  shifts = ['Sáng', 'Trưa', 'Tối'];

  scheduleData: any = {};

  constructor(
    public dialog: MatDialog,
    private scheduleService: ShiftScheduleService,
    private jwtToken: JwtTokenService
  ) { }

  ngOnInit(): void {
    const token = localStorage.getItem('token');
    if (token) {
      const decodedUser = this.jwtToken.decodeToken(token);
      this.isManager = decodedUser.role.role === 'manager';
    }

    this.loadData();
  }

  loadData(): void {
    this.scheduleService.getSchedules().subscribe({
      next: (data) => {
        this.scheduleData = data;
      },
      error: (err) => console.error('Lỗi lấy lịch:', err)
    });
  }

  openAddEmployeeDialog(shift?: string, day?: string): void {
    if (!this.isManager) return;

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
        this.scheduleService.addSchedule(result).subscribe({
          next: (response) => {
            console.log('Lưu thành công:', response.message);
            this.loadData();
          },
          error: (err) => {
            console.error('Lỗi khi lưu phân công:', err);
            alert('Không thể lưu phân công, vui lòng thử lại!');
          }
        });
      }
    });
  }

  getEmployeesForShift(shift: string, day: string): Employee[] {
    const employees: Employee[] = this.scheduleData[shift]?.[day] || [];
    return employees.filter(emp => emp.gender?.toLowerCase() === this.currentUserGender?.toLowerCase() || this.currentUserGender === '');
  }
}