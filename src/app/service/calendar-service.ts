import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface CalendarEvent {
  id: string;
  title: string;
  start: string;
  end?: string;
}

@Injectable({ providedIn: 'root' })
export class CalendarService {

  private events$ = new BehaviorSubject<CalendarEvent[]>([
    {
      id: '1',
      title: 'Project Kickoff',
      start: new Date().toISOString()
    }
  ]);

  getEvents() {
    return this.events$.asObservable();
  }

  addEvent(event: CalendarEvent) {
    const updated = [...this.events$.value, event];
    this.events$.next(updated);
  }

  removeEvent(id: string) {
    this.events$.next(this.events$.value.filter(e => e.id !== id));
  }
}
