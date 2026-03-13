import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { ApiService } from '../../services/api.service';

@Component({
  selector: 'app-barbers',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div>
      <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:24px">
        <h2>👨 Barberos</h2>
        <button class="btn-primary" (click)="showForm = !showForm">➕ Nuevo Barbero</button>
      </div>

      <div class="card" style="margin-bottom:24px" *ngIf="showForm">
        <h3 style="margin-bottom:16px">{{ editing ? 'Editar' : 'Nuevo' }} Barbero</h3>
        <div class="form-group">
          <label>Nombre completo</label>
          <input [(ngModel)]="form.fullName" placeholder="Nombre" />
        </div>
        <div class="form-group">
          <label>Usuario</label>
          <input [(ngModel)]="form.username" placeholder="Usuario" [disabled]="editing" />
        </div>
        <div class="form-group">
          <label>Contraseña {{ editing ? '(dejar vacío para no cambiar)' : '' }}</label>
          <input type="password" [(ngModel)]="form.password" placeholder="Contraseña" />
        </div>
        <div class="form-group">
          <label>Email</label>
          <input [(ngModel)]="form.email" placeholder="Email" />
        </div>
        <div class="form-group">
          <label>Teléfono</label>
          <input [(ngModel)]="form.phone" placeholder="Teléfono" />
        </div>
        <div style="display:flex; gap:8px">
          <button class="btn-primary" (click)="save()">{{ editing ? 'Actualizar' : 'Crear' }}</button>
          <button class="btn-secondary" (click)="cancel()">Cancelar</button>
        </div>
      </div>

      <div class="card">
        <table *ngIf="barbers.length > 0">
          <thead>
            <tr><th>Nombre</th><th>Usuario</th><th>Email</th><th>Teléfono</th><th>Acciones</th></tr>
          </thead>
          <tbody>
            <tr *ngFor="let b of barbers">
              <td>{{ b.fullName }}</td>
              <td>{{ b.username }}</td>
              <td>{{ b.email }}</td>
              <td>{{ b.phone }}</td>
              <td>
                <div style="display:flex; gap:8px">
                  <button class="btn-secondary" style="padding:6px 10px; font-size:12px" (click)="edit(b)">✏️ Editar</button>
                  <button class="btn-danger" style="padding:6px 10px; font-size:12px" (click)="delete(b.id)">🗑️ Eliminar</button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
        <p *ngIf="barbers.length === 0" style="color:#a0a0a0">No hay barberos registrados.</p>
      </div>
    </div>
  `
})
export class BarbersComponent implements OnInit {
  barbers: any[] = [];
  showForm = false;
  editing: any = null;
  form: any = { fullName: '', username: '', password: '', email: '', phone: '', role: 'BARBER' };

  constructor(public auth: AuthService, private api: ApiService) {}

  ngOnInit() { this.load(); }

  load() {
    this.api.getBarbers(this.auth.getShopId()!).subscribe(b => this.barbers = b);
  }

  edit(b: any) {
    this.editing = b;
    this.form = { fullName: b.fullName, username: b.username, password: '', email: b.email, phone: b.phone, role: 'BARBER' };
    this.showForm = true;
  }

  cancel() { this.showForm = false; this.editing = null; this.form = { fullName: '', username: '', password: '', email: '', phone: '', role: 'BARBER' }; }

  save() {
    const data = { ...this.form, barbershopId: this.auth.getShopId() };
    const obs = this.editing ? this.api.updateUser(this.editing.id, data) : this.api.createUser(data);
    obs.subscribe(() => { this.load(); this.cancel(); });
  }

  delete(id: number) {
    if (confirm('¿Eliminar este barbero?')) this.api.deleteUser(id).subscribe(() => this.load());
  }
}