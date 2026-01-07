import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TaskService } from '../../../service/task-servise';

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

  constructor(private taskService: TaskService) {}

  ngOnInit(): void {
    this.loadUsers();
    this.loadTasks();
  }

  loadUsers() {
    this.taskService.getUsers().subscribe(res => {
      this.users = res;
    });
  }

  loadTasks() {
    this.taskService.getTasks().subscribe(res => {
      this.tasks = res;
    });
  }

  assignTask() {
    if (!this.task.title || !this.task.assignedTo) {
      alert('Please fill all fields');
      return;
    }

    this.taskService.createTask(this.task).subscribe(() => {
      this.task = {
        title: '',
        description: '',
        assignedTo: null,
        completed: false
      };
      this.loadTasks();
    });
  }

  finishTask(id: number) {
    this.taskService.updateTask(id, { completed: true }).subscribe(() => {
      this.loadTasks();
    });
  }

  deleteTask(id: number) {
    if (!confirm('Are you sure you want to delete this task?')) return;

    this.taskService.deleteTask(id).subscribe(() => {
      this.loadTasks();
    });
  }
}
