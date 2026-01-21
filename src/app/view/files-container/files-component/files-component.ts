import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import * as XLSX from 'xlsx';
import { ApiService } from '../../../service/api-service';

@Component({
  standalone: true,
  selector: 'app-files',
  imports: [CommonModule, FormsModule],
  templateUrl: './files-component.html',
  styleUrls: ['./files-component.scss']
})
export class FilesComponent {

  selectedFile: File | null = null;
  loading = false;
  successMessage = '';
  errorMessage = '';
  isDragging = false;

  constructor(private api: ApiService) {}

  /* FILE INPUT */
  onFileUpload(event: any) {
    const file = event.target.files[0];
    if (file) this.handleFile(file);
  }

  /* DRAG & DROP */
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

  /* HANDLE FILE */
  handleFile(file: File) {

    this.loading = false;
    this.errorMessage = '';
    this.successMessage = '';

    if (!file.name.match(/\.(xls|xlsx)$/)) {
      this.errorMessage = 'Only Excel files (.xls, .xlsx) are allowed';
      return;
    }

    this.selectedFile = file;
    this.loading = true;

    const reader = new FileReader();

    reader.onload = (e: any) => {
      try {
        const buffer = new Uint8Array(e.target.result);
        const workbook = XLSX.read(buffer, { type: 'array' });

        const sheetName = workbook.SheetNames[0];
        const sheet = workbook.Sheets[sheetName];

        /* 🔥 FIX: Explicit headers */
        const jsonData: any[] = XLSX.utils.sheet_to_json(sheet, {
          header: ['employeeId', 'date', 'hoursWorked', 'project'],
          defval: '',
          raw: true
        });

        /* remove empty rows */
        const cleanedData = jsonData.filter(
          r => r.employeeId && r.date
        );

        if (!cleanedData.length) {
          throw new Error('Empty or invalid Excel structure');
        }

        this.processTimesheet(cleanedData);

      } catch (err) {
        console.error(err);
        this.loading = false;
        this.errorMessage = 'Invalid Excel file structure';
      }
    };

    reader.readAsArrayBuffer(file);
  }

  /* DATE FIX */
  excelDateToISO(value: any): string {
    if (typeof value === 'string') return value;

    const jsDate = new Date(
      Math.round((value - 25569) * 86400 * 1000)
    );

    return jsDate.toISOString().split('T')[0];
  }

  /* PROCESS DATA */
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
        this.successMessage =
          `Timesheet for ${uploadDate} uploaded successfully`;
      });
    });
  }
}
