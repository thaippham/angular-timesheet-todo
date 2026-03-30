import { UserShiftScheduleService } from './../../data/service/view/user-shift-schedule.service';
import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-add-shift-schedule',
  templateUrl: './add-shift-schedule.component.html',
  styleUrls: ['./add-shift-schedule.component.scss']
})
export class AddShiftScheduleComponent implements OnInit {
  selectedShift: string = '';
  selectedDay: string = '';
  selectedEmployees: any[] = [];

  allEmployees: any[] = [];

  constructor(
    public dialogRef: MatDialogRef<AddShiftScheduleComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private scheduleService: UserShiftScheduleService
  ) { }

  ngOnInit(): void {
    this.scheduleService.getAllEmployees().subscribe({
      next: (users) => {
        this.allEmployees = users.map((u: any) => ({
          id: u._id,
          name: u.name,
          gender: u.gender
        }));

        if (this.data.preSelectedShift && this.data.preSelectedDay) {
          this.selectedShift = this.data.preSelectedShift;
          this.selectedDay = this.data.preSelectedDay;
          this.loadExistingEmployees();
        }
      },
      error: (err) => console.error('Lỗi khi lấy danh sách nhân viên', err)
    });
  }

  loadAllEmployees(): void {
    this.scheduleService.getAllEmployees().subscribe({
      next: (users) => {
        this.allEmployees = users.map((u: any) => ({
          id: u._id,
          name: u.name,
          gender: u.gender
        }));
      },
      error: (err) => console.error('Lỗi khi lấy danh sách nhân viên', err)
    });
  }

  loadExistingEmployees(): void {
    if (this.selectedShift && this.selectedDay) {
      const existingEmps = this.data.scheduleData[this.selectedShift]?.[this.selectedDay] || [];

      this.selectedEmployees = this.allEmployees.filter(allEmp =>
        existingEmps.some((exEmp: any) => (exEmp.id === allEmp.id || exEmp._id === allEmp.id))
      );
    } else {
      this.selectedEmployees = [];
    }
  }

  compareEmployee(emp1: any, emp2: any): boolean {
    return emp1 && emp2 ? emp1.id === emp2.id : emp1 === emp2;
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  onSave(): void {
    if (this.selectedShift && this.selectedDay) {
      const formattedEmployees = this.selectedEmployees.map(emp => ({
        _id: emp.id || emp._id,
        name: emp.name,
        gender: emp.gender
      }));

      this.dialogRef.close({
        shift: this.selectedShift,
        day: this.selectedDay,
        employees: formattedEmployees
      });
    } else {
      alert("Vui lòng chọn đầy đủ Ca và Ngày!");
    }
  }
}