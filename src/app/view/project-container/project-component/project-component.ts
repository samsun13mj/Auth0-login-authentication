import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { CommonModule, NgIf } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators, FormGroup } from '@angular/forms';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { finalize } from 'rxjs/operators';
import { UserService, User } from '../../../service/user-container/user-service';
import { AddUserDialogComponent } from '../../add-user-dialog/add-user-dialog';

@Component({
  selector: 'app-project',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    NgIf
  ],
  templateUrl: './project-component.html',
  styleUrls: ['./project-component.scss']
})
export class ProjectComponent implements OnInit {

  users: User[] = [];
  isEdit = false;
  isLoading = false;
  selectedUserId!: string;

  userForm!: FormGroup;

  @ViewChild('editSection') editSection!: ElementRef;

  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private dialog: MatDialog
  ) {
    this.userForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      role: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers(): void {
    this.isLoading = true;

    this.userService.getUsers()
      .pipe(finalize(() => this.isLoading = false))
      .subscribe({
        next: users => this.users = users,
        error: err => console.error('Load users failed', err)
      });
  }

  openAddUserDialog(): void {
    const dialogRef = this.dialog.open(AddUserDialogComponent, {
      width: '480px',
      disableClose: true
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) this.loadUsers();
    });
  }

  editUser(user: User): void {
    this.isEdit = true;
    this.selectedUserId = user.id;
    this.userForm.patchValue(user);

    setTimeout(() => {
      this.editSection?.nativeElement.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
    });
  }

  deleteUser(user: User): void {
    if (!confirm(`Delete ${user.name}?`)) return;

    this.isLoading = true;

    this.userService.deleteUser(user.id)
      .pipe(finalize(() => this.isLoading = false))
      .subscribe({
        next: () => this.loadUsers(),
        error: err => console.error('Delete failed', err)
      });
  }

  submit(): void {
    if (this.userForm.invalid) return;

    this.isLoading = true;

    const payload: User = {
      id: this.selectedUserId,
      ...this.userForm.value
    };

    this.userService
      .updateUser(this.selectedUserId, payload)
      .pipe(finalize(() => this.isLoading = false))
      .subscribe({
        next: () => {
          this.resetForm();
          this.loadUsers();
        },
        error: err => console.error('Update failed', err)
      });
  }

  resetForm(): void {
    this.userForm.reset();
    this.isEdit = false;
  }
}
  