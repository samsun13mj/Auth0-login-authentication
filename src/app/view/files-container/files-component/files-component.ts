import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import * as XLSX from 'xlsx';
import { ApiService } from '../../../service/api-container/api-service';

@Component({
  standalone: true,
  selector: 'app-files',
  imports: [CommonModule, FormsModule],
  templateUrl: './files-component.html',
  styleUrls: ['./files-component.scss']
})
export class FilesComponent implements OnInit {

  selectedFile: File | null = null;
  loading = false;
  successMessage = '';
  errorMessage = '';
  isDragging = false;

  previewData: any[] = [];
  rawRows: any[] = [];
  totalEmployees = 0;
  totalHours = 0;
  totalProjects = 0;
  recentUploads: any[] = [];

  uploadConfirmed = false;

  constructor(private api: ApiService) {}

  // ✅ RESTORE DATA WHEN PAGE LOADS
  ngOnInit() {
    const saved = sessionStorage.getItem('timesheetState');
    if (saved) {
      const data = JSON.parse(saved);

      this.previewData = data.previewData || [];
      this.rawRows = data.rawRows || [];
      this.totalEmployees = data.totalEmployees || 0;
      this.totalHours = data.totalHours || 0;
      this.totalProjects = data.totalProjects || 0;
      this.successMessage = data.successMessage || '';
      this.uploadConfirmed = data.uploadConfirmed || false;
    }
  }

  // ✅ SAVE STATE
  saveState() {
    sessionStorage.setItem(
      'timesheetState',
      JSON.stringify({
        previewData: this.previewData,
        rawRows: this.rawRows,
        totalEmployees: this.totalEmployees,
        totalHours: this.totalHours,
        totalProjects: this.totalProjects,
        successMessage: this.successMessage,
        uploadConfirmed: this.uploadConfirmed
      })
    );
  }

  onFileUpload(event: any) {
    const file = event.target.files[0];
    if (file) this.handleFile(file);
  }

  onDragOver(event: DragEvent) {
    event.preventDefault();
    if (!this.loading) this.isDragging = true;
  }

  onDragLeave() {
    this.isDragging = false;
  }

  onDrop(event: DragEvent) {
    event.preventDefault();
    this.isDragging = false;

    if (this.loading) return;

    const file = event.dataTransfer?.files[0];
    if (file) this.handleFile(file);
  }

  handleFile(file: File) {

    this.errorMessage = '';
    this.successMessage = '';
    this.uploadConfirmed = false;

    if (!file.name.match(/\.(xls|xlsx)$/)) {
      this.errorMessage = 'Only Excel files (.xls, .xlsx) are allowed';
      return;
    }

    this.selectedFile = file;

    const reader = new FileReader();

    reader.onload = (e: any) => {
      try {
        const buffer = new Uint8Array(e.target.result);
        const workbook = XLSX.read(buffer, { type: 'array' });

        const sheetName = workbook.SheetNames[0];
        const sheet = workbook.Sheets[sheetName];

        const jsonData: any[] = XLSX.utils.sheet_to_json(sheet, {
          header: ['employeeId', 'date', 'hoursWorked', 'project'],
          defval: '',
          raw: true
        });

        const cleanedData = jsonData.filter(r => r.employeeId && r.date);
        const filteredData = cleanedData.filter(
         r => r.employeeId !== 'employeeId'
       );

        this.rawRows = filteredData;
        this.previewData = filteredData; // show all rows


        if (!cleanedData.length) throw new Error();

        this.rawRows = cleanedData;
        this.previewData = cleanedData; // show all rows

        this.totalEmployees = new Set(cleanedData.map(r => r.employeeId)).size;
        this.totalHours = cleanedData.reduce((sum, r) => sum + Number(r.hoursWorked), 0);
        this.totalProjects = new Set(cleanedData.map(r => r.project)).size;

        //  SAVE STATE
        this.saveState();

      } catch {
        this.errorMessage = 'Invalid Excel file structure';
      }
    };

    reader.readAsArrayBuffer(file);
  }

  excelDateToISO(value: any): string {
    if (typeof value === 'string') return value;

    const jsDate = new Date(
      Math.round((value - 25569) * 86400 * 1000)
    );

    return jsDate.toISOString().split('T')[0];
  }

  confirmUpload() {
    if (!this.rawRows.length || this.uploadConfirmed) return;

    this.loading = true;
    this.uploadConfirmed = true;

    this.processTimesheet(this.rawRows);
  }

  cancelUpload() {
    this.resetPage();
  }

  clearPage() {
    this.resetPage();
  }

  resetPage() {
    this.selectedFile = null;
    this.previewData = [];
    this.rawRows = [];
    this.totalEmployees = 0;
    this.totalHours = 0;
    this.totalProjects = 0;
    this.errorMessage = '';
    this.successMessage = '';
    this.loading = false;
    this.uploadConfirmed = false;

    // ✅ CLEAR SESSION STORAGE
    sessionStorage.removeItem('timesheetState');
  }

  processTimesheet(rows: any[]) {

    const uploadDate = this.excelDateToISO(rows[0].date);

    this.api.getReportsByDate(uploadDate).subscribe(oldReports => {

      oldReports.forEach(r => {
        this.api.deleteReportById(r.id).subscribe();
      });

      this.api.getUsers().subscribe(users => {

        const reports = rows
          .map(row => {
            const user = users.find(
              u => String(u.id) === String(row.employeeId)
            );

            if (!user) return null;

            return {
              employeeId: String(row.employeeId),
              employeeName: user.name,
              date: this.excelDateToISO(row.date),
              hoursWorked: Number(row.hoursWorked),
              project: row.project
            };
          })
          .filter(Boolean);

        reports.forEach(r => {
          this.api.addReport(r).subscribe();
        });

        this.loading = false;
        this.successMessage = `Timesheet for ${uploadDate} uploaded successfully`;

        // ✅ SAVE STATE AFTER UPLOAD
        this.saveState();
      });
    });
  }
}
