import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { ApiService } from '../../services/api.service';

@Component({
  selector: 'app-services',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div>
      <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:24px">
        <h2>💈 Servicios</h2>
        <button class="btn-primary" (click)="showForm = !showForm">➕ Nuevo Servicio</button>
      </div>

      <div class="card" style="margin-bottom:24px" *ngIf="showForm">
        <h3 style="margin-bottom:16px">{{ editing ? 'Editar' : 'Nuevo' }} Servicio</h3>
        <div class="form-group">
          <label>Nombre</label>
          <input [(ngModel)]="form.name" placeholder="Nombre del servicio" />
        </div>
        <div class="form-group">
          <label>Descripción</label>
          <input [(ngModel)]="form.description" placeholder="Descripción" />
        </div>
        <div class="form-group">
          <label>Precio</label>
          <input type="number" [(ngModel)]="form.price" placeholder="Precio" />
        </div>
        <div class="form-group">
          <label>Duración (minutos)</label>
          <input type="number" [(ngModel)]="form.durationMinutes" placeholder="30" />
        </div>
        <div style="display:flex; gap:8px">
          <button class="btn-primary" (click)="save()">{{ editing ? 'Actualizar' : 'Crear' }}</button>
          <button class="btn-secondary" (click)="cancel()">Cancelar</button>
        </div>
      </div>

      <div class="card">
        <table *ngIf="services.length > 0">
          <thead>
            <tr><th>Nombre</th><th>Descripción</th><th>Precio</th><th>Duración</th><th>Acciones</th></tr>
          </thead>
          <tbody>
            <tr *ngFor="let s of services">
              <td>{{ s.name }}</td>
              <td>{{ s.description }}</td>
              <td>{{ s.price }}</td>
              <td>{{ s.durationMinutes }} min</td>
              <td>
                <div style="display:flex; gap:8px">
                  <button class="btn-secondary" style="padding:6px 10px; font-size:12px" (click)="edit(s)">✏️ Editar</button>
                  <button class="btn-danger" style="padding:6px 10px; font-size:12px" (click)="delete(s.id)">🗑️ Eliminar</button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
        <p *ngIf="services.length === 0" style="color:#a0a0a0">No hay servicios registrados.</p>
      </div>
    </div>
  `
})
export class ServicesComponent implements OnInit {
  services: any[] = [];
  showForm = false;
  editing: any = null;
  form: any = { name: '', description: '', price: 0, durationMinutes: 30 };

  constructor(public auth: AuthService, private api: ApiService) {}

  ngOnInit() { this.load(); }

  load() {
    this.api.getServices(this.auth.getShopId()!).subscribe(s => this.services = s);
  }

  edit(s: any) {
    this.editing = s;
    this.form = { name: s.name, description: s.description, price: s.price, durationMinutes: s.durationMinutes };
    this.showForm = true;
  }

  cancel() { this.showForm = false; this.editing = null; this.form = { name: '', description: '', price: 0, durationMinutes: 30 }; }

  save() {
    const data = { ...this.form, barbershopId: this.auth.getShopId() };
    const obs = this.editing ? this.api.updateService(this.editing.id, data) : this.api.createService(data);
    obs.subscribe(() => { this.load(); this.cancel(); });
  }

  delete(id: number) {
    if (confirm('¿Eliminar este servicio?')) this.api.deleteService(id).subscribe(() => this.load());
  }
}