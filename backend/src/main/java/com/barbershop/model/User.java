package com.barbershop.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "users")
public class User {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY) private Long id;
    @Column(unique = true) private String username;
    private String password, fullName, email, phone, whatsapp;
    @Enumerated(EnumType.STRING) private Role role;
    private boolean active = true;
    private boolean notificationsEnabled = true;
    private LocalDateTime createdAt = LocalDateTime.now();

    @ManyToOne @JoinColumn(name = "barbershop_id") private Barbershop barbershop;

    public User() {}

    public static Builder builder() { return new Builder(); }

    public static class Builder {
        private final User u = new User();
        public Builder username(String v) { u.username = v; return this; }
        public Builder password(String v) { u.password = v; return this; }
        public Builder fullName(String v) { u.fullName = v; return this; }
        public Builder email(String v) { u.email = v; return this; }
        public Builder phone(String v) { u.phone = v; return this; }
        public Builder whatsapp(String v) { u.whatsapp = v; return this; }
        public Builder role(Role v) { u.role = v; return this; }
        public Builder active(boolean v) { u.active = v; return this; }
        public Builder barbershop(Barbershop v) { u.barbershop = v; return this; }
        public Builder notificationsEnabled(boolean v) { u.notificationsEnabled = v; return this; }
        public User build() { return u; }
    }

    public Long getId() { return id; }
    public String getUsername() { return username; }
    public void setUsername(String v) { this.username = v; }
    public String getPassword() { return password; }
    public void setPassword(String v) { this.password = v; }
    public String getFullName() { return fullName; }
    public void setFullName(String v) { this.fullName = v; }
    public String getEmail() { return email; }
    public void setEmail(String v) { this.email = v; }
    public String getPhone() { return phone; }
    public void setPhone(String v) { this.phone = v; }
    public String getWhatsapp() { return whatsapp; }
    public void setWhatsapp(String v) { this.whatsapp = v; }
    public Role getRole() { return role; }
    public void setRole(Role v) { this.role = v; }
    public boolean isActive() { return active; }
    public void setActive(boolean v) { this.active = v; }
    public boolean isNotificationsEnabled() { return notificationsEnabled; }
    public void setNotificationsEnabled(boolean v) { this.notificationsEnabled = v; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public Barbershop getBarbershop() { return barbershop; }
    public void setBarbershop(Barbershop v) { this.barbershop = v; }
}