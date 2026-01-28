import {
  Component,
  ViewChild,
  OnInit,
  AfterViewInit
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { RouterModule, ActivatedRoute, Router } from '@angular/router';

import { UserService } from '../../../service/user-container/user-service';
import { SidenavService } from '../../../service/sidenav-container/sidenav-service';

@Component({
  selector: 'app-dashboard-component',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatIconModule,
    MatTableModule,
    MatPaginatorModule,
    MatProgressSpinnerModule,
    MatInputModule,
    RouterModule
  ],
  templateUrl: './dashboard-component.html',
  styleUrls: ['./dashboard-component.scss']
})
export class DashboardComponent implements OnInit, AfterViewInit {

  displayedColumns: string[] = ['id', 'name', 'email', 'role'];
  dataSource = new MatTableDataSource<any>([]);
  loading = false;

  // ✅ Search toggle state
  showSearch = false;

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(
    private userService: UserService,
    private sidenavService: SidenavService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
  this.fetchUsers();

  // ✅ Listen URL changes always
  this.route.queryParams.subscribe(params => {
    const userId = params['userId'];

    if (!userId) {
      // ✅ If URL has no userId → close sidenav
      this.sidenavService.close();
      return;
    }

    // ✅ If URL has userId → open sidenav
    const user = this.dataSource.data.find(u => String(u.id) === String(userId));
    if (user) {
      this.sidenavService.openWithUser(user);
    }
  });
}

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
  }

  fetchUsers(): void {
  this.loading = true;

  this.userService.getUsers().subscribe({
    next: (users: any[]) => {
      this.dataSource.data = users;

      this.dataSource.filterPredicate = (data, filter) =>
        data.name.toLowerCase().includes(filter);

      this.loading = false;

      // ✅ Trigger URL logic after data loads
      const userId = this.route.snapshot.queryParamMap.get('userId');
      if (userId) {
        const user = users.find(u => String(u.id) === String(userId));
        if (user) {
          this.sidenavService.openWithUser(user);
        }
      }
    },
    error: () => {
      this.loading = false;
    }
  });
}


  applyFilter(event: Event): void {
    const value = (event.target as HTMLInputElement).value
      .trim()
      .toLowerCase();

    this.dataSource.filter = value;

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  toggleSearch(): void {
    this.showSearch = !this.showSearch;
  }

  // ✅ OPEN USER + UPDATE URL
  openUserDetails(user: any): void {
    this.sidenavService.openWithUser(user);

    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { userId: user.id },
      queryParamsHandling: 'merge'
    });
  }
}
