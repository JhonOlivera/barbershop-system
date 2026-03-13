import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { ApiService } from '../../services/api.service';

@Component({
  selector: 'app-my-appointments',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div>
      <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:24px">
        <h2>📅 Mis Citas</h2>
        <a routerLink="/booking" class="btn-primary" style="text-decoration:none; padding:10px 20px; border-radius:8px; background:#d4a853; color:#000; font-weight:600">
          ➕ Nueva Cita
        </a>
      </div>

      <div class="card">
        <table *ngIf="appointments.length > 0">
          <thead>
            <tr><th>Fecha</th><th>Hora</th><th>Servicio</th><th>Barbero</th><th>Precio</th><th>Estado</th></tr>
          </thead>
          <tbody>
            <tr *ngFor="let a of appointments">
              <td>{{ a.date }}</td>
              <td>{{ a.startTime }}</td>
              <td>{{ a.serviceName }}</td>
              <td>{{ a.barberName }}</td>
            <td>{{ a.servicePrice }}</td>
              <td><span class="badge" [class]="getBadge(a.status)">{{ a.status }}</span></td>
            </tr>
          </tbody>
        </table>
        <div *ngIf="appointments.length === 0" style="text-align:center; padding:40px">
          <p style="color:#a0a0a0; margin-bottom:16px">No tienes citas registradas.</p>
          <a routerLink="/booking" style="color:#d4a853">Reserva tu primera cita →</a>
        </div>
      </div>
    </div>
  `
})
export class MyAppointmentsComponent implements OnInit {
  appointments: any[] = [];

  constructor(public auth: AuthService, private api: ApiService) {}

  ngOnInit() {
    this.api.getMyAppointments().subscribe(a => this.appointments = a);
  }

  getBadge(status: string) {
    const map: any = { CONFIRMED: 'badge badge-success', PENDING: 'badge badge-warning', CANCELLED: 'badge badge-error', COMPLETED: 'badge badge-info' };
    return map[status] || 'badge';
  }
}