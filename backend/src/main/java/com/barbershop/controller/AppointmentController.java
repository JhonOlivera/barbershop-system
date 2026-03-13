package com.barbershop.controller;

import com.barbershop.dto.Dtos.*;
import com.barbershop.model.AppointmentStatus;
import com.barbershop.model.User;
import com.barbershop.repository.UserRepository;
import com.barbershop.service.AppointmentService;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;
import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/appointments")
public class AppointmentController {

    private final AppointmentService appointmentService;
    private final UserRepository userRepo;

    public AppointmentController(AppointmentService appointmentService, UserRepository userRepo) {
        this.appointmentService = appointmentService;
        this.userRepo = userRepo;
    }

    @PostMapping
    public ResponseEntity<AppointmentResponse> create(@RequestBody AppointmentRequest req,
            @AuthenticationPrincipal UserDetails userDetails) {
        User user = userRepo.findByUsername(userDetails.getUsername()).orElseThrow();
        return ResponseEntity.ok(appointmentService.create(req, user));
    }

    @PostMapping("/public")
    public ResponseEntity<AppointmentResponse> createPublic(@RequestBody AppointmentRequest req) {
        return ResponseEntity.ok(appointmentService.create(req, null));
    }

    @GetMapping("/shop/{shopId}")
    public ResponseEntity<List<AppointmentResponse>> getByShop(@PathVariable Long shopId) {
        return ResponseEntity.ok(appointmentService.getByShop(shopId));
    }

    @GetMapping("/shop/{shopId}/upcoming")
    public ResponseEntity<List<AppointmentResponse>> getUpcoming(@PathVariable Long shopId) {
        return ResponseEntity.ok(appointmentService.getUpcoming(shopId));
    }

    @GetMapping("/shop/{shopId}/date/{date}")
    public ResponseEntity<List<AppointmentResponse>> getByDate(@PathVariable Long shopId,
            @PathVariable @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date) {
        return ResponseEntity.ok(appointmentService.getByDate(shopId, date));
    }

    @GetMapping("/my")
    public ResponseEntity<List<AppointmentResponse>> getMyAppointments(
            @AuthenticationPrincipal UserDetails userDetails) {
        User user = userRepo.findByUsername(userDetails.getUsername()).orElseThrow();
        return ResponseEntity.ok(appointmentService.getMyAppointments(user.getId()));
    }

    @PatchMapping("/{id}/status")
    public ResponseEntity<AppointmentResponse> updateStatus(@PathVariable Long id,
            @RequestBody StatusRequest req) {
        return ResponseEntity.ok(appointmentService.updateStatus(id, req.status()));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        appointmentService.delete(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/slots")
    public ResponseEntity<List<TimeSlot>> getSlots(
            @RequestParam Long barberId, @RequestParam Long serviceId,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date,
            @RequestParam Long shopId) {
        return ResponseEntity.ok(appointmentService.getAvailableSlots(barberId, serviceId, date, shopId));
    }

    @GetMapping("/stats/{shopId}")
    public ResponseEntity<DashboardStats> getStats(@PathVariable Long shopId) {
        return ResponseEntity.ok(appointmentService.getStats(shopId));
    }
}