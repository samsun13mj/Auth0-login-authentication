import { Component, ViewChild, AfterViewInit, OnInit } from '@angular/core';
import { CommonModule, NgIf } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { MatCardModule } from '@angular/material/card';
import { UserService } from '../../../service/user-service';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { Router, RouterModule } from '@angular/router';

import { AddUserDialogComponent } from '../.././add-user-dialog/add-user-dialog';

@Component({
  selector: 'app-dashboard-component',
  templateUrl: './dashboard-component.html',
  styleUrls: ['./dashboard-component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatPaginatorModule,
    MatCardModule,
    MatProgressSpinnerModule,
    MatButtonModule,
    MatDialogModule,
    MatIconModule,
    MatMenuModule,
    RouterModule,
    NgIf
  ]
})
export class DashboardComponent implements OnInit, AfterViewInit {

  displayedColumns: string[] = ['id', 'name', 'email', 'role', 'actions'];
  dataSource = new MatTableDataSource<any>([]);
  loading = false;  
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(
    private userService: UserService, 
    private dialog: MatDialog,
    private router: Router
  ) {}

  ngOnInit() {
    this.loadUsers();
  }

  loadUsers() {
    this.loading = true; 
    this.userService.getUsers().subscribe({
      next: (users) => {
        this.dataSource.data = users.map(u => ({
          id: u.id,
          name: u.name,
          email: u.email,
          role: u.role
        }));
        this.loading = false; 
      },
      error: (err) => {
        console.error('Error fetching users:', err);
        this.loading = false; 
      }
    });
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  openAddUserDialog() {
    const dialogRef = this.dialog.open(AddUserDialogComponent);
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.userService.addUser(result).subscribe({
          next: (newUser) => {
            this.dataSource.data = [...this.dataSource.data, newUser];
          },
          error: (err) => {
            console.error('Error adding user:', err);
          }
        });
      }
    });
  }

  deleteUser(user: any) {
    console.log("Deleting user:", user);
    this.userService.deleteUser(user.id).subscribe({
      next: () => {
        this.dataSource.data = this.dataSource.data.filter(u => u.id !== user.id);
        this.dataSource._updateChangeSubscription();
      },
      error: (err) => {
        console.error('Error deleting user:', err);
      }
    });
  }

  openUserDetails(user: any) {
    this.router.navigate(['/user-details', user.id]);
  }
}
