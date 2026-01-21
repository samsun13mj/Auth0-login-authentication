import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TaskService } from '../../../service/task-servise';
import { NotificationService } from '../../../service/notification-container/notification-service';

@Component({
  selector: 'app-task',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './task-component.html',
  styleUrls: ['./task-component.scss'],
})
export class TaskComponent implements OnInit {

  users: any[] = [];
  tasks: any[] = [];

  task = {
    title: '',
    description: '',
    assignedTo: null as number | null,
    completed: false
  };

  constructor(
    private taskService: TaskService,
    private notify: NotificationService
  ) {}

  ngOnInit(): void {
    this.loadUsers();
    this.loadTasks();
  }

  loadUsers(): void {
    this.taskService.getUsers().subscribe(res => {
      this.users = res;
    });
  }

  loadTasks(): void {
    this.taskService.getTasks().subscribe(res => {
      this.tasks = res;
    });
  }

  get completedCount(): number {
    return this.tasks.filter(t => t.completed).length;
  }

  get pendingCount(): number {
    return this.tasks.filter(t => !t.completed).length;
  }

  // ✅ TASK ASSIGN (WITH PAYLOAD)
  assignTask(): void {
    if (!this.task.title || !this.task.assignedTo) {
      alert('Please fill all fields');
      return;
    }

    const assignedUser = this.users.find(
      u => u.id === this.task.assignedTo
    );

    this.taskService.createTask(this.task).subscribe(() => {

      this.notify.create({
        userId: this.task.assignedTo,
        type: 'TASK',
        message: `New task assigned: ${this.task.title}`,
        payload: {
          title: this.task.title,
          description: this.task.description,
          assignedTo: assignedUser?.name
        }
      }).subscribe();

      this.task = {
        title: '',
        description: '',
        assignedTo: null,
        completed: false
      };

      this.loadTasks();
    });
  }

  // ✅ TASK COMPLETE (WITH PAYLOAD)
  finishTask(id: number): void {
    const task = this.tasks.find(t => t.id === id);
    if (!task) return;

    const assignedUser = this.users.find(
      u => u.id === task.assignedTo
    );

    this.taskService.updateTask(id, { completed: true }).subscribe(() => {

      this.notify.create({
        userId: task.assignedTo,
        type: 'DONE',
        message: `Task completed: ${task.title}`,
        payload: {
          title: task.title,
          description: task.description,
          assignedTo: assignedUser?.name
        }
      }).subscribe();

      this.loadTasks();
    });
  }

  deleteTask(id: number): void {
    if (!confirm('Are you sure you want to delete this task?')) return;

    this.taskService.deleteTask(id).subscribe(() => {
      this.loadTasks();
    });
  }
}
