import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FullCalendarModule, FullCalendarComponent } from '@fullcalendar/angular';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import multiMonthPlugin from '@fullcalendar/multimonth';
import { CalendarService, CalendarEvent } from '../../../service/calendar-container/calendar-service';

@Component({
  selector: 'app-calendar',
  standalone: true,
  imports: [CommonModule, FullCalendarModule],
  templateUrl: './calendar-component.html',
  styleUrls: ['./calendar-component.scss']
})
export class CalendarComponent implements OnInit {

  @ViewChild('calendarRef') calendarRef!: FullCalendarComponent;

  calendarOptions: any;
  events: CalendarEvent[] = [];

  currentYear = new Date().getFullYear();
  years = Array.from({ length: 21 }, (_, i) => this.currentYear - 10 + i);

  constructor(private calendarService: CalendarService) {}

  ngOnInit() {
    this.calendarService.getEvents().subscribe(events => {
      this.events = events;

      this.calendarOptions = {
        plugins: [dayGridPlugin, timeGridPlugin, interactionPlugin, multiMonthPlugin],

        initialView: 'dayGridMonth',

        headerToolbar: {
          left: 'prev,next today',
          center: 'title',
          right: 'multiMonthYear,dayGridMonth,timeGridWeek,timeGridDay'
        },

        views: {
          multiMonthYear: {
            type: 'multiMonth',
            duration: { months: 12 },
            buttonText: 'Year'
          }
        },

        selectable: true,
        editable: true,
        nowIndicator: true,
        dayMaxEvents: true,
        height: 'auto',

        events: this.events,

        dateClick: this.onDateClick.bind(this),
      };

      setTimeout(() => {
        this.calendarRef?.getApi().render();
      });
    });
  }

  onDateClick(info: any) {
    const title = prompt('Enter event title');
    if (title) {
      this.calendarService.addEvent({
        id: Date.now().toString(),
        title,
        start: info.dateStr
      });
    }
  }

  changeYear(event: any) {
    const year = event.target.value;
    const calendarApi = this.calendarRef?.getApi();
    if (calendarApi) {
      calendarApi.gotoDate(year + '-01-01');
    }
  }
}
