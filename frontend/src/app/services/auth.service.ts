import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { tap } from 'rxjs/operators';

export interface User {
  username: string;
  fullName: string;
  role: string;
  barbershopId: number;
  token: string;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private apiUrl = 'http://localhost:8080/api/auth';
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
}