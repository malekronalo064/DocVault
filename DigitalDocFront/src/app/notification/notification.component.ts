import { Component, OnInit } from '@angular/core';
import { NotificationService } from '../services/notification.service';
import { NotificationPayload } from '../services/notification.service';

@Component({
  selector: 'app-notification',
  templateUrl: './notification.component.html',
  styleUrls: ['./notification.component.css']
})
export class NotificationComponent implements OnInit {
  notifications: NotificationPayload[] = [];

  constructor(private notificationService: NotificationService) { }

  ngOnInit() {
    this.notificationService.notification$.subscribe(notification => {
      this.notifications.push(notification);
      setTimeout(() => {
        this.notifications.shift();
      }, 2000);
    });
  }
}
