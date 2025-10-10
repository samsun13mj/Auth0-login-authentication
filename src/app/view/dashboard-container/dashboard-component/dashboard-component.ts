import { Component, ViewChild, AfterViewInit, OnInit } from '@angular/core';
import { CommonModule, NgIf } from '@angular/common';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { RouterModule } from '@angular/router';
import { UserService } from '../../../service/user-service';
import { SidenavService } from '../../../service/sidenav-service';

@Component({
  selector: 'app-dashboard-component',
  standalone: true,
  imports: [
    CommonModule,
    NgIf,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatTableModule,
    MatPaginatorModule,
    MatProgressSpinnerModule,
    RouterModule
  ],
  templateUrl: './dashboard-component.html',
  styleUrls: ['./dashboard-component.scss']
})
export class DashboardComponent implements OnInit, AfterViewInit {
  displayedColumns: string[] = ['id', 'name', 'email', 'role'];
  dataSource = new MatTableDataSource<any>([]);
  loading = false;

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(
    private userService: UserService,
    private sidenavService: SidenavService
  ) {}

  ngOnInit(): void {
    this.fetchUsers();
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
  }

  fetchUsers(): void {
    this.loading = true;
    this.userService.getUsers().subscribe({
      next: (users) => {
        this.dataSource.data = users;
        setTimeout(() => {
          this.dataSource.paginator = this.paginator;
        });

        this.loading = false;
      },
      error: () => {
        this.loading = false;
      }
    });
  }

  openUserDetails(user: any): void {
    this.sidenavService.openWithUser(user);
  }
}
