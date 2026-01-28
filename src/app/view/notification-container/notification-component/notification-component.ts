import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NotificationService } from '../../../service/notification-container/notification-service';

@Component({
  selector: 'app-notifications',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './notification-component.html',
  styleUrls: ['./notification-component.scss'],
})
export class NotificationComponent implements OnInit {

  notifications: any[] = [];
  selected: any | null = null;

  constructor(private notify: NotificationService) {}

  ngOnInit(): void {
    this.notify.notifications$.subscribe(res => {
      this.notifications = res;
    });

    this.notify.load();
  }

  select(n: any): void {
    this.selected = n;

    if (!n.read) {
      this.markRead(n);
    }
  }

  //  THIS METHOD WAS MISSING
  markRead(n: any): void {
    this.notify.markAsRead(n.id).subscribe(() => {
      n.read = true;
    });
  }

  delete(n: any): void {
    if (!confirm('Delete this notification?')) return;

    this.notify.delete(n.id).subscribe(() => {
      this.notifications =
        this.notifications.filter(x => x.id !== n.id);

      if (this.selected?.id === n.id) {
        this.selected = null;
      }
    });
  }
}
