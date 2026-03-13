package com.barbershop.service;

import com.barbershop.dto.Dtos.*;
import com.barbershop.model.*;
import com.barbershop.repository.*;
import org.springframework.stereotype.Service;
import java.time.LocalDate;
import java.time.LocalTime;
import java.util.ArrayList;
import java.util.List;

@Service
public class AppointmentService {

    private final AppointmentRepository appointmentRepo;
    private final UserRepository userRepo;
    private final ServiceRepository serviceRepo;
    private final BarbershopRepository shopRepo;
    private final WhatsAppService whatsAppService;

    public AppointmentService(AppointmentRepository appointmentRepo, UserRepository userRepo,
                               ServiceRepository serviceRepo, BarbershopRepository shopRepo,
                               WhatsAppService whatsAppService) {
        this.appointmentRepo = appointmentRepo;
        this.userRepo = userRepo;
        this.serviceRepo = serviceRepo;
        this.shopRepo = shopRepo;
        this.whatsAppService = whatsAppService;
    }

    public AppointmentResponse create(AppointmentRequest req, User clientUser) {
        User barber = userRepo.findById(req.barberId()).orElseThrow();
        com.barbershop.model.Service service = serviceRepo.findById(req.serviceId()).orElseThrow();
        Barbershop shop = shopRepo.findById(req.barbershopId()).orElseThrow();

        Appointment a = Appointment.builder()
            .clientName(req.clientName())
            .clientPhone(req.clientPhone())
            .clientEmail(req.clientEmail())
            .clientWhatsapp(req.clientWhatsapp())
            .notes(req.notes())
            .date(req.date())
            .startTime(req.startTime())
            .endTime(req.startTime().plusMinutes(service.getDurationMinutes()))
            .status(AppointmentStatus.CONFIRMED)
            .barber(barber)
            .service(service)
            .barbershop(shop)
            .clientUser(clientUser)
            .build();

        a = appointmentRepo.save(a);
        try { whatsAppService.sendConfirmation(a); } catch (Exception ignored) {}
        return toResponse(a);
    }

    public List<AppointmentResponse> getByShop(Long shopId) {
        return appointmentRepo.findByBarbershopIdOrderByDateDescStartTimeDesc(shopId)
            .stream().map(this::toResponse).toList();
    }

    public List<AppointmentResponse> getUpcoming(Long shopId) {
        return appointmentRepo.findUpcoming(shopId, LocalDate.now())
            .stream().map(this::toResponse).toList();
    }

    public List<AppointmentResponse> getByDate(Long shopId, LocalDate date) {
        return appointmentRepo.findByBarbershopIdAndDate(shopId, date)
            .stream().map(this::toResponse).toList();
    }

    public List<AppointmentResponse> getMyAppointments(Long clientId) {
        return appointmentRepo.findByClientUserId(clientId)
            .stream().map(this::toResponse).toList();
    }

    public AppointmentResponse updateStatus(Long id, AppointmentStatus status) {
        Appointment a = appointmentRepo.findById(id).orElseThrow();
        a.setStatus(status);
        a = appointmentRepo.save(a);
        if (status == AppointmentStatus.CANCELLED) {
            try { whatsAppService.sendCancellation(a); } catch (Exception ignored) {}
        }
        return toResponse(a);
    }

    public void delete(Long id) { appointmentRepo.deleteById(id); }

    public List<TimeSlot> getAvailableSlots(Long barberId, Long serviceId, LocalDate date, Long shopId) {
        Barbershop shop = shopRepo.findById(shopId).orElseThrow();
        com.barbershop.model.Service service = serviceRepo.findById(serviceId).orElseThrow();
        List<Appointment> existing = appointmentRepo.findByBarberIdAndDate(barberId, date);

        List<TimeSlot> slots = new ArrayList<>();
        LocalTime current = shop.getOpenTime();
        LocalTime close = shop.getCloseTime();
        int duration = service.getDurationMinutes();

        while (!current.plusMinutes(duration).isAfter(close)) {
            final LocalTime slotStart = current;
            final LocalTime slotEnd = current.plusMinutes(duration);
            boolean occupied = existing.stream().anyMatch(a ->
                a.getStatus() != AppointmentStatus.CANCELLED &&
                !slotStart.isBefore(a.getStartTime()) && slotStart.isBefore(a.getEndTime()) ||
                !a.getStartTime().isBefore(slotStart) && a.getStartTime().isBefore(slotEnd)
            );
            slots.add(new TimeSlot(slotStart, slotEnd, !occupied));
            current = current.plusMinutes(shop.getSlotDurationMinutes());
        }
        return slots;
    }

    public DashboardStats getStats(Long shopId) {
        List<Appointment> all = appointmentRepo.findByBarbershopIdOrderByDateDescStartTimeDesc(shopId);
        long today = all.stream().filter(a -> a.getDate().equals(LocalDate.now())).count();
        long pending = all.stream().filter(a -> a.getStatus() == AppointmentStatus.PENDING).count();
        long barbers = userRepo.findByBarbershopIdAndRole(shopId, Role.BARBER).size();
        return new DashboardStats(all.size(), today, pending, barbers);
    }

    private AppointmentResponse toResponse(Appointment a) {
        return new AppointmentResponse(
            a.getId(), a.getClientName(), a.getClientPhone(), a.getClientEmail(), a.getClientWhatsapp(),
            a.getNotes(), a.getDate(), a.getStartTime(), a.getEndTime(), a.getStatus(), a.isReminderSent(),
            a.getBarber().getFullName(), a.getService().getName(),
            a.getService().getPrice(), a.getService().getDurationMinutes()
        );
    }
}