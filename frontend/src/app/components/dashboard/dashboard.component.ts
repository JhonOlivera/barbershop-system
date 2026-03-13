import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { ApiService } from '../../services/api.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div>
      <h2 style="margin-bottom:8px">Bienvenido, {{ auth.currentUser()?.fullName }} 👋</h2>
      <p style="color:#a0a0a0; margin-bottom:32px">{{ auth.currentUser()?.role }}</p>

      <div class="stats-grid" *ngIf="auth.isAdmin() || auth.isBarber()">
        <div class="card stat-card">
          <div class="stat-number">{{ stats?.totalAppointments || 0 }}</div>
          <div class="stat-label">Total Citas</div>
        </div>
        <div class="card stat-card">
          <div class="stat-number">{{ stats?.todayAppointments || 0 }}</div>
          <div class="stat-label">Citas Hoy</div>
        </div>
        <div class="card stat-card">
          <div class="stat-number">{{ stats?.pendingAppointments || 0 }}</div>
          <div class="stat-label">Pendientes</div>
        </div>
        <div class="card stat-card">
          <div class="stat-number">{{ stats?.totalBarbers || 0 }}</div>
          <div class="stat-label">Barberos</div>
        </div>
      </div>

      <div class="card" style="margin-top:24px">
        <h3 style="margin-bottom:16px">Próximas Citas</h3>
        <table *ngIf="upcoming.length > 0">
          <thead>
            <tr><th>Cliente</th><th>Fecha</th><th>Hora</th><th>Servicio</th><th>Barbero</th><th>Estado</th></tr>
          </thead>
          <tbody>
            <tr *ngFor="let a of upcoming">
              <td>{{ a.clientName }}</td>
              <td>{{ a.date }}</td>
              <td>{{ a.startTime }}</td>
              <td>{{ a.serviceName }}</td>
              <td>{{ a.barberName }}</td>
              <td><span class="badge" [class]="getBadge(a.status)">{{ a.status }}</span></td>
            </tr>
          </tbody>
        </table>
        <p *ngIf="upcoming.length === 0" style="color:#a0a0a0">No hay citas próximas.</p>
      </div>

      <div style="margin-top:24px" *ngIf="auth.isClient()">
        <a routerLink="/booking" class="btn-primary" style="display:inline-block; padding:14px 28px; text-decoration:none; border-radius:8px; background:#d4a853; color:#000; font-weight:600">
          ➕ Reservar Cita
        </a>
      </div>
    </div>
  `,
  styles: [`
    .stats-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(160px, 1fr)); gap: 16px; }
    .stat-card { text-align: center; }
    .stat-number { font-size: 36px; font-weight: 700; color: #d4a853; }
    .stat-label { color: #a0a0a0; font-size: 14px; margin-top: 4px; }
  `]
})
export class DashboardComponent implements OnInit {
  stats: any = null;
  upcoming: any[] = [];

  constructor(public auth: AuthService, private api: ApiService) {}

  ngOnInit() {
    const shopId = this.auth.getShopId();
    if (shopId) {
      if (this.auth.isAdmin() || this.auth.isBarber()) {
        this.api.getStats(shopId).subscribe(s => this.stats = s);
        this.api.getUpcoming(shopId).subscribe(a => this.upcoming = a.slice(0, 5));
      } else {
        this.api.getMyAppointments().subscribe(a => this.upcoming = a.slice(0, 5));
      }
    }
  }

  getBadge(status: string) {
    const map: any = { CONFIRMED: 'badge badge-success', PENDING: 'badge badge-warning', CANCELLED: 'badge badge-error', COMPLETED: 'badge badge-info' };
    return map[status] || 'badge';
  }
}