import {
  Component,
  OnInit,
  ViewChild,
  ElementRef
} from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  ReactiveFormsModule,
  Validators,
  FormGroup
} from '@angular/forms';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';

import { UserService } from '../../../service/user-service';
import { AddUserDialogComponent } from '../../add-user-dialog/add-user-dialog';

@Component({
  selector: 'app-project',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule
  ],
  templateUrl: './project-component.html',
  styleUrls: ['./project-component.scss']
})
export class ProjectComponent implements OnInit {

  users: any[] = [];
  isEdit = false;
  isLoading = false;
  selectedUserId!: number;

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
    this.userService.getUsers().subscribe({
      next: (res) => {
        this.users = res;
        this.isLoading = false;
      },
      error: () => this.isLoading = false
    });
  }

  /** ➕ OPEN ADD USER DIALOG */
  openAddUserDialog(): void {
    const dialogRef = this.dialog.open(AddUserDialogComponent, {
      width: '480px',
      disableClose: true
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadUsers();
      }
    });
  }

  /** ✏️ EDIT USER */
  editUser(user: any): void {
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

  /** 🗑 DELETE USER */
  deleteUser(user: any): void {
    if (!confirm(`Delete ${user.name}?`)) return;

    this.isLoading = true;
    this.userService.deleteUser(user.id).subscribe(() => {
      this.loadUsers();
    });
  }

  /** ✅ UPDATE USER */
  submit(): void {
    if (this.userForm.invalid) return;

    this.isLoading = true;
    this.userService
      .updateUser(this.selectedUserId, this.userForm.value)
      .subscribe(() => {
        this.resetForm();
        this.loadUsers();
      });
  }

  resetForm(): void {
    this.userForm.reset();
    this.isEdit = false;
  }
}
