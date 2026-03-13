package com.barbershop.scheduler;

import com.barbershop.model.AppointmentStatus;
import com.barbershop.repository.AppointmentRepository;
import com.barbershop.service.WhatsAppService;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;
import java.time.LocalDate;

@Component
public class ReminderScheduler {

    private final AppointmentRepository appointmentRepo;
    private final WhatsAppService whatsAppService;

    public ReminderScheduler(AppointmentRepository appointmentRepo, WhatsAppService whatsAppService) {
        this.appointmentRepo = appointmentRepo;
        this.whatsAppService = whatsAppService;
    }

    @Scheduled(cron = "0 0 9 * * *")
    public void sendReminders() {
        LocalDate tomorrow = LocalDate.now().plusDays(1);
        var appointments = appointmentRepo.findByDateAndReminderSentFalseAndStatus(
            tomorrow, AppointmentStatus.CONFIRMED);
        appointments.forEach(a -> {
            try {
                whatsAppService.sendReminder(a);
                a.setReminderSent(true);
                appointmentRepo.save(a);
            } catch (Exception e) {
                System.err.println("Error sending reminder: " + e.getMessage());
            }
        });
        System.out.println("✅ Recordatorios enviados: " + appointments.size());
    }
}