import { UserShiftScheduleService } from './../../data/service/view/user-shift-schedule.service';
import { CalendarWorkService } from './../../data/service/view/calendar-work.service';
import { JwtTokenService } from './../../data/service/jwtToken/jwtToken.service';
import { Component, HostListener, OnInit, ViewChild } from '@angular/core';
import { CalendarOptions, FullCalendarComponent } from '@fullcalendar/angular';
import viLocale from '@fullcalendar/core/locales/vi';

@Component({
  selector: 'app-employee-calendar',
  templateUrl: './employee-calendar.component.html',
  styleUrls: ['./employee-calendar.component.scss']
})
export class EmployeeCalendarComponent implements OnInit {
  @ViewChild('calendar') calendarComponent!: FullCalendarComponent;

  constructor(
    private jwtToken: JwtTokenService,
    private calendarWorkService: CalendarWorkService,
    private userService: UserShiftScheduleService
  ){

  }

  isManager: boolean = false;
  currentUserId: number | string = ''; 
  selectedEmployeeId: number | string | 'all' = 'all';

  ngAfterViewInit(): void {
  }
  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    this.adjustCalendarView(event.target.innerWidth);
  }

  adjustCalendarView(width: number) {
    if (!this.calendarComponent) return;
    
    const calendarApi = this.calendarComponent.getApi();
    const currentView = calendarApi.view.type;
    const targetView = width < 768 ? 'timeGridDay' : 'timeGridWeek';
    
    if (currentView !== targetView) {
      calendarApi.changeView(targetView);
    }
  }

  allShifts: any[] = [];
  employees: any[] = [];

  calendarOptions: CalendarOptions = {
    initialView: window.innerWidth < 768 ? 'timeGridDay' : 'timeGridWeek',
    headerToolbar: {
      left: 'prev,next today',
      center: 'title',
      right: 'dayGridMonth,timeGridWeek,timeGridDay'
    },
    datesSet: (arg) => this.onDateRangeChange(arg),
    slotMinTime: '06:00:00',
    slotMaxTime: '23:00:00',
    allDaySlot: false,
    events: [],
    height: 'auto',
    locale: viLocale,
    slotLabelFormat: {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false
    },
    
    eventTimeFormat: {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false
    },
    
    firstDay: 1,
    slotEventOverlap: false,
    eventDisplay: 'block',
    eventMinHeight: 30,
    eventOrder: "title",
    displayEventEnd: true,
    eventContent: (arg) => {
      const employees = arg.event.extendedProps['employees'] as any[];
      
      let employeesHtml = employees.map(emp => {
        let textColor = '#333'; 
        if (emp.gender === 'nam') textColor = '#2d5a9e';
        if (emp.gender === 'nữ') textColor = '#8d3363';

        return `<li class="combined-employee-name" style="color: ${textColor} !important; font-weight: 600;">- ${emp.name}</li>`;
      }).join('');
      
      return {
        html: `
          <div class="custom-combined-event">
            <div class="event-time" style="color: #05460a;">${arg.timeText}</div>
            <ul class="combined-employee-list">
              ${employeesHtml}
            </ul>
          </div>
        `
      };
    }
  };

  ngOnInit(): void {
    const token = localStorage.getItem('token');
    if (token) {
      const decodedUser = this.jwtToken.decodeToken(token);
      this.isManager = decodedUser.role === 'manager';
      this.currentUserId = decodedUser._id || decodedUser.id;

      if (!this.isManager) {
        this.selectedEmployeeId = this.currentUserId;
      } else {
        this.loadEmployees();
      }
    }
  }
  loadEmployees(): void {
    this.userService.getAllEmployees().subscribe({
      next: (users) => {
        this.employees = users.map((u: any) => ({
          id: u._id,
          name: u.name,
          gender: u.gender
        }));
      },
      error: (err) => {
        console.error('Lỗi khi lấy danh sách nhân viên:', err);
      }
    });
  }

  onEmployeeChange(): void {
    this.filterEvents();
  }
  onDateRangeChange(arg: any): void {
    const startDate = arg.start;
    const endDate = new Date(arg.end.getTime() - 86400000);

    const fromDate = this.formatDate(startDate);
    const toDate = this.formatDate(endDate);

    console.log(`Đang tải dữ liệu từ ${fromDate} đến ${toDate}`);

    this.loadDataFromApi(fromDate, toDate);
  }
  loadDataFromApi(fromDate: string, toDate: string): void {
    let userIdToFetch = undefined;

    if (!this.isManager) {
      userIdToFetch = this.currentUserId;
    }

    this.calendarWorkService.getSchedulesByRange(fromDate, toDate, userIdToFetch)
    .subscribe({
      next: (data) => {
        this.allShifts = data; 
        
        this.filterEvents(); 
      },
      error: (err) => console.error("Lỗi khi gọi API chấm công", err)
    });
  }
  formatDataForCalendar(serverData: any[]): any[] {
    let formattedShifts: any[] = [];
    
    serverData.forEach(schedule => {
      
      if (schedule.employees && schedule.employees.length > 0) {
        schedule.employees.forEach((emp: any) => {
          
          let startTime = '08:00:00';
          let endTime = '12:00:00';
          if (schedule.shift === 'Trưa') { startTime = '13:00:00'; endTime = '17:00:00'; }
          if (schedule.shift === 'Tối') { startTime = '18:00:00'; endTime = '22:00:00'; }

          const dateStr = new Date(schedule.workDate).toISOString().split('T')[0];

          formattedShifts.push({
            id: schedule._id,
            employeeId: emp._id || emp.id, 
            title: emp.name, 
            start: `${dateStr}T${startTime}`,
            end: `${dateStr}T${endTime}`,
            gender: emp.gender || 'male'
          });
        });
      }
    });

    return formattedShifts;
  }
  formatDate(date: Date): string {
    const d = new Date(date);
    let month = '' + (d.getMonth() + 1);
    let day = '' + d.getDate();
    const year = d.getFullYear();

    if (month.length < 2) month = '0' + month;
    if (day.length < 2) day = '0' + day;

    return [year, month, day].join('-');
  }

  filterEvents(): void {
    let filteredShifts = this.selectedEmployeeId === 'all'
      ? this.allShifts
      : this.allShifts.filter(shift => shift.employeeId == this.selectedEmployeeId);

    const groups = new Map();

    for (const shift of filteredShifts) {
      const key = `${shift.start}_${shift.end}`;

      if (!groups.has(key)) {
        groups.set(key, {
          start: shift.start,
          end: shift.end,
          employees: [],
          backgroundColor: 'hsl(151, 74%, 88%)',
          borderColor: 'rgb(53, 211, 129)',     
        });
      }
      
      groups.get(key).employees.push({
        name: shift.title || shift.name,
        gender: shift.gender
      });
    }

    const finalEvents = Array.from(groups.values()).map((group, index) => {
      const titleText = group.employees.length === 1 
        ? group.employees[0].name 
        : `Ca gom nhóm (${group.employees.length} người)`;
      
      return {
        id: `combined_${index}`,
        title: titleText,
        start: group.start,
        end: group.end,
        backgroundColor: group.backgroundColor,
        borderColor: group.borderColor,
        extendedProps: {
          employees: group.employees
        }
      };
    });

    this.calendarOptions = {
      ...this.calendarOptions,
      events: finalEvents
    };
  }
}