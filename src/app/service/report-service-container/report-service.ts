import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Analytics {
  id: number;
  taskId: number;
  title: string;
  description: string;
  userId: string;
  assignedTo: string;
  status: string;
  createdAt: string;
}

@Injectable({ providedIn: 'root' })
export class AnalyticsService {

  private api = 'http://localhost:3000';

  constructor(private http: HttpClient) {}

  getAnalytics(): Observable<Analytics[]> {
    return this.http.get<Analytics[]>(this.api + '/analytics');
  }

  addAnalytics(data: any) {
    return this.http.post(this.api + '/analytics', data);
  }

  deleteAnalytics(id: number | string) {
    return this.http.delete(this.api + '/analytics/' + id);
  }

  getTasks(): Observable<any[]> {
    return this.http.get<any[]>(this.api + '/tasks');
  }
}
