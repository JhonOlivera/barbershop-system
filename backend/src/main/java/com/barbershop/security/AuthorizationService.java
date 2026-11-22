package com.barbershop.security;

import com.barbershop.model.User;
import com.barbershop.repository.AppointmentRepository;
import com.barbershop.repository.ServiceRepository;
import com.barbershop.repository.UserRepository;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;

@Component("authz")
public class AuthorizationService {

    private final UserRepository userRepo;
    private final ServiceRepository serviceRepo;
    private final AppointmentRepository appointmentRepo;

    public AuthorizationService(UserRepository userRepo, ServiceRepository serviceRepo,
                                 AppointmentRepository appointmentRepo) {
        this.userRepo = userRepo;
        this.serviceRepo = serviceRepo;
        this.appointmentRepo = appointmentRepo;
    }

    public User currentUser() {
        var auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth == null) throw new AccessDeniedException("Not authenticated");
        return userRepo.findByUsername(auth.getName())
            .orElseThrow(() -> new AccessDeniedException("Not authenticated"));
    }

    public boolean sameShop(Long shopId) {
        if (shopId == null) return false;
        User user = currentUser();
        return user.getBarbershop() != null && user.getBarbershop().getId().equals(shopId);
    }

    public boolean ownsService(Long serviceId) {
        return serviceRepo.findById(serviceId)
            .map(s -> s.getBarbershop() != null && sameShop(s.getBarbershop().getId()))
            .orElse(false);
    }

    public boolean ownsUser(Long userId) {
        return userRepo.findById(userId)
            .map(u -> u.getBarbershop() != null && sameShop(u.getBarbershop().getId()))
            .orElse(false);
    }

    public boolean ownsAppointment(Long appointmentId) {
        return appointmentRepo.findById(appointmentId)
            .map(a -> a.getBarbershop() != null && sameShop(a.getBarbershop().getId()))
            .orElse(false);
    }
}
