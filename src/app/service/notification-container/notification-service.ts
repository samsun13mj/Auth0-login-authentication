import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, map, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {

  private api = 'http://localhost:3000/notifications';

  /* ========================= */
  /* STATE                     */
  /* ========================= */
  private _notifications = new BehaviorSubject<any[]>([]);
  notifications$ = this._notifications.asObservable();

  /* ========================= */
  /* UNREAD COUNT (TOOLBAR)    */
  /* ========================= */
  unreadCount$ = this.notifications$.pipe(
    map(list => list.filter(n => !n.read).length)
  );

  constructor(private http: HttpClient) {}

  /* ========================= */
  /* LOAD (ON APP START / REFRESH) */
  /* ========================= */
  load(userId?: number): void {
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

  /* ========================= */
  /* CREATE NOTIFICATION       */
  /* ========================= */
  create(notification: any) {
    return this.http.post<any>(this.api, {
      ...notification,
      read: false,
      createdAt: new Date().toISOString()
    }).pipe(
      tap(created => {
        const updated = [created, ...this._notifications.value];
        this._notifications.next(updated);
      })
    );
  }

  /* ========================= */
  /* MARK AS READ              */
  /* ========================= */
  markAsRead(id: number) {
    return this.http.patch(`${this.api}/${id}`, { read: true }).pipe(
      tap(() => {
        const updated = this._notifications.value.map(n =>
          n.id === id ? { ...n, read: true } : n
        );
        this._notifications.next(updated);
      })
    );
  }

  /* ========================= */
  /* DELETE NOTIFICATION       */
  /* ========================= */
  delete(id: number) {
    return this.http.delete(`${this.api}/${id}`).pipe(
      tap(() => {
        const updated =
          this._notifications.value.filter(n => n.id !== id);

        this._notifications.next(updated);
      })
    );
  }
}
