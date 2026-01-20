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
    if (!file.name.match(/\.(xls|xlsx)$/)) {
      this.errorMessage = 'Only Excel files (.xls, .xlsx) are allowed';
      return;
    }

    this.selectedFile = file;
    this.loading = true;
    this.successMessage = '';
    this.errorMessage = '';

    const reader = new FileReader();

    // ✅ CORRECT WAY TO READ EXCEL
    reader.onload = (e: any) => {
      try {
        const buffer = new Uint8Array(e.target.result);
        const workbook = XLSX.read(buffer, { type: 'array' });

        const sheetName = workbook.SheetNames[0];
        const sheet = workbook.Sheets[sheetName];

        const jsonData: any[] = XLSX.utils.sheet_to_json(sheet, {
          defval: '',
          raw: true
        });

        console.log('Excel Data:', jsonData); // DEBUG

        this.processTimesheet(jsonData);

      } catch (err) {
        console.error(err);
        this.loading = false;
        this.errorMessage = 'Invalid Excel file';
      }
    };

    // ❗ THIS LINE WAS WRONG BEFORE
    reader.readAsArrayBuffer(file);
  }

  /* DATE FIX */
  excelDateToISO(date: any): string {
    if (typeof date === 'string') return date;

    const jsDate = new Date(
      Math.round((date - 25569) * 86400 * 1000)
    );

    return jsDate.toISOString().split('T')[0];
  }

  /* PROCESS DATA */
  processTimesheet(timesheetData: any[]) {
    if (!timesheetData.length) {
      this.loading = false;
      this.errorMessage = 'Excel file is empty';
      return;
    }

    const uploadDate = this.excelDateToISO(timesheetData[0].date);

    this.api.getReportsByDate(uploadDate).subscribe(oldReports => {

      oldReports.forEach(r => {
        this.api.deleteReportById(r.id).subscribe();
      });

      this.api.getUsers().subscribe(users => {

        const reports = timesheetData
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
          .filter(r => r !== null);

        reports.forEach(report => {
          this.api.addReport(report).subscribe();
        });

        this.loading = false;
        this.successMessage =
          `Timesheet for ${uploadDate} uploaded successfully`;
      });
    });
  }
}
