import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
    <div class="login-container">
      <div class="login-card">
        <h1>✂️ BarberBook</h1>
        <p>Sistema de Reservas</p>
        <div class="alert alert-error" *ngIf="error">{{ error }}</div>
        <div class="form-group">
          <label>Usuario</label>
          <input [(ngModel)]="username" placeholder="Ingresa tu usuario" />
        </div>
        <div class="form-group">
          <label>Contraseña</label>
          <input type="password" [(ngModel)]="password" placeholder="Ingresa tu contraseña" (keyup.enter)="login()" />
        </div>
        <button class="btn-primary" style="width:100%" (click)="login()" [disabled]="loading">
          {{ loading ? 'Ingresando...' : 'Ingresar' }}
        </button>
        <p style="text-align:center; margin-top:16px; color:#a0a0a0; font-size:14px">
          ¿No tienes cuenta? <a routerLink="/register" style="color:#d4a853">Regístrate</a>
        </p>
      </div>
    </div>
  `,
  styles: [`
    .login-container { min-height: 100vh; display: flex; align-items: center; justify-content: center; background: #0f0f0f; }
    .login-card { background: #1a1a1a; border: 1px solid #333; border-radius: 16px; padding: 40px; width: 100%; max-width: 400px; }
    h1 { font-size: 28px; color: #d4a853; margin-bottom: 4px; }
    p { color: #a0a0a0; margin-bottom: 24px; }
    .btn-primary { background: #d4a853; color: #000; font-weight: 600; padding: 12px; font-size: 16px; border-radius: 8px; border: none; cursor: pointer; }
    .btn-primary:disabled { opacity: 0.6; cursor: not-allowed; }
  `]
})
export class LoginComponent {
  username = '';
  password = '';
  error = '';
  loading = false;

  constructor(private auth: AuthService, private router: Router) {}

  login() {
    if (!this.username || !this.password) { this.error = 'Completa todos los campos'; return; }
    this.loading = true;
    this.error = '';
    this.auth.login(this.username, this.password).subscribe({
      next: () => this.router.navigate(['/dashboard']),
      error: () => { this.error = 'Usuario o contraseña incorrectos'; this.loading = false; }
    });
  }
}