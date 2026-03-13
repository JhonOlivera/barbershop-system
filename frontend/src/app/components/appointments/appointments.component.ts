import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { ApiService } from '../../services/api.service';

@Component({
  selector: 'app-appointments',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div>
      <h2 style="margin-bottom:24px">📅 Gestión de Citas</h2>

      <div style="display:flex; gap:12px; margin-bottom:24px; flex-wrap:wrap">
        <input type="date" [(ngModel)]="filterDate" (change)="filterByDate()" style="width:auto" />
        <select [(ngModel)]="filterStatus" (change)="applyFilter()" style="width:auto">
          <option value="">Todos los estados</option>
          <option value="CONFIRMED">Confirmada</option>
          <option value="PENDING">Pendiente</option>
          <option value="CANCELLED">Cancelada</option>
          <option value="COMPLETED">Completada</option>
        </select>
        <button class="btn-secondary" (click)="loadAll()">Ver todas</button>
      </div>

      <div class="card">
        <table *ngIf="filtered.length > 0">
          <thead>
            <tr><th>Cliente</th><th>Fecha</th><th>Hora</th><th>Servicio</th><th>Barbero</th><th>Estado</th><th>Acciones</th></tr>
          </thead>
          <tbody>
            <tr *ngFor="let a of filtered">
              <td>
                <div>{{ a.clientName }}</div>
                <small style="color:#a0a0a0">{{ a.clientPhone }}</small>
              </td>
              <td>{{ a.date }}</td>
              <td>{{ a.startTime }}</td>
              <td>{{ a.serviceName }}</td>
              <td>{{ a.barberName }}</td>
              <td><span class="badge" [class]="getBadge(a.status)">{{ a.status }}</span></td>
              <td>
                <div style="display:flex; gap:8px">
                  <button class="btn-secondary" style="padding:6px 10px; font-size:12px"
                    (click)="updateStatus(a.id, 'COMPLETED')" *ngIf="a.status === 'CONFIRMED'">✓ Completar</button>
                  <button class="btn-danger" style="padding:6px 10px; font-size:12px"
                    (click)="updateStatus(a.id, 'CANCELLED')" *ngIf="a.status !== 'CANCELLED'">✗ Cancelar</button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
        <p *ngIf="filtered.length === 0" style="color:#a0a0a0">No hay citas para mostrar.</p>
      </div>
    </div>
  `
})
export class AppointmentsComponent implements OnInit {
  appointments: any[] = [];
  filtered: any[] = [];
  filterDate = '';
  filterStatus = '';

  constructor(public auth: AuthService, private api: ApiService) {}

  ngOnInit() { this.loadAll(); }

  loadAll() {
    const shopId = this.auth.getShopId()!;
    this.filterDate = '';
    this.api.getAppointments(shopId).subscribe(a => { this.appointments = a; this.applyFilter(); });
  }

  filterByDate() {
    if (this.filterDate) {
      this.api.getByDate(this.auth.getShopId()!, this.filterDate).subscribe(a => { this.appointments = a; this.applyFilter(); });
    }
  }

  applyFilter() {
    this.filtered = this.filterStatus
      ? this.appointments.filter(a => a.status === this.filterStatus)
      : this.appointments;
  }

  updateStatus(id: number, status: string) {
    this.api.updateStatus(id, status).subscribe(() => this.loadAll());
  }

  getBadge(status: string) {
    const map: any = { CONFIRMED: 'badge badge-success', PENDING: 'badge badge-warning', CANCELLED: 'badge badge-error', COMPLETED: 'badge badge-info' };
    return map[status] || 'badge';
  }
}