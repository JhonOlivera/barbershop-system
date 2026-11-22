import { Injectable, signal } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class NotificationService {
  message = signal<string | null>(null);
  private timeoutId: ReturnType<typeof setTimeout> | undefined;

  show(message: string) {
    this.message.set(message);
    if (this.timeoutId) clearTimeout(this.timeoutId);
    this.timeoutId = setTimeout(() => this.message.set(null), 4000);
  }

  clear() {
    this.message.set(null);
  }
}
