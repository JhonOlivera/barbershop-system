import { Routes } from '@angular/router';
import { authGuard } from './guards/auth.guard';

export const routes: Routes = [
  { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
  { path: 'login', loadComponent: () => import('./components/login/login.component').then(m => m.LoginComponent) },
  { path: 'register', loadComponent: () => import('./components/register/register.component').then(m => m.RegisterComponent) },
  { path: 'dashboard', loadComponent: () => import('./components/dashboard/dashboard.component').then(m => m.DashboardComponent), canActivate: [authGuard] },
  { path: 'appointments', loadComponent: () => import('./components/appointments/appointments.component').then(m => m.AppointmentsComponent), canActivate: [authGuard] },
  { path: 'booking', loadComponent: () => import('./components/booking/booking.component').then(m => m.BookingComponent), canActivate: [authGuard] },
  { path: 'services', loadComponent: () => import('./components/services/services.component').then(m => m.ServicesComponent), canActivate: [authGuard] },
  { path: 'barbers', loadComponent: () => import('./components/barbers/barbers.component').then(m => m.BarbersComponent), canActivate: [authGuard] },
  { path: 'my-appointments', loadComponent: () => import('./components/my-appointments/my-appointments.component').then(m => m.MyAppointmentsComponent), canActivate: [authGuard] },
  { path: '**', redirectTo: '/dashboard' }
];