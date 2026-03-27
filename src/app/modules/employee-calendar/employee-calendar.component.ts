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

  ngAfterViewInit(): void {
    this.adjustCalendarView(window.innerWidth);
  }
  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    this.adjustCalendarView(event.target.innerWidth);
  }

  adjustCalendarView(width: number) {
    if (!this.calendarComponent) return;
    
    const calendarApi = this.calendarComponent.getApi();
    
    if (width < 768) {
      calendarApi.changeView('timeGridDay');
    } else {
      calendarApi.changeView('timeGridWeek');
    }
  }

  selectedEmployeeId: number | 'all' = 'all';

  employees = [
    { id: 1, name: 'Nguyễn Văn A' },
    { id: 2, name: 'Trần Thị B' },
    { id: 3, name: 'Lê Văn C' }
  ];

  allShifts = [
    { 
      id: '1', employeeId: 1, title: 'Nguyễn Văn A', 
      start: '2026-03-20T08:00:00', end: '2026-03-20T12:00:00',
      gender: 'male' 
    },
    { 
      id: '2', employeeId: 2, title: 'Trần Thị B', 
      start: '2026-03-20T09:00:00', end: '2026-03-20T13:00:00',
      gender: 'female' 
    },
    { 
      id: '4', employeeId: 3, title: 'Lê Văn C', 
      start: '2026-03-20T08:00:00', end: '2026-03-20T12:00:00',
      gender: 'male' 
    },
    { 
      id: '2', employeeId: 2, title: 'Trần Thị B', 
      start: '2026-03-20T13:00:00', end: '2026-03-20T17:00:00',
      gender: 'female' 
    },
    { 
      id: '3', employeeId: 1, title: 'Nguyễn Văn A', 
      start: '2026-03-21T08:00:00', end: '2026-03-21T12:00:00',
      gender: 'male'
    },
    { 
      id: '4', employeeId: 3, title: 'Lê Văn C', 
      start: '2026-03-22T18:00:00', end: '2026-03-22T22:00:00',
      gender: 'male' 
    }
  ];

  calendarOptions: CalendarOptions = {
    initialView: 'timeGridWeek',
    headerToolbar: {
      left: 'prev,next today',
      center: 'title',
      right: 'dayGridMonth,timeGridWeek,timeGridDay'
    },
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
        if (emp.gender === 'male') textColor = '#2d5a9e';
        if (emp.gender === 'female') textColor = '#8d3363';

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
    this.filterEvents();
  }

  onEmployeeChange(): void {
    this.filterEvents();
  }

  filterEvents(): void {
    let filteredShifts = this.selectedEmployeeId === 'all'
      ? this.allShifts
      : this.allShifts.filter(shift => shift.employeeId === this.selectedEmployeeId);

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
        name: shift.title,
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