import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { ApiService } from '../../services/api.service';

@Component({
  selector: 'app-booking',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div>
      <h2 style="margin-bottom:24px">➕ Nueva Cita</h2>
      <div class="card" style="max-width:600px">
        <div class="alert alert-error" *ngIf="error">{{ error }}</div>
        <div class="alert alert-success" *ngIf="success">{{ success }}</div>

        <div class="form-group">
          <label>Nombre del cliente</label>
          <input [(ngModel)]="form.clientName" placeholder="Nombre completo" />
        </div>
        <div class="form-group">
          <label>Teléfono</label>
          <input [(ngModel)]="form.clientPhone" placeholder="Teléfono" />
        </div>
        <div class="form-group">
          <label>WhatsApp (con código de país, ej: 573001234567)</label>
          <input [(ngModel)]="form.clientWhatsapp" placeholder="573001234567" />
        </div>
        <div class="form-group">
          <label>Servicio</label>
          <select [(ngModel)]="form.serviceId" (change)="loadSlots()">
            <option value="">Selecciona un servicio</option>
            <option *ngFor="let s of services" [value]="s.id">{{ s.name }} - {{ s.price }} ({{ s.durationMinutes }} min)
          </select>
        </div>
        <div class="form-group">
          <label>Barbero</label>
          <select [(ngModel)]="form.barberId" (change)="loadSlots()">
            <option value="">Selecciona un barbero</option>
            <option *ngFor="let b of barbers" [value]="b.id">{{ b.fullName }}</option>
          </select>
        </div>
        <div class="form-group">
          <label>Fecha</label>
          <input type="date" [(ngModel)]="form.date" [min]="today" (change)="loadSlots()" />
        </div>

        <div *ngIf="slots.length > 0">
          <label style="display:block; margin-bottom:8px; color:#a0a0a0; font-size:13px">Horario disponible</label>
          <div class="slots-grid">
            <button *ngFor="let slot of slots"
              [disabled]="!slot.available"
              [class]="slot.start === form.startTime ? 'slot-btn selected' : 'slot-btn'"
              (click)="slot.available && selectSlot(slot)">
              {{ slot.start }}
            </button>
          </div>
        </div>

        <div class="form-group" style="margin-top:16px">
          <label>Notas (opcional)</label>
          <textarea [(ngModel)]="form.notes" rows="3" placeholder="Alguna indicación especial..."></textarea>
        </div>

        <button class="btn-primary" style="width:100%; margin-top:8px" (click)="book()" [disabled]="loading">
          {{ loading ? 'Reservando...' : 'Confirmar Cita' }}
        </button>
      </div>
    </div>
  `,
  styles: [`
    .slots-grid { display: flex; flex-wrap: wrap; gap: 8px; margin-bottom: 16px; }
    .slot-btn { padding: 8px 14px; border-radius: 6px; border: 1px solid #333; background: #242424; color: #fff; cursor: pointer; font-size: 13px; }
    .slot-btn:disabled { opacity: 0.3; cursor: not-allowed; }
    .slot-btn.selected { background: #d4a853; color: #000; border-color: #d4a853; }
    .slot-btn:not(:disabled):hover { border-color: #d4a853; }
  `]
})
export class BookingComponent implements OnInit {
  services: any[] = [];
  barbers: any[] = [];
  slots: any[] = [];
  today = new Date().toISOString().split('T')[0];
  error = '';
  success = '';
  loading = false;

  form: any = {
    clientName: '', clientPhone: '', clientWhatsapp: '', clientEmail: '',
    serviceId: '', barberId: '', date: this.today, startTime: '', notes: '',
    barbershopId: 0
  };

  constructor(public auth: AuthService, private api: ApiService, private router: Router) {}

  ngOnInit() {
    const shopId = this.auth.getShopId()!;
    this.form.barbershopId = shopId;
    const user = this.auth.currentUser();
    if (user) { this.form.clientName = user.fullName; }
    this.api.getPublicServices(shopId).subscribe(s => this.services = s);
    this.api.getPublicBarbers(shopId).subscribe(b => this.barbers = b);
  }

  loadSlots() {
    if (this.form.barberId && this.form.serviceId && this.form.date) {
      this.api.getSlots(this.form.barberId, this.form.serviceId, this.form.date, this.form.barbershopId)
        .subscribe(s => this.slots = s);
    }
  }

  selectSlot(slot: any) { this.form.startTime = slot.start; }

  book() {
    if (!this.form.clientName || !this.form.serviceId || !this.form.barberId || !this.form.date || !this.form.startTime) {
      this.error = 'Completa todos los campos requeridos'; return;
    }
    this.loading = true;
    this.error = '';
    this.api.createAppointment(this.form).subscribe({
      next: () => {
        this.success = '✅ ¡Cita reservada! Se envió confirmación por WhatsApp.';
        this.loading = false;
        setTimeout(() => this.router.navigate(['/dashboard']), 2000);
      },
      error: () => { this.error = 'Error al reservar. Intenta de nuevo.'; this.loading = false; }
    });
  }
}