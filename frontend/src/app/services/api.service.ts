import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({ providedIn: 'root' })
export class ApiService {
  private base = 'http://localhost:8080/api';

  constructor(private http: HttpClient) {}

  // Auth
  register(data: any) { return this.http.post(`${this.base}/auth/register`, data); }

  // Barbershops
  getBarbershops() { return this.http.get<any[]>(`${this.base}/public/barbershops`); }
  getShop(id: number) { return this.http.get<any>(`${this.base}/barbershops/${id}`); }
  updateShop(id: number, data: any) { return this.http.put(`${this.base}/barbershops/${id}`, data); }

  // Services
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

  // Appointments
  getAppointments(shopId: number) { return this.http.get<any[]>(`${this.base}/appointments/shop/${shopId}`); }
  getUpcoming(shopId: number) { return this.http.get<any[]>(`${this.base}/appointments/shop/${shopId}/upcoming`); }
  getByDate(shopId: number, date: string) { return this.http.get<any[]>(`${this.base}/appointments/shop/${shopId}/date/${date}`); }
  getMyAppointments() { return this.http.get<any[]>(`${this.base}/appointments/my`); }
  createAppointment(data: any) { return this.http.post(`${this.base}/appointments`, data); }
  updateStatus(id: number, status: string) { return this.http.patch(`${this.base}/appointments/${id}/status`, { status }); }
  deleteAppointment(id: number) { return this.http.delete(`${this.base}/appointments/${id}`); }
  getSlots(barberId: number, serviceId: number, date: string, shopId: number) {
    return this.http.get<any[]>(`${this.base}/appointments/slots?barberId=${barberId}&serviceId=${serviceId}&date=${date}&shopId=${shopId}`);
  }
  getStats(shopId: number) { return this.http.get<any>(`${this.base}/appointments/stats/${shopId}`); }
}