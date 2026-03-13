package com.barbershop.model;

import jakarta.persistence.*;
import java.math.BigDecimal;

@Entity
@Table(name = "services")
public class Service {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY) private Long id;
    private String name, description;
    private BigDecimal price;
    private int durationMinutes = 30;
    private boolean active = true;

    @ManyToOne @JoinColumn(name = "barbershop_id") private Barbershop barbershop;

    public Service() {}

    public static Builder builder() { return new Builder(); }

    public static class Builder {
        private final Service s = new Service();
        public Builder name(String v) { s.name = v; return this; }
        public Builder description(String v) { s.description = v; return this; }
        public Builder price(BigDecimal v) { s.price = v; return this; }
        public Builder durationMinutes(int v) { s.durationMinutes = v; return this; }
        public Builder active(boolean v) { s.active = v; return this; }
        public Builder barbershop(Barbershop v) { s.barbershop = v; return this; }
        public Service build() { return s; }
    }

    public Long getId() { return id; }
    public String getName() { return name; }
    public void setName(String v) { this.name = v; }
    public String getDescription() { return description; }
    public void setDescription(String v) { this.description = v; }
    public BigDecimal getPrice() { return price; }
    public void setPrice(BigDecimal v) { this.price = v; }
    public int getDurationMinutes() { return durationMinutes; }
    public void setDurationMinutes(int v) { this.durationMinutes = v; }
    public boolean isActive() { return active; }
    public void setActive(boolean v) { this.active = v; }
    public Barbershop getBarbershop() { return barbershop; }
    public void setBarbershop(Barbershop v) { this.barbershop = v; }
}