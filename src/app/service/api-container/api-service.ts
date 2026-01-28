import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  private baseUrl = 'http://localhost:3000';

  constructor(private http: HttpClient) {}

  /* USERS */
  getUsers() {
    return this.http.get<any[]>(this.baseUrl + '/users');
  }

  /* REPORTS */
  getReports() {
    return this.http.get<any[]>(this.baseUrl + '/reports');
  }

  addReport(data: any) {
    return this.http.post(this.baseUrl + '/reports', data);
  }

  getReportsByDate(date: string) {
    return this.http.get<any[]>(this.baseUrl + '/reports?date=' + date);
  }

  /*  FIXED: id is STRING */
  deleteReportById(id: string) {
    return this.http.delete(this.baseUrl + '/reports/' + id);
  }
}