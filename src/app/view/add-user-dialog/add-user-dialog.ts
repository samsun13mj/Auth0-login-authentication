import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  ReactiveFormsModule,
  Validators,
  FormGroup
} from '@angular/forms';
import { MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { UserService, User } from '../../service/user-container/user-service';
import { NotificationService } from '../../service/notification-container/notification-service';

@Component({
  selector: 'app-add-user-dialog',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule
  ],
  templateUrl: './add-user-dialog.html',
  styleUrls: ['./add-user-dialog.scss']
})
export class AddUserDialogComponent {

  form!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private notify: NotificationService,
    private dialogRef: MatDialogRef<AddUserDialogComponent>
  ) {
    this.form = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      role: ['', Validators.required]
    });
  }

  /** ✅ 6-DIGIT NUMERIC STRING (json-server safe) */
  private generateSixDigitId(): string {
    return String(Math.floor(100000 + Math.random() * 900000));
  }

  submit(): void {
    if (this.form.invalid) return;

    const payload: User = {
      id: this.generateSixDigitId(),
      name: this.form.value.name,
      email: this.form.value.email,
      role: this.form.value.role
    };

    this.userService.addUser(payload).subscribe(user => {

      this.notify.create({
        userId: null,
        type: 'USER',
        message: `New user added: ${user.name}`,
        payload: user
      }).subscribe();

      this.dialogRef.close(true);
    });
  }

  cancel(): void {
    this.dialogRef.close(false);
  }
}
