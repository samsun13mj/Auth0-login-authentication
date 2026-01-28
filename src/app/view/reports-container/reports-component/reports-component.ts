import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { AnalyticsService, Analytics } from '../../../service/report-service-container/report-service';

@Component({
  selector: 'app-reports',
  standalone: true,
  imports: [CommonModule, MatIconModule],
  templateUrl: './reports-component.html',
  styleUrls: ['./reports-component.scss']
})
export class ReportsComponent implements OnInit {

  reports: Analytics[] = [];
  totalReports = 0;
  totalTasks = 0;
  completedTasks = 0;
  pendingTasks = 0;

  constructor(private analyticsService: AnalyticsService) {}

  ngOnInit() {
    this.loadAnalytics();
    this.loadTasks();
  }

  loadAnalytics() {
    this.analyticsService.getAnalytics().subscribe(res => {
      this.reports = res;
      this.totalReports = res.length;
    });
  }

  loadTasks() {
    this.analyticsService.getTasks().subscribe(tasks => {
      this.totalTasks = tasks.length;
      this.completedTasks = tasks.filter(t => t.completed === true).length;
      this.pendingTasks = tasks.filter(t => t.completed === false).length;
    });
  }

  deleteReport(id: number | string) {
    if (!confirm('Are you sure you want to delete this record?')) return;

    this.analyticsService.deleteAnalytics(id).subscribe(() => {
      this.loadAnalytics();
    });
  }
}
