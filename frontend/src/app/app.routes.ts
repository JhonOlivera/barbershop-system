import { Routes } from '@angular/router';
import { roleGuard } from './guards/role.guard';

export const routes: Routes = [
  { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
  { path: 'login', loadComponent: () => import('./components/login/login.component').then(m => m.LoginComponent) },
  { path: 'register', loadComponent: () => import('./components/register/register.component').then(m => m.RegisterComponent) },
  { path: 'reservar/:shopId', loadComponent: () => import('./components/public-booking/public-booking.component').then(m => m.PublicBookingComponent) },
  { path: 'dashboard', loadComponent: () => import('./components/dashboard/dashboard.component').then(m => m.DashboardComponent), canActivate: [roleGuard], data: { roles: ['ADMIN'] } },
  { path: 'appointments', loadComponent: () => import('./components/appointments/appointments.component').then(m => m.AppointmentsComponent), canActivate: [roleGuard], data: { roles: ['ADMIN', 'BARBER'] } },
  { path: 'booking', loadComponent: () => import('./components/booking/booking.component').then(m => m.BookingComponent), canActivate: [roleGuard], data: { roles: ['CLIENT'] } },
  { path: 'services', loadComponent: () => import('./components/services/services.component').then(m => m.ServicesComponent), canActivate: [roleGuard], data: { roles: ['ADMIN'] } },
  { path: 'barbers', loadComponent: () => import('./components/barbers/barbers.component').then(m => m.BarbersComponent), canActivate: [roleGuard], data: { roles: ['ADMIN'] } },
  { path: 'my-appointments', loadComponent: () => import('./components/my-appointments/my-appointments.component').then(m => m.MyAppointmentsComponent), canActivate: [roleGuard], data: { roles: ['CLIENT'] } },
  { path: '**', redirectTo: '/dashboard' }
];
