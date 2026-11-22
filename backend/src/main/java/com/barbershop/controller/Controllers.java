package com.barbershop.controller;

import com.barbershop.dto.Dtos.*;
import com.barbershop.exception.BusinessException;
import com.barbershop.model.*;
import com.barbershop.repository.*;
import jakarta.validation.Valid;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;
import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/services")
class ServiceController {
    private final ServiceRepository serviceRepo;
    private final BarbershopRepository shopRepo;
    ServiceController(ServiceRepository s, BarbershopRepository b) { serviceRepo = s; shopRepo = b; }

    @GetMapping("/shop/{shopId}")
    public List<ServiceResponse> getByShop(@PathVariable Long shopId) {
        return serviceRepo.findByBarbershopIdAndActiveTrue(shopId).stream().map(s ->
            new ServiceResponse(s.getId(), s.getName(), s.getDescription(), s.getPrice(), s.getDurationMinutes(), s.isActive())
        ).toList();
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN') and @authz.sameShop(#req.barbershopId())")
    public ResponseEntity<ServiceResponse> create(@Valid @RequestBody ServiceRequest req) {
        var shop = shopRepo.findById(req.barbershopId()).orElseThrow();
        var s = serviceRepo.save(Service.builder().name(req.name()).description(req.description())
            .price(req.price()).durationMinutes(req.durationMinutes()).active(true).barbershop(shop).build());
        return ResponseEntity.ok(new ServiceResponse(s.getId(), s.getName(), s.getDescription(), s.getPrice(), s.getDurationMinutes(), s.isActive()));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN') and @authz.ownsService(#id)")
    public ResponseEntity<ServiceResponse> update(@PathVariable Long id, @Valid @RequestBody ServiceRequest req) {
        var s = serviceRepo.findById(id).orElseThrow();
        s.setName(req.name()); s.setDescription(req.description());
        s.setPrice(req.price()); s.setDurationMinutes(req.durationMinutes());
        s = serviceRepo.save(s);
        return ResponseEntity.ok(new ServiceResponse(s.getId(), s.getName(), s.getDescription(), s.getPrice(), s.getDurationMinutes(), s.isActive()));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN') and @authz.ownsService(#id)")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        var s = serviceRepo.findById(id).orElseThrow();
        s.setActive(false); serviceRepo.save(s);
        return ResponseEntity.noContent().build();
    }
}

@RestController
@RequestMapping("/api/users")
class UserController {
    private final UserRepository userRepo;
    private final BarbershopRepository shopRepo;
    private final PasswordEncoder encoder;
    UserController(UserRepository u, BarbershopRepository b, PasswordEncoder e) { userRepo = u; shopRepo = b; encoder = e; }

    @GetMapping("/shop/{shopId}")
    @PreAuthorize("hasRole('ADMIN') and @authz.sameShop(#shopId)")
    public List<UserResponse> getByShop(@PathVariable Long shopId) {
        return userRepo.findByBarbershopId(shopId).stream().map(this::toResponse).toList();
    }

    @GetMapping("/shop/{shopId}/barbers")
    @PreAuthorize("hasRole('ADMIN') and @authz.sameShop(#shopId)")
    public List<UserResponse> getBarbers(@PathVariable Long shopId) {
        return userRepo.findByBarbershopIdAndRoleAndActiveTrue(shopId, Role.BARBER).stream().map(this::toResponse).toList();
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN') and @authz.sameShop(#req.barbershopId())")
    public ResponseEntity<UserResponse> create(@Valid @RequestBody UserRequest req) {
        if (req.password() == null || req.password().isBlank()) {
            throw new BusinessException("La contraseña es obligatoria");
        }
        var shop = shopRepo.findById(req.barbershopId()).orElseThrow();
        var u = userRepo.save(User.builder().username(req.username()).password(encoder.encode(req.password()))
            .fullName(req.fullName()).email(req.email()).phone(req.phone()).whatsapp(req.whatsapp())
            .role(req.role()).active(true).barbershop(shop).build());
        return ResponseEntity.ok(toResponse(u));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN') and @authz.ownsUser(#id)")
    public ResponseEntity<UserResponse> update(@PathVariable Long id, @Valid @RequestBody UserRequest req) {
        var u = userRepo.findById(id).orElseThrow();
        u.setFullName(req.fullName()); u.setEmail(req.email());
        u.setPhone(req.phone()); u.setWhatsapp(req.whatsapp());
        if (req.password() != null && !req.password().isBlank()) u.setPassword(encoder.encode(req.password()));
        u = userRepo.save(u);
        return ResponseEntity.ok(toResponse(u));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN') and @authz.ownsUser(#id)")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        var u = userRepo.findById(id).orElseThrow();
        u.setActive(false); userRepo.save(u);
        return ResponseEntity.noContent().build();
    }

    private UserResponse toResponse(User u) {
        return new UserResponse(u.getId(), u.getUsername(), u.getFullName(), u.getEmail(), u.getPhone(), u.getWhatsapp(), u.getRole(), u.isActive());
    }
}

@RestController
@RequestMapping("/api/barbershops")
class BarbershopController {
    private final BarbershopRepository shopRepo;
    BarbershopController(BarbershopRepository b) { shopRepo = b; }

    @GetMapping
    public List<BarbershopResponse> getAll() {
        return shopRepo.findAll().stream().map(this::toResponse).toList();
    }

    @GetMapping("/{id}")
    public ResponseEntity<BarbershopResponse> getById(@PathVariable Long id) {
        return shopRepo.findById(id).map(s -> ResponseEntity.ok(toResponse(s))).orElse(ResponseEntity.notFound().build());
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN') and @authz.sameShop(#id)")
    public ResponseEntity<BarbershopResponse> update(@PathVariable Long id, @Valid @RequestBody BarbershopRequest req) {
        var s = shopRepo.findById(id).orElseThrow();
        s.setName(req.name()); s.setAddress(req.address()); s.setPhone(req.phone());
        s.setEmail(req.email()); s.setDescription(req.description());
        s.setOpenTime(req.openTime()); s.setCloseTime(req.closeTime());
        s.setSlotDurationMinutes(req.slotDurationMinutes());
        return ResponseEntity.ok(toResponse(shopRepo.save(s)));
    }

    private BarbershopResponse toResponse(Barbershop s) {
        return new BarbershopResponse(s.getId(), s.getName(), s.getAddress(), s.getPhone(), s.getEmail(),
            s.getDescription(), s.getOpenTime(), s.getCloseTime(), s.getSlotDurationMinutes(), s.isActive());
    }
}

@RestController
@RequestMapping("/api/public")
class PublicController {
    private final BarbershopRepository shopRepo;
    private final ServiceRepository serviceRepo;
    private final UserRepository userRepo;
    private final com.barbershop.service.AppointmentService appointmentService;

    PublicController(BarbershopRepository b, ServiceRepository s, UserRepository u,
                      com.barbershop.service.AppointmentService appointmentService) {
        shopRepo = b; serviceRepo = s; userRepo = u; this.appointmentService = appointmentService;
    }

    @GetMapping("/barbershops")
    public List<PublicBarbershopInfo> getAll() {
        return shopRepo.findAll().stream().map(this::toInfo).toList();
    }

    @GetMapping("/barbershops/{id}")
    public ResponseEntity<PublicBarbershopInfo> getById(@PathVariable Long id) {
        return ResponseEntity.ok(toInfo(shopRepo.findById(id).orElseThrow()));
    }

    @GetMapping("/barbershops/{id}/services")
    public List<ServiceResponse> getServices(@PathVariable Long id) {
        return serviceRepo.findByBarbershopIdAndActiveTrue(id).stream().map(s ->
            new ServiceResponse(s.getId(), s.getName(), s.getDescription(), s.getPrice(), s.getDurationMinutes(), s.isActive())
        ).toList();
    }

    @GetMapping("/barbershops/{id}/barbers")
    public List<PublicBarberInfo> getBarbers(@PathVariable Long id) {
        return userRepo.findByBarbershopIdAndRoleAndActiveTrue(id, Role.BARBER).stream()
            .map(u -> new PublicBarberInfo(u.getId(), u.getFullName()))
            .toList();
    }

    @GetMapping("/slots")
    public ResponseEntity<List<TimeSlot>> getSlots(
            @RequestParam Long barberId, @RequestParam Long serviceId,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date,
            @RequestParam Long shopId) {
        return ResponseEntity.ok(appointmentService.getAvailableSlots(barberId, serviceId, date, shopId));
    }

    @PostMapping("/appointments")
    public ResponseEntity<AppointmentResponse> createAppointment(@Valid @RequestBody AppointmentRequest req) {
        return ResponseEntity.ok(appointmentService.create(req, null));
    }

    private PublicBarbershopInfo toInfo(Barbershop s) {
        return new PublicBarbershopInfo(s.getId(), s.getName(), s.getAddress(), s.getPhone(), s.getDescription());
    }
}