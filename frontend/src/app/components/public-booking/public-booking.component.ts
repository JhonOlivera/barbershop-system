import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { ApiService } from '../../services/api.service';

@Component({
  selector: 'app-public-booking',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="page">
      <div class="wrap">
        <div *ngIf="loadingShop" class="card center">Cargando barbería...</div>
        <div *ngIf="!loadingShop && notFound" class="card center">
          <p>No encontramos esta barbería.</p>
        </div>

        <ng-container *ngIf="!loadingShop && shop && !confirmed">
          <header class="shop-header">
            <h1>✂️ {{ shop.name }}</h1>
            <p *ngIf="shop.address">📍 {{ shop.address }}</p>
            <p *ngIf="shop.phone">📞 {{ shop.phone }}</p>
          </header>

          <div class="progress">
            <span>Paso {{ step }} de 5</span>
            <div class="bar"><div class="fill" [style.width.%]="step * 20"></div></div>
          </div>

          <!-- Step 1: service -->
          <div class="card" *ngIf="step === 1">
            <h3>1. Elige un servicio</h3>
            <div *ngIf="services.length === 0" class="muted">Cargando servicios...</div>
            <button type="button" class="option" *ngFor="let s of services" (click)="chooseService(s)">
              <div class="option-main">
                <strong>{{ s.name }}</strong>
                <span class="muted">{{ s.durationMinutes }} min</span>
              </div>
              <div class="option-price">{{ s.price | number }}</div>
            </button>
          </div>

          <!-- Step 2: barber -->
          <div class="card" *ngIf="step === 2">
            <h3>2. Elige tu barbero</h3>
            <div *ngIf="barbers.length === 0" class="muted">Cargando barberos...</div>
            <button type="button" class="option" *ngFor="let b of barbers" (click)="chooseBarber(b)">
              <div class="option-main"><strong>{{ b.fullName }}</strong></div>
            </button>
          </div>

          <!-- Step 3: date -->
          <div class="card" *ngIf="step === 3">
            <h3>3. Elige la fecha</h3>
            <div class="form-group">
              <input type="date" [(ngModel)]="form.date" [min]="today" />
            </div>
            <button type="button" class="btn-primary full" (click)="confirmDate()" [disabled]="!form.date">
              Ver horarios disponibles
            </button>
          </div>

          <!-- Step 4: time slot -->
          <div class="card" *ngIf="step === 4">
            <h3>4. Elige un horario</h3>
            <div *ngIf="loadingSlots" class="muted">Buscando horarios disponibles...</div>
            <div *ngIf="!loadingSlots && slots.length === 0" class="muted">No hay horarios configurados para este día.</div>
            <div class="slots-grid" *ngIf="!loadingSlots && slots.length > 0">
              <button type="button" *ngFor="let slot of slots"
                [disabled]="!slot.available"
                class="slot-btn"
                (click)="chooseSlot(slot)">
                {{ slot.start }}
              </button>
            </div>
          </div>

          <!-- Step 5: client info + confirm -->
          <div class="card" *ngIf="step === 5">
            <h3>5. Tus datos</h3>
            <div class="summary">
              <div><span class="muted">Servicio</span> {{ selectedService?.name }}</div>
              <div><span class="muted">Barbero</span> {{ selectedBarber?.fullName }}</div>
              <div><span class="muted">Fecha</span> {{ form.date }}</div>
              <div><span class="muted">Hora</span> {{ form.startTime }}</div>
            </div>
            <div class="form-group">
              <label>Nombre completo *</label>
              <input [(ngModel)]="form.clientName" placeholder="Tu nombre" />
            </div>
            <div class="form-group">
              <label>Celular *</label>
              <input [(ngModel)]="form.clientPhone" placeholder="Número de celular" />
            </div>
            <div class="form-group">
              <label>WhatsApp (opcional)</label>
              <input [(ngModel)]="form.clientWhatsapp" placeholder="573001234567" />
            </div>
            <div class="form-group">
              <label>Email (opcional)</label>
              <input [(ngModel)]="form.clientEmail" placeholder="tu@email.com" />
            </div>
            <div class="form-group">
              <label>Notas (opcional)</label>
              <textarea [(ngModel)]="form.notes" rows="3" placeholder="Alguna indicación especial..."></textarea>
            </div>
            <button type="button" class="btn-primary full" (click)="submit()" [disabled]="!canSubmit() || submitting">
              {{ submitting ? 'Reservando...' : 'Confirmar reserva' }}
            </button>
          </div>

          <div class="footer-nav" *ngIf="step > 1 && step < 5">
            <button type="button" class="btn-secondary" (click)="back()">← Volver</button>
          </div>
          <div class="footer-nav" *ngIf="step === 5">
            <button type="button" class="btn-secondary" (click)="back()" [disabled]="submitting">← Volver</button>
          </div>
        </ng-container>

        <!-- Confirmation -->
        <div class="card center" *ngIf="confirmed">
          <div class="check">✅</div>
          <h2>¡Cita confirmada!</h2>
          <div class="summary">
            <div><span class="muted">Barbería</span> {{ shop.name }}</div>
            <div><span class="muted">Servicio</span> {{ confirmed.serviceName }}</div>
            <div><span class="muted">Barbero</span> {{ confirmed.barberName }}</div>
            <div><span class="muted">Fecha</span> {{ confirmed.date }}</div>
            <div><span class="muted">Hora</span> {{ confirmed.startTime }}</div>
            <div><span class="muted">Precio</span> {{ confirmed.servicePrice | number }}</div>
          </div>
          <p class="muted" style="margin-top:12px">Te esperamos. Si usaste WhatsApp, recibirás la confirmación ahí.</p>
          <button type="button" class="btn-secondary full" style="margin-top:16px" (click)="reset()">Reservar otra cita</button>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .page { min-height: 100vh; padding: 16px; display: flex; justify-content: center; }
    .wrap { width: 100%; max-width: 480px; }
    .card { background: var(--bg-card); border: 1px solid var(--border); border-radius: 12px; padding: 20px; margin-bottom: 16px; }
    .card.center { text-align: center; }
    .shop-header { text-align: center; padding: 8px 0 20px; }
    .shop-header h1 { font-size: 22px; color: var(--accent); margin-bottom: 6px; }
    .shop-header p { color: var(--text-secondary); font-size: 14px; margin: 2px 0; }
    .progress { margin-bottom: 16px; font-size: 13px; color: var(--text-secondary); }
    .progress .bar { height: 6px; background: #333; border-radius: 4px; margin-top: 6px; overflow: hidden; }
    .progress .fill { height: 100%; background: var(--accent); transition: width 0.2s; }
    h3 { margin-bottom: 16px; font-size: 16px; }
    .muted { color: var(--text-secondary); font-size: 13px; }
    .option {
      width: 100%; display: flex; justify-content: space-between; align-items: center;
      background: var(--bg-secondary); border: 1px solid var(--border);
      color: #fff; border-radius: 10px; padding: 16px; margin-bottom: 10px; text-align: left;
      font-size: 15px; min-height: 48px;
    }
    .option:active, .option:hover { border-color: var(--accent); }
    .option-main { display: flex; flex-direction: column; gap: 4px; }
    .option-price { font-weight: 600; color: var(--accent); }
    .slots-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 10px; }
    .slot-btn {
      padding: 12px 4px; border-radius: 8px; border: 1px solid var(--border);
      background: var(--bg-secondary); color: #fff; font-size: 14px; min-height: 44px;
    }
    .slot-btn:disabled { opacity: 0.3; }
    .slot-btn:not(:disabled):hover, .slot-btn:not(:disabled):active { border-color: var(--accent); }
    .form-group input, .form-group textarea { font-size: 16px; }
    .btn-primary.full, .btn-secondary.full { width: 100%; padding: 14px; font-size: 15px; }
    .footer-nav { display: flex; margin-bottom: 24px; }
    .summary { display: flex; flex-direction: column; gap: 6px; font-size: 14px; margin-bottom: 16px; }
    .summary .muted { display: inline-block; width: 80px; }
    .check { font-size: 48px; margin-bottom: 8px; }
  `]
})
export class PublicBookingComponent implements OnInit {
  shopId!: number;
  shop: any = null;
  loadingShop = true;
  notFound = false;

  services: any[] = [];
  barbers: any[] = [];
  slots: any[] = [];
  loadingSlots = false;

  step = 1;
  today = new Date().toISOString().split('T')[0];
  submitting = false;
  confirmed: any = null;

  form: any = {
    serviceId: '', barberId: '', date: '', startTime: '',
    clientName: '', clientPhone: '', clientWhatsapp: '', clientEmail: '', notes: ''
  };

  constructor(private route: ActivatedRoute, private api: ApiService) {}

  ngOnInit() {
    this.shopId = Number(this.route.snapshot.paramMap.get('shopId'));
    this.form.date = this.today;

    this.api.getPublicShop(this.shopId).subscribe({
      next: s => { this.shop = s; this.loadingShop = false; },
      error: () => { this.notFound = true; this.loadingShop = false; }
    });
    this.api.getPublicServices(this.shopId).subscribe(s => this.services = s);
    this.api.getPublicBarbers(this.shopId).subscribe(b => this.barbers = b);
  }

  get selectedService() { return this.services.find(s => s.id === this.form.serviceId); }
  get selectedBarber() { return this.barbers.find(b => b.id === this.form.barberId); }

  chooseService(s: any) { this.form.serviceId = s.id; this.step = 2; }
  chooseBarber(b: any) { this.form.barberId = b.id; this.step = 3; }

  confirmDate() {
    if (!this.form.date) return;
    this.step = 4;
    this.loadSlots();
  }

  loadSlots() {
    this.loadingSlots = true;
    this.slots = [];
    this.api.getSlots(this.form.barberId, this.form.serviceId, this.form.date, this.shopId).subscribe({
      next: s => { this.slots = s; this.loadingSlots = false; },
      error: () => { this.loadingSlots = false; }
    });
  }

  chooseSlot(slot: any) {
    if (!slot.available) return;
    this.form.startTime = slot.start;
    this.step = 5;
  }

  back() {
    if (this.step > 1) this.step--;
  }

  canSubmit() {
    return !!(this.form.clientName?.trim() && this.form.clientPhone?.trim());
  }

  submit() {
    if (!this.canSubmit() || this.submitting) return;
    this.submitting = true;
    const payload = {
      clientName: this.form.clientName,
      clientPhone: this.form.clientPhone,
      clientEmail: this.form.clientEmail || null,
      clientWhatsapp: this.form.clientWhatsapp || null,
      notes: this.form.notes || null,
      date: this.form.date,
      startTime: this.form.startTime,
      barberId: this.form.barberId,
      serviceId: this.form.serviceId,
      barbershopId: this.shopId
    };
    this.api.createPublicAppointment(payload).subscribe({
      next: (res) => { this.confirmed = res; this.submitting = false; },
      error: () => { this.submitting = false; }
    });
  }

  reset() {
    this.confirmed = null;
    this.step = 1;
    this.slots = [];
    this.form = {
      serviceId: '', barberId: '', date: this.today, startTime: '',
      clientName: '', clientPhone: '', clientWhatsapp: '', clientEmail: '', notes: ''
    };
  }
}
