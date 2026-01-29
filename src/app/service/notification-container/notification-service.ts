import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, map, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {

  private api = 'http://localhost:3000/notifications';

  private _notifications = new BehaviorSubject<any[]>([]);
  notifications$ = this._notifications.asObservable();

  unreadCount$ = this.notifications$.pipe(
    map(list => list.filter(n => !n.read).length)
  );

  constructor(private http: HttpClient) {}

  //  LOAD NOTIFICATIONS
  load(userId?: string | number): void {
    const url = userId
      ? `${this.api}?userId=${userId}`
      : this.api;

    this.http.get<any[]>(url).subscribe(res => {
      const sorted = res.sort(
        (a, b) =>
          new Date(b.createdAt).getTime() -
          new Date(a.createdAt).getTime()
      );

      this._notifications.next(sorted);
    });
  }

  //  CREATE NOTIFICATION
  create(notification: any) {
    const payload = {
      id: crypto.randomUUID(), 
      ...notification,
      read: false,
      createdAt: new Date().toISOString()
    };

    return this.http.post<any>(this.api, payload).pipe(
      tap(created => {
        const updated = [created, ...this._notifications.value];
        this._notifications.next(updated);

        //  FORCE RELOAD FROM DB
        this.load();
      })
    );
  }

  markAsRead(id: string) {
    return this.http.patch(`${this.api}/${id}`, { read: true }).pipe(
      tap(() => {
        const updated = this._notifications.value.map(n =>
          n.id === id ? { ...n, read: true } : n
        );
        this._notifications.next(updated);
      })
    );
  }

  delete(id: string) {
    return this.http.delete(`${this.api}/${id}`).pipe(
      tap(() => {
        const updated =
          this._notifications.value.filter(n => n.id !== id);
        this._notifications.next(updated);
      })
    );
  }
}
