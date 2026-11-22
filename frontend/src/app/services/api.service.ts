import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class ApiService {
  private base = environment.apiUrl;

  constructor(private http: HttpClient) {}

  // Auth
  register(data: any) { return this.http.post(`${this.base}/auth/register`, data); }

  // Public (no auth required - used by the public booking page and the internal client booking flow)
  getBarbershops() { return this.http.get<any[]>(`${this.base}/public/barbershops`); }
  getPublicShop(shopId: number) { return this.http.get<any>(`${this.base}/public/barbershops/${shopId}`); }
  getPublicServices(shopId: number) { return this.http.get<any[]>(`${this.base}/public/barbershops/${shopId}/services`); }
  getPublicBarbers(shopId: number) { return this.http.get<any[]>(`${this.base}/public/barbershops/${shopId}/barbers`); }
  getSlots(barberId: number, serviceId: number, date: string, shopId: number) {
    return this.http.get<any[]>(`${this.base}/public/slots?barberId=${barberId}&serviceId=${serviceId}&date=${date}&shopId=${shopId}`);
  }
  createPublicAppointment(data: any) { return this.http.post(`${this.base}/public/appointments`, data); }

  // Barbershops (authenticated)
  getShop(id: number) { return this.http.get<any>(`${this.base}/barbershops/${id}`); }
  updateShop(id: number, data: any) { return this.http.put(`${this.base}/barbershops/${id}`, data); }

  // Services (admin management)
  getServices(shopId: number) { return this.http.get<any[]>(`${this.base}/services/shop/${shopId}`); }
  createService(data: any) { return this.http.post(`${this.base}/services`, data); }
  updateService(id: number, data: any) { return this.http.put(`${this.base}/services/${id}`, data); }
  deleteService(id: number) { return this.http.delete(`${this.base}/services/${id}`); }

  // Users
  getBarbers(shopId: number) { return this.http.get<any[]>(`${this.base}/users/shop/${shopId}/barbers`); }
  getUsers(shopId: number) { return this.http.get<any[]>(`${this.base}/users/shop/${shopId}`); }
  createUser(data: any) { return this.http.post(`${this.base}/users`, data); }
  updateUser(id: number, data: any) { return this.http.put(`${this.base}/users/${id}`, data); }
  deleteUser(id: number) { return this.http.delete(`${this.base}/users/${id}`); }

  // Appointments (authenticated)
  getAppointments(shopId: number) { return this.http.get<any[]>(`${this.base}/appointments/shop/${shopId}`); }
  getUpcoming(shopId: number) { return this.http.get<any[]>(`${this.base}/appointments/shop/${shopId}/upcoming`); }
  getByDate(shopId: number, date: string) { return this.http.get<any[]>(`${this.base}/appointments/shop/${shopId}/date/${date}`); }
  getMyAppointments() { return this.http.get<any[]>(`${this.base}/appointments/my`); }
  createAppointment(data: any) { return this.http.post(`${this.base}/appointments`, data); }
  updateStatus(id: number, status: string) { return this.http.patch(`${this.base}/appointments/${id}/status`, { status }); }
  deleteAppointment(id: number) { return this.http.delete(`${this.base}/appointments/${id}`); }
  getStats(shopId: number) { return this.http.get<any>(`${this.base}/appointments/stats/${shopId}`); }
}
