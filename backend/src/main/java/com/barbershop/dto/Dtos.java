package com.barbershop.dto;
import com.barbershop.model.AppointmentStatus;
import com.barbershop.model.Role;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.FutureOrPresent;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

public class Dtos {
    public record LoginRequest(@NotBlank String username, @NotBlank String password) {}
    public record LoginResponse(String token, String username, String fullName, Role role, Long barbershopId) {}
    public record RegisterRequest(
        @NotBlank String username, @NotBlank String password, @NotBlank String fullName,
        @NotBlank @Email String email, String phone, String whatsapp, Long barbershopId
    ) {}

    public record AppointmentRequest(
        @NotBlank String clientName, @NotBlank String clientPhone, @Email String clientEmail, String clientWhatsapp,
        String notes,
        @NotNull @FutureOrPresent LocalDate date,
        @NotNull LocalTime startTime,
        @NotNull @Positive Long barberId, @NotNull @Positive Long serviceId, @NotNull @Positive Long barbershopId
    ) {}

    public record AppointmentResponse(
        Long id, String clientName, String clientPhone, String clientEmail, String clientWhatsapp,
        String notes, LocalDate date, LocalTime startTime, LocalTime endTime,
        AppointmentStatus status, boolean reminderSent,
        String barberName, String serviceName, BigDecimal servicePrice, int serviceDuration
    ) {}

    public record ServiceRequest(
        @NotBlank String name, String description,
        @NotNull @Positive BigDecimal price, @Positive int durationMinutes,
        @NotNull @Positive Long barbershopId
    ) {}
    public record ServiceResponse(Long id, String name, String description, BigDecimal price, int durationMinutes, boolean active) {}

    public record UserRequest(
        @NotBlank String username, String password, @NotBlank String fullName,
        @Email String email, String phone, String whatsapp,
        @NotNull Role role, @NotNull @Positive Long barbershopId
    ) {}
    public record UserResponse(Long id, String username, String fullName, String email, String phone, String whatsapp, Role role, boolean active) {}

    public record BarbershopRequest(
        @NotBlank String name, String address, String phone, @Email String email, String description,
        @NotNull LocalTime openTime, @NotNull LocalTime closeTime, @Positive int slotDurationMinutes
    ) {}
    public record BarbershopResponse(Long id, String name, String address, String phone, String email, String description, LocalTime openTime, LocalTime closeTime, int slotDurationMinutes, boolean active) {}

    public record TimeSlot(LocalTime start, LocalTime end, boolean available) {}
    public record DashboardStats(long totalAppointments, long todayAppointments, long pendingAppointments, long totalBarbers) {}
    public record StatusRequest(@NotNull AppointmentStatus status) {}
    public record PublicBarbershopInfo(Long id, String name, String address, String phone, String description) {}
    public record PublicBarberInfo(Long id, String fullName) {}
}