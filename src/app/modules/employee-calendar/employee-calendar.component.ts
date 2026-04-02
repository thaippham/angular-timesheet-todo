import { UserShiftScheduleService } from './../../data/service/view/user-shift-schedule.service';
import { CalendarWorkService } from './../../data/service/view/calendar-work.service';
import { JwtTokenService } from './../../data/service/jwtToken/jwtToken.service';
import { Component, HostListener, OnInit, ViewChild } from '@angular/core';
import { CalendarOptions, FullCalendarComponent } from '@fullcalendar/angular';
import viLocale from '@fullcalendar/core/locales/vi';
import { forkJoin } from 'rxjs';
import { TemplateRef } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-employee-calendar',
  templateUrl: './employee-calendar.component.html',
  styleUrls: ['./employee-calendar.component.scss']
})
export class EmployeeCalendarComponent implements OnInit {
  @ViewChild('calendar') calendarComponent!: FullCalendarComponent;
  @ViewChild('infoWorkDialog') infoWorkDialog!: TemplateRef<any>;
  selectedEvent: any = null;

  constructor(
    private jwtToken: JwtTokenService,
    private calendarWorkService: CalendarWorkService,
    private userService: UserShiftScheduleService,
    private dialog: MatDialog
  ) {

  }

  isManager: boolean = false;
  currentUserId: number | string = '';
  currentUserIdTichHop: number | string = '';
  selectedEmployeeId: number | string | 'all' = 'all';
  currentLoadedMonth: number | null = null;
  currentLoadedYear: number | null = null;
  gender: string = '';
  nameUser: string = '';
  fetchedMonths: Set<string> = new Set();
  allShifts: any[] = [];
  employees: any[] = [];
  salaryMopping: number = 20000;
  formattedMopping = this.salaryMopping.toLocaleString('en-US');

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

