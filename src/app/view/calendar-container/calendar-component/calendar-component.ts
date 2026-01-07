import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FullCalendarModule } from '@fullcalendar/angular';

import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';

import { CalendarService, CalendarEvent } from '../../../service/calendar-service';

@Component({
  selector: 'app-calendar',
  standalone: true,
  imports: [CommonModule, FullCalendarModule],
  templateUrl: './calendar-component.html',
  styleUrls: ['./calendar-component.scss']
})
export class CalendarComponent implements OnInit {

  calendarOptions: any;
  events: CalendarEvent[] = [];

  constructor(private calendarService: CalendarService) {}

  ngOnInit() {
    this.calendarService.getEvents().subscribe(events => {
      this.events = events;
      this.calendarOptions = {
        plugins: [dayGridPlugin, timeGridPlugin, interactionPlugin],
        initialView: 'dayGridMonth',
        headerToolbar: {
          left: 'prev,next today',
          center: 'title',
          right: 'dayGridMonth,timeGridWeek,timeGridDay'
        },
        selectable: true,
        events: this.events,
        dateClick: this.onDateClick.bind(this)
      };
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
}
