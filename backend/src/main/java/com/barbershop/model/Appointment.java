package com.barbershop.model;

import jakarta.persistence.*;
import java.time.*;

@Entity
@Table(name = "appointments")
public class Appointment {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY) private Long id;
    private String clientName, clientPhone, clientEmail, clientWhatsapp, notes;
    private LocalDate date;
    private LocalTime startTime, endTime;
    @Enumerated(EnumType.STRING) private AppointmentStatus status = AppointmentStatus.CONFIRMED;
    private boolean reminderSent = false;
    private LocalDateTime createdAt = LocalDateTime.now();
    private LocalDateTime updatedAt;

    @ManyToOne @JoinColumn(name = "barber_id") private User barber;
    @ManyToOne @JoinColumn(name = "service_id") private Service service;
    @ManyToOne @JoinColumn(name = "barbershop_id") private Barbershop barbershop;
    @ManyToOne @JoinColumn(name = "client_user_id") private User clientUser;

    public Appointment() {}

    @PreUpdate public void preUpdate() { this.updatedAt = LocalDateTime.now(); }

    public static Builder builder() { return new Builder(); }

    public static class Builder {
        private final Appointment a = new Appointment();
        public Builder clientName(String v) { a.clientName = v; return this; }
        public Builder clientPhone(String v) { a.clientPhone = v; return this; }
        public Builder clientEmail(String v) { a.clientEmail = v; return this; }
        public Builder clientWhatsapp(String v) { a.clientWhatsapp = v; return this; }
        public Builder notes(String v) { a.notes = v; return this; }
        public Builder date(LocalDate v) { a.date = v; return this; }
        public Builder startTime(LocalTime v) { a.startTime = v; return this; }
        public Builder endTime(LocalTime v) { a.endTime = v; return this; }
        public Builder status(AppointmentStatus v) { a.status = v; return this; }
        public Builder barber(User v) { a.barber = v; return this; }
        public Builder service(Service v) { a.service = v; return this; }
        public Builder barbershop(Barbershop v) { a.barbershop = v; return this; }
        public Builder clientUser(User v) { a.clientUser = v; return this; }
        public Appointment build() { return a; }
    }

    public Long getId() { return id; }
    public String getClientName() { return clientName; }
    public void setClientName(String v) { this.clientName = v; }
    public String getClientPhone() { return clientPhone; }
    public void setClientPhone(String v) { this.clientPhone = v; }
    public String getClientEmail() { return clientEmail; }
    public void setClientEmail(String v) { this.clientEmail = v; }
    public String getClientWhatsapp() { return clientWhatsapp; }
    public void setClientWhatsapp(String v) { this.clientWhatsapp = v; }
    public String getNotes() { return notes; }
    public void setNotes(String v) { this.notes = v; }
    public LocalDate getDate() { return date; }
    public void setDate(LocalDate v) { this.date = v; }
    public LocalTime getStartTime() { return startTime; }
    public void setStartTime(LocalTime v) { this.startTime = v; }
    public LocalTime getEndTime() { return endTime; }
    public void setEndTime(LocalTime v) { this.endTime = v; }
    public AppointmentStatus getStatus() { return status; }
    public void setStatus(AppointmentStatus v) { this.status = v; }
    public boolean isReminderSent() { return reminderSent; }
    public void setReminderSent(boolean v) { this.reminderSent = v; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public User getBarber() { return barber; }
    public void setBarber(User v) { this.barber = v; }
    public Service getService() { return service; }
    public void setService(Service v) { this.service = v; }
    public Barbershop getBarbershop() { return barbershop; }
    public void setBarbershop(Barbershop v) { this.barbershop = v; }
    public User getClientUser() { return clientUser; }
    public void setClientUser(User v) { this.clientUser = v; }
}