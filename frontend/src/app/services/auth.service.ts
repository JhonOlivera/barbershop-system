import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { tap } from 'rxjs/operators';
import { environment } from '../../environments/environment';

export interface User {
  username: string;
  fullName: string;
  role: string;
  barbershopId: number;
  token: string;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private apiUrl = `${environment.apiUrl}/auth`;
  currentUser = signal<User | null>(null);

  constructor(private http: HttpClient, private router: Router) {
    const stored = localStorage.getItem('user');
    if (stored) this.currentUser.set(JSON.parse(stored));
  }

  login(username: string, password: string) {
    return this.http.post<User>(`${this.apiUrl}/login`, { username, password }).pipe(
      tap(user => {
        this.currentUser.set(user);
        localStorage.setItem('user', JSON.stringify(user));
      })
    );
  }

  logout() {
    this.currentUser.set(null);
    localStorage.removeItem('user');
    this.router.navigate(['/login']);
  }

  isAdmin() { return this.currentUser()?.role === 'ADMIN'; }
  isBarber() { return this.currentUser()?.role === 'BARBER'; }
  isClient() { return this.currentUser()?.role === 'CLIENT'; }
  getToken() { return this.currentUser()?.token; }
  getShopId() { return this.currentUser()?.barbershopId; }

  homeRoute(): string {
    switch (this.currentUser()?.role) {
      case 'ADMIN': return '/dashboard';
      case 'BARBER': return '/appointments';
      case 'CLIENT': return '/my-appointments';
      default: return '/login';
    }
  }
}