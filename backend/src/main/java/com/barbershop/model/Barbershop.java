package com.barbershop.model;

import jakarta.persistence.*;
import java.time.LocalTime;
import java.util.List;

@Entity
@Table(name = "barbershops")
public class Barbershop {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY) private Long id;
    private String name, address, phone, email, description;
    private LocalTime openTime = LocalTime.of(9, 0);
    private LocalTime closeTime = LocalTime.of(20, 0);
    private int slotDurationMinutes = 30;
    private boolean active = true;

    @OneToMany(mappedBy = "barbershop", cascade = CascadeType.ALL) private List<User> users;
    @OneToMany(mappedBy = "barbershop", cascade = CascadeType.ALL) private List<Service> services;
    @OneToMany(mappedBy = "barbershop", cascade = CascadeType.ALL) private List<Appointment> appointments;

    public Barbershop() {}

    public static Builder builder() { return new Builder(); }

    public static class Builder {
        private final Barbershop b = new Barbershop();
        public Builder name(String v) { b.name = v; return this; }
        public Builder address(String v) { b.address = v; return this; }
        public Builder phone(String v) { b.phone = v; return this; }
        public Builder email(String v) { b.email = v; return this; }
        public Builder description(String v) { b.description = v; return this; }
        public Builder openTime(LocalTime v) { b.openTime = v; return this; }
        public Builder closeTime(LocalTime v) { b.closeTime = v; return this; }
        public Builder slotDurationMinutes(int v) { b.slotDurationMinutes = v; return this; }
        public Builder active(boolean v) { b.active = v; return this; }
        public Barbershop build() { return b; }
    }

    public Long getId() { return id; }
    public String getName() { return name; }
    public void setName(String v) { this.name = v; }
    public String getAddress() { return address; }
    public void setAddress(String v) { this.address = v; }
    public String getPhone() { return phone; }
    public void setPhone(String v) { this.phone = v; }
    public String getEmail() { return email; }
    public void setEmail(String v) { this.email = v; }
    public String getDescription() { return description; }
    public void setDescription(String v) { this.description = v; }
    public LocalTime getOpenTime() { return openTime; }
    public void setOpenTime(LocalTime v) { this.openTime = v; }
    public LocalTime getCloseTime() { return closeTime; }
    public void setCloseTime(LocalTime v) { this.closeTime = v; }
    public int getSlotDurationMinutes() { return slotDurationMinutes; }
    public void setSlotDurationMinutes(int v) { this.slotDurationMinutes = v; }
    public boolean isActive() { return active; }
    public void setActive(boolean v) { this.active = v; }
    public List<User> getUsers() { return users; }
    public List<Service> getServices() { return services; }
    public List<Appointment> getAppointments() { return appointments; }
}