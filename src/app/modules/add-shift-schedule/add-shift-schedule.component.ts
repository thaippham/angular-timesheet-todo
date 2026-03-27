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

  allEmployees = [
    { id: 1, name: 'Nguyễn Văn A', gender: 'nam' }, 
    { id: 2, name: 'Trần Thị B', gender: 'nữ' },
    { id: 3, name: 'Lê Văn C', gender: 'nam' },
    { id: 4, name: 'Phạm Thị D', gender: 'nữ' },
    { id: 10, name: 'Lý Tiểu Long', gender: 'nam' },
    { id: 11, name: 'Lưu Diệc Phi', gender: 'nữ' }
  ];

  constructor(
    public dialogRef: MatDialogRef<AddShiftScheduleComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  ngOnInit(): void {
    if (this.data.preSelectedShift && this.data.preSelectedDay) {
      this.selectedShift = this.data.preSelectedShift;
      this.selectedDay = this.data.preSelectedDay;
      
      this.loadExistingEmployees();
    }
  }

  loadExistingEmployees(): void {
    if (this.selectedShift && this.selectedDay) {
      const existingEmps = this.data.scheduleData[this.selectedShift]?.[this.selectedDay] || [];
      
      this.selectedEmployees = [...existingEmps];
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
      this.dialogRef.close({
        shift: this.selectedShift,
        day: this.selectedDay,
        employees: this.selectedEmployees
      });
    } else {
      alert("Vui lòng chọn đầy đủ Ca và Ngày!");
    }
  }
}