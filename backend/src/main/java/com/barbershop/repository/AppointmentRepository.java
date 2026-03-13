package com.barbershop.repository;
import com.barbershop.model.Appointment;
import com.barbershop.model.AppointmentStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import java.time.LocalDate;
import java.util.List;
@Repository
public interface AppointmentRepository extends JpaRepository<Appointment, Long> {
    List<Appointment> findByBarbershopIdAndDate(Long shopId, LocalDate date);
    List<Appointment> findByBarberIdAndDate(Long barberId, LocalDate date);
    List<Appointment> findByBarbershopIdOrderByDateDescStartTimeDesc(Long shopId);
    List<Appointment> findByClientUserId(Long clientId);
    @Query("SELECT a FROM Appointment a WHERE a.barbershop.id = :shopId AND a.date >= :from ORDER BY a.date, a.startTime")
    List<Appointment> findUpcoming(Long shopId, LocalDate from);
    @Query("SELECT a FROM Appointment a WHERE a.date = :date AND a.reminderSent = false AND a.status = :status")
    List<Appointment> findByDateAndReminderSentFalseAndStatus(LocalDate date, AppointmentStatus status);
}