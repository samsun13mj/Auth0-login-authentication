import { Component, OnInit } from '@angular/core';
import { CommonModule, NgIf } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService } from '../../../service/user-service';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { RouterModule } from '@angular/router';
import { ReactiveFormsModule, FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input'; 

@Component({
  selector: 'app-user-details',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    RouterModule,
    NgIf,
    ReactiveFormsModule,
    MatChipsModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule 
  ],
  templateUrl: './user-details.html',
  styleUrls: ['./user-details.scss']
})
export class UserDetails implements OnInit {
  user: any = null;
  isEditing = false;
  editForm!: FormGroup;

  constructor(
    private route: ActivatedRoute,
    private userService: UserService,
    private router: Router,
    private fb: FormBuilder
  ) {}

  ngOnInit() {
    const userId = this.route.snapshot.paramMap.get('id');
    if (userId) {
      this.userService.getUserById(userId).subscribe({
        next: (u) => {
          this.user = u || {};
          this.normalizeDataOnLoad();
          this.initForm();
        },
        error: (err) => console.error('Error fetching user details:', err),
      });
    }
  }

  private normalizeDataOnLoad() {
    if (!this.user) this.user = {};
    if (!Array.isArray(this.user.sample)) {
      this.user.sample = [];
    }
  }

  private initForm() {
    this.editForm = this.fb.group({
      name: [this.user.name || '', Validators.required],
      email: [this.user.email || '', [Validators.required, Validators.email]],
      role: [this.user.role || ''],
      phone: [this.user.phone || ''],
      address: [this.user.address || ''],
      habits: [this.user.habits?.join(', ') || ''],
      sample: this.fb.array(
        (this.user.sample || []).map((item: any) =>
          this.fb.group({
            key: [item.key || ''],
            value: [item.value || ''],
          })
        )
      )
    });
  }

  get sampleArray(): FormArray {
    return this.editForm.get('sample') as FormArray;
  }

  addSample() {
    this.sampleArray.push(this.fb.group({ key: [''], value: [''] }));
  }

  removeSample(index: number) {
    this.sampleArray.removeAt(index);
  }

  goBack() {
    this.router.navigate(['/dashboard']);
  }

  enableEdit() {
    this.isEditing = true;
    this.initForm();
  }

  cancelEdit() {
    this.isEditing = false;
  }

  saveUser() {
    if (this.editForm.invalid) return;

    const formValue = this.editForm.value;
    const updatedUser = {
      ...this.user, 
      ...formValue,
      habits: formValue.habits
        ? formValue.habits.split(',').map((h: string) => h.trim()).filter((h: string) => !!h)
        : [],
      sample: formValue.sample || []
    };

    this.userService.updateUser(this.user.id, updatedUser).subscribe({
      next: (res) => {
        this.user = res || {};
        this.normalizeDataOnLoad();
        this.isEditing = false;
      },
      error: (err) => console.error('Error updating user:', err),
    }); 
  }
}
