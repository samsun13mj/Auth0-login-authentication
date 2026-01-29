import { Component, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiService } from '../../../service/api-container/api-service';
import Chart from 'chart.js/auto';

@Component({
  standalone: true,
  selector: 'app-analytics',
  imports: [CommonModule],
  templateUrl: './analytics-component.html',
  styleUrls: ['./analytics-component.scss']
})
export class AnalyticsComponent implements AfterViewInit {

  @ViewChild('chartCanvas')
  chartCanvas!: ElementRef<HTMLCanvasElement>;

  dates: string[] = [];
  selectedDate: string | null = null;
  chart: Chart | null = null;

  constructor(private api: ApiService) {}

  ngAfterViewInit() {
    this.loadDates();
  }

  /* Normalize Excel numeric / string date */
  normalizeDate(date: any): string {
    if (typeof date === 'string') return date;

    const jsDate = new Date(
      Math.round((date - 25569) * 86400 * 1000)
    );

    return jsDate.toISOString().split('T')[0];
  }

  /* Load dates */
  loadDates() {
    this.api.getReports().subscribe(reports => {
      const normalizedDates = reports.map(r =>
        this.normalizeDate(r.date)
      );

      this.dates = [...new Set(normalizedDates)]
        .sort()
        .reverse();
    });
  }

  /* Show chart */
  selectDate(date: string) {
    this.selectedDate = date;

    this.api.getReports().subscribe(reports => {

      const dailyReports = reports.filter(r =>
        this.normalizeDate(r.date) === date
      );

      const grouped: Record<string, number> = {};

      dailyReports.forEach(r => {
        grouped[r.employeeName] =
          (grouped[r.employeeName] || 0) + Number(r.hoursWorked);
      });

      if (this.chart) this.chart.destroy();

      this.chart = new Chart(this.chartCanvas.nativeElement, {
        type: 'bar',
        data: {
          labels: Object.keys(grouped),
          datasets: [{
            label: `Hours Worked on ${date}`,
            data: Object.values(grouped),
            borderRadius: 6
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          scales: {
            y: { beginAtZero: true }
          }
        }
      });
    });
  }

  /* Clear UI only */
  clearChart() {
    this.selectedDate = null;

    if (this.chart) {
      this.chart.destroy();
      this.chart = null;
    }
  }

  /* DELETE DATA FROM DB */
  deleteDateData() {
    if (!this.selectedDate) return;

    const ok = confirm(
      `Delete all timesheet data for ${this.selectedDate}?`
    );
    if (!ok) return;

    this.api.getReports().subscribe(reports => {

      const toDelete = reports.filter(r =>
        this.normalizeDate(r.date) === this.selectedDate
      );

      toDelete.forEach(r => {
        this.api.deleteReportById(r.id).subscribe();
      });

      this.clearChart();
      this.loadDates();
    });
  }
}
