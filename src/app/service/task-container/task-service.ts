import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class TaskService {

  private readonly baseUrl = 'http://localhost:3000';

  constructor(private http: HttpClient) {}

  // USERS
  getUsers(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/users`);
  }

  // TASKS
  getTasks(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/tasks`);
  }

  createTask(task: any): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/tasks`, task);
  }

  updateTask(id: number, body: any): Observable<any> {
    return this.http.patch<any>(`${this.baseUrl}/tasks/${id}`, body);
  }

  deleteTask(id: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/tasks/${id}`);
  }
}
