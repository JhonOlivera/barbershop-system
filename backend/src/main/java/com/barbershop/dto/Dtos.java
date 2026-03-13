package com.barbershop.dto;
import com.barbershop.model.AppointmentStatus;
import com.barbershop.model.Role;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

public class Dtos {
    public record LoginRequest(String username, String password) {}
    public record LoginResponse(String token, String username, String fullName, Role role, Long barbershopId) {}
    public record RegisterRequest(String username, String password, String fullName, String email, String phone, String whatsapp, Long barbershopId) {}

    public record AppointmentRequest(
        String clientName, String clientPhone, String clientEmail, String clientWhatsapp,
        String notes, LocalDate date, LocalTime startTime,
        Long barberId, Long serviceId, Long barbershopId
    ) {}

    public record AppointmentResponse(
        Long id, String clientName, String clientPhone, String clientEmail, String clientWhatsapp,
        String notes, LocalDate date, LocalTime startTime, LocalTime endTime,
        AppointmentStatus status, boolean reminderSent,
        String barberName, String serviceName, BigDecimal servicePrice, int serviceDuration
    ) {}

    public record ServiceRequest(String name, String description, BigDecimal price, int durationMinutes, Long barbershopId) {}
    public record ServiceResponse(Long id, String name, String description, BigDecimal price, int durationMinutes, boolean active) {}

    public record UserRequest(String username, String password, String fullName, String email, String phone, String whatsapp, Role role, Long barbershopId) {}
    public record UserResponse(Long id, String username, String fullName, String email, String phone, String whatsapp, Role role, boolean active) {}

    public record BarbershopRequest(String name, String address, String phone, String email, String description, LocalTime openTime, LocalTime closeTime, int slotDurationMinutes) {}
    public record BarbershopResponse(Long id, String name, String address, String phone, String email, String description, LocalTime openTime, LocalTime closeTime, int slotDurationMinutes, boolean active) {}

    public record TimeSlot(LocalTime start, LocalTime end, boolean available) {}
    public record DashboardStats(long totalAppointments, long todayAppointments, long pendingAppointments, long totalBarbers) {}
    public record StatusRequest(AppointmentStatus status) {}
    public record PublicBarbershopInfo(Long id, String name, String address, String phone, String description) {}
}