import { Component } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from './services/auth.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive, CommonModule],
  template: `
    <div class="layout" *ngIf="auth.currentUser(); else noAuth">
      <nav class="sidebar">
        <div class="logo">✂️ BarberBook</div>
        <ul>
          <li><a routerLink="/dashboard" routerLinkActive="active">🏠 Dashboard</a></li>
          <li *ngIf="auth.isAdmin() || auth.isBarber()">
            <a routerLink="/appointments" routerLinkActive="active">📅 Citas</a>
          </li>
          <li *ngIf="auth.isClient()">
            <a routerLink="/my-appointments" routerLinkActive="active">📅 Mis Citas</a>
          </li>
          <li><a routerLink="/booking" routerLinkActive="active">➕ Nueva Cita</a></li>
          <li *ngIf="auth.isAdmin()">
            <a routerLink="/services" routerLinkActive="active">💈 Servicios</a>
          </li>
          <li *ngIf="auth.isAdmin()">
            <a routerLink="/barbers" routerLinkActive="active">👨 Barberos</a>
          </li>
        </ul>
        <div class="user-info">
          <span>{{ auth.currentUser()?.fullName }}</span>
          <small>{{ auth.currentUser()?.role }}</small>
          <button (click)="auth.logout()" class="btn-logout">Cerrar sesión</button>
        </div>
      </nav>
      <main class="content">
        <router-outlet></router-outlet>
      </main>
    </div>
    <ng-template #noAuth>
      <router-outlet></router-outlet>
    </ng-template>
  `,
  styles: [`
    .layout { display: flex; min-height: 100vh; }
    .sidebar { width: 240px; background: #1a1a1a; border-right: 1px solid #333; display: flex; flex-direction: column; padding: 24px 0; }
    .logo { font-size: 20px; font-weight: 700; color: #d4a853; padding: 0 24px 24px; border-bottom: 1px solid #333; }
    ul { list-style: none; padding: 16px 0; flex: 1; }
    li a { display: block; padding: 12px 24px; color: #a0a0a0; text-decoration: none; transition: all 0.2s; }
    li a:hover, li a.active { color: #fff; background: rgba(212,168,83,0.1); border-right: 3px solid #d4a853; }
    .user-info { padding: 16px 24px; border-top: 1px solid #333; }
    .user-info span { display: block; font-weight: 500; font-size: 14px; }
    .user-info small { color: #a0a0a0; font-size: 12px; }
    .btn-logout { margin-top: 12px; width: 100%; background: transparent; border: 1px solid #333; color: #a0a0a0; padding: 8px; border-radius: 6px; cursor: pointer; }
    .btn-logout:hover { border-color: #f44336; color: #f44336; }
    .content { flex: 1; padding: 32px; overflow-y: auto; }
  `]
})
export class AppComponent {
  constructor(public auth: AuthService) {}
}