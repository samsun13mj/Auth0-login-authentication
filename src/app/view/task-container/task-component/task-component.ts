import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TaskService } from '../../../service/task-container/task-service';
import { NotificationService } from '../../../service/notification-container/notification-service';
import { AnalyticsService } from '../../../service/report-service-container/report-service';

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
    assignedTo: null as string | null, 
    completed: false
  };

  constructor(
    private taskService: TaskService,
    private notify: NotificationService,
    private analyticsService: AnalyticsService
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

  get activeUsersCount(): number {
    if (!this.tasks.length) return 0;
    const ids = this.tasks.map(t => t.assignedTo);
    return new Set(ids).size;
  }

  get latestTaskTitle(): string {
    return this.tasks.length
      ? this.tasks[this.tasks.length - 1].title
      : 'No tasks yet';
  }

  get productivityPercent(): number {
    if (!this.tasks.length) return 0;
    return Math.round((this.completedCount / this.tasks.length) * 100);
  }

  // ================= ASSIGN TASK =================
  assignTask(): void {
    if (!this.task.title || !this.task.assignedTo) {
      alert('Please fill all fields');
      return;
    }

    const assignedUser = this.users.find(
      u => String(u.id) === String(this.task.assignedTo) 
    );

    this.taskService.createTask(this.task).subscribe((createdTask: any) => {

      const analytics = {
        taskId: createdTask.id,
        title: createdTask.title,
        description: createdTask.description,
        assignedTo: assignedUser?.name,
        userId: createdTask.assignedTo,
        status: 'ASSIGNED',
        createdAt: new Date().toISOString()
      };

      this.analyticsService.addAnalytics(analytics).subscribe();

      //  NOTIFICATION
      this.notify.create({
        userId: this.task.assignedTo,
        type: 'TASK',
        message: `New task assigned: ${this.task.title}`,
        payload: {
          title: this.task.title,
          description: this.task.description,
          assignedTo: assignedUser?.name
        }
      }).subscribe(() => {
        console.log('✅ Notification sent');
      });

      this.task = {
        title: '',
        description: '',
        assignedTo: null,
        completed: false
      };

      this.loadTasks();
    });
  }

  // COMPLETE TASK 
  finishTask(id: number): void {
    const task = this.tasks.find(t => t.id === id);
    if (!task) return;

    const assignedUser = this.users.find(
      u => String(u.id) === String(task.assignedTo) 
    );

    this.taskService.updateTask(id, { completed: true }).subscribe(() => {

      const analytics = {
        taskId: task.id,
        title: task.title,
        description: task.description,
        assignedTo: assignedUser?.name,
        userId: task.assignedTo,
        status: 'COMPLETED',
        createdAt: new Date().toISOString()
      };

      this.analyticsService.addAnalytics(analytics).subscribe();

      //  NOTIFICATION
      this.notify.create({
        userId: task.assignedTo,
        type: 'DONE',
        message: `Task completed: ${task.title}`,
        payload: {
          title: task.title,
          description: task.description,
          assignedTo: assignedUser?.name
        }
      }).subscribe(() => {
        console.log('✅ Notification sent');
      });

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