  calendarOptions: CalendarOptions = {
    initialView: window.innerWidth < 768 ? 'timeGridDay' : 'timeGridWeek',
    headerToolbar: {
      left: 'prev,today,next',
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
    eventClick: (arg) => this.handleEventClick(arg),
    eventContent: (arg) => {
      const employees = arg.event.extendedProps['employees'] as any[];

      let employeesHtml = employees.map(emp => {
        let mopping = '';
        const formattedSalary = emp.salaryDay ? emp.salaryDay.toLocaleString('en-US') : '0';
        let textColor = '#333';
        if (emp.gender.toLowerCase() === 'nam') textColor = '#2d5a9e';
        if (emp.gender.toLowerCase() === 'nữ') textColor = '#8d3363';
        if (emp.isMopping) {
          mopping = `<div style="color: #05460a; font-weight: normal; font-size: 13px;">Lau nhà: ${this.formattedMopping}đ</div>`;
        }

        return `<li class="combined-employee-name" style="color: ${textColor} !important; font-weight: bold; font-size: 15px;">
                  - ${emp.name}
                  <div>
                    <div style="color: #05460a; font-weight: normal; font-size: 13px;">${formattedSalary !== '0' ? `Lương ngày: ${formattedSalary}đ` : ''}</div>
                    ${mopping}
                  </div>
                </li>`;
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
    const tokenTichHop = localStorage.getItem('tokenTichHop');
    if (token) {
      const decodedUser = this.jwtToken.decodeToken(token);
      this.isManager = decodedUser.role?.role === 'manager' || false;
      if(!this.isManager) {
        this.gender = decodedUser.gender;
        this.nameUser = decodedUser.name;
        this.currentUserId = decodedUser._id || decodedUser.id;
      }
    }
    if (tokenTichHop) {
      const decodedUser = this.jwtToken.decodeToken(tokenTichHop);
      this.currentUserIdTichHop = decodedUser._id || decodedUser.id;
    }
    this.loadEmployees();
  }
  loadEmployees(): void {
    this.userService.getAllEmployees().subscribe({
      next: (users) => {
        this.employees = users.map((u: any) => ({
          id: u._id,
          name: u.name,
          gender: u.gender,
          role: u.role
        }));
      },
      error: (err) => {
        console.error('Lỗi khi lấy danh sách nhân viên:', err);
      }
    });
  }
  handleEventClick(clickInfo: any): void {
    const eventObj = clickInfo.event;

    this.selectedEvent = {
      title: eventObj.title,
      start: eventObj.start,
      end: eventObj.end,
      employees: eventObj.extendedProps.employees
    };

    this.dialog.open(this.infoWorkDialog, {
      width: '450px',
      autoFocus: false
    });
  }

  calculateWorkHours(startTime: string, endTime: string): number {
    const [startHour, startMinute] = startTime.split(':').map(Number);
    const [endHour, endMinute] = endTime.split(':').map(Number);

    const startDecimal = startHour + (startMinute / 60);
    const endDecimal = endHour + (endMinute / 60);

    let duration = endDecimal - startDecimal;

    if (duration < 0) {
      duration += 24;
    }

    return Math.round(duration * 100) / 100;
  }

  onEmployeeChange(): void {
    this.filterEvents();
  }
  onDateRangeChange(arg: any): void {
    const startDate = arg.start;
    const endDate = new Date(arg.end.getTime() - 1);

    const startMonth = startDate.getMonth();
    const startYear = startDate.getFullYear();

    const endMonth = endDate.getMonth();
    const endYear = endDate.getFullYear();

    const startKey = `${startMonth}-${startYear}`;
    const endKey = `${endMonth}-${endYear}`;

    const monthsToFetch: any[] = [];

    if (!this.fetchedMonths.has(startKey)) {
      monthsToFetch.push({ month: startMonth, year: startYear, key: startKey });
    }

    if (startKey !== endKey && !this.fetchedMonths.has(endKey)) {
      monthsToFetch.push({ month: endMonth, year: endYear, key: endKey });
    }

    if (monthsToFetch.length > 0) {
      console.log('Tiến hành tải dữ liệu cho:', monthsToFetch.map(m => m.key).join(', '));
      this.loadDataFromApi(monthsToFetch);
    } else {
      this.filterEvents();
    }
  }
  loadDataFromApi(monthsToFetch: any[]): void {
    let userIdToFetch: number | string | undefined = undefined;

    if (!this.isManager) {
      userIdToFetch = this.currentUserIdTichHop;
    }

    const apiRequests = monthsToFetch.map(m =>
      this.calendarWorkService.getSchedulesByRange(m.month, m.year, userIdToFetch)
    );

    forkJoin(apiRequests).subscribe({
      next: (responses: any[]) => {
        let newWorksData: any[] = [];

        responses.forEach((res, index) => {
          const worksData = res?.data?.works || res?.works || res || [];
          newWorksData = [...newWorksData, ...worksData];

          this.fetchedMonths.add(monthsToFetch[index].key);
        });

        const formattedNewShifts = this.formatDataForCalendar(newWorksData);

        this.allShifts = [...this.allShifts, ...formattedNewShifts];

        this.filterEvents();
      },
      error: (err) => console.error("Lỗi khi gọi API chấm công", err)
    });
  }
  formatDataForCalendar(worksData: any[]): any[] {
    let formattedShifts: any[] = [];

    if (!worksData || worksData.length === 0) return formattedShifts;

    worksData.forEach(work => {
      const [day, month, year] = work.date.split('/');
      const dateStr = `${year}-${month}-${day}`;

      const startDateTime = `${dateStr}T${work.startTime}:00`;
      let endDateTime = `${dateStr}T${work.endTime}:00`;

      let parsedSalary = 0;
      if (work.salary) {
        const salaryString = work.salary.toString().split('=')[0]; 
        parsedSalary = Number(salaryString);
      }

      formattedShifts.push({
        id: work.id,
        employeeId: work.accountId,
        isMopping: work.isMopping,
        name: `${this.nameUser}`,
        start: startDateTime,
        end: endDateTime,
        gender: this.gender,
        salaryDay: this.calculateWorkHours(work.startTime, work.endTime) * parsedSalary
      });
    });

    return formattedShifts;
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
        gender: shift.gender,
        isMopping: shift.isMopping,
        salaryDay: shift.salaryDay
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