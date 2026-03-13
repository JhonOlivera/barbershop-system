import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { ApiService } from '../../services/api.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
    <div class="login-container">
      <div class="login-card">
        <h1>✂️ BarberBook</h1>
        <p>Crear cuenta</p>
        <div class="alert alert-error" *ngIf="error">{{ error }}</div>
        <div class="alert alert-success" *ngIf="success">{{ success }}</div>
        <div class="form-group">
          <label>Nombre completo</label>
          <input [(ngModel)]="form.fullName" placeholder="Tu nombre" />
        </div>
        <div class="form-group">
          <label>Usuario</label>
          <input [(ngModel)]="form.username" placeholder="Nombre de usuario" />
        </div>
        <div class="form-group">
          <label>Contraseña</label>
          <input type="password" [(ngModel)]="form.password" placeholder="Contraseña" />
        </div>
        <div class="form-group">
          <label>Email</label>
          <input [(ngModel)]="form.email" placeholder="tu@email.com" />
        </div>
        <div class="form-group">
          <label>WhatsApp (con código de país, ej: 573001234567)</label>
          <input [(ngModel)]="form.whatsapp" placeholder="573001234567" />
        </div>
        <div class="form-group">
          <label>Barbería</label>
          <select [(ngModel)]="form.barbershopId">
            <option *ngFor="let s of shops" [value]="s.id">{{ s.name }}</option>
          </select>
        </div>
        <button class="btn-primary" style="width:100%" (click)="register()" [disabled]="loading">
          {{ loading ? 'Registrando...' : 'Registrarse' }}
        </button>
        <p style="text-align:center; margin-top:16px; color:#a0a0a0; font-size:14px">
          ¿Ya tienes cuenta? <a routerLink="/login" style="color:#d4a853">Inicia sesión</a>
        </p>
      </div>
    </div>
  `,
  styles: [`
    .login-container { min-height: 100vh; display: flex; align-items: center; justify-content: center; background: #0f0f0f; }
    .login-card { background: #1a1a1a; border: 1px solid #333; border-radius: 16px; padding: 40px; width: 100%; max-width: 420px; }
    h1 { font-size: 28px; color: #d4a853; margin-bottom: 4px; }
    p { color: #a0a0a0; margin-bottom: 24px; }
    .btn-primary { background: #d4a853; color: #000; font-weight: 600; padding: 12px; font-size: 16px; border-radius: 8px; border: none; cursor: pointer; }
    .btn-primary:disabled { opacity: 0.6; cursor: not-allowed; }
  `]
})
export class RegisterComponent implements OnInit {
  shops: any[] = [];
  error = '';
  success = '';
  loading = false;
  form = { fullName: '', username: '', password: '', email: '', whatsapp: '', barbershopId: null };

  constructor(private api: ApiService, private auth: AuthService, private router: Router) {}

  ngOnInit() {
    this.api.getBarbershops().subscribe(s => { this.shops = s; if (s.length) this.form.barbershopId = s[0].id; });
  }

  register() {
    this.loading = true;
    this.error = '';
    this.api.register(this.form).subscribe({
      next: () => {
        this.success = '¡Cuenta creada! Iniciando sesión...';
        this.auth.login(this.form.username, this.form.password).subscribe({
          next: () => this.router.navigate(['/dashboard']),
          error: () => this.router.navigate(['/login'])
        });
      },
      error: () => { this.error = 'Error al registrar. Intenta con otro usuario.'; this.loading = false; }
    });
  }
}