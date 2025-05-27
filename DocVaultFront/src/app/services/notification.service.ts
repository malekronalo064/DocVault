import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

export interface NotificationPayload {
  message: string;
  type: 'success' | 'error' | 'info'; 
}

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private notificationSubject = new Subject<NotificationPayload>();
  notification$ = this.notificationSubject.asObservable();

  showNotification(message: string, type: 'success' | 'error' | 'info') {
    this.notificationSubject.next({ message, type });
  }
}
