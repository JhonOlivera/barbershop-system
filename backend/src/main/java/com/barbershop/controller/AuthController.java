package com.barbershop.controller;

import com.barbershop.config.UserDetailsConfig;
import com.barbershop.dto.Dtos.*;
import com.barbershop.model.Role;
import com.barbershop.model.User;
import com.barbershop.repository.BarbershopRepository;
import com.barbershop.repository.UserRepository;
import com.barbershop.security.JwtService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthenticationManager authManager;
    private final JwtService jwtService;
    private final UserRepository userRepo;
    private final BarbershopRepository shopRepo;
    private final PasswordEncoder encoder;
    private final UserDetailsService userDetailsService;

    public AuthController(AuthenticationManager authManager, JwtService jwtService,
                          UserRepository userRepo, BarbershopRepository shopRepo,
                          PasswordEncoder encoder, UserDetailsService userDetailsService) {
        this.authManager = authManager;
        this.jwtService = jwtService;
        this.userRepo = userRepo;
        this.shopRepo = shopRepo;
        this.encoder = encoder;
        this.userDetailsService = userDetailsService;
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest req) {
        authManager.authenticate(new UsernamePasswordAuthenticationToken(req.username(), req.password()));
        User user = userRepo.findByUsername(req.username()).orElseThrow();
        String token = jwtService.generateToken(req.username());
        return ResponseEntity.ok(new LoginResponse(token, user.getUsername(), user.getFullName(),
            user.getRole(), user.getBarbershop() != null ? user.getBarbershop().getId() : null));
    }

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody RegisterRequest req) {
        if (userRepo.existsByUsername(req.username()))
            return ResponseEntity.badRequest().body("Username already exists");
        var shop = req.barbershopId() != null ? shopRepo.findById(req.barbershopId()).orElse(null) : null;
        User user = User.builder()
            .username(req.username())
            .password(encoder.encode(req.password()))
            .fullName(req.fullName())
            .email(req.email())
            .phone(req.phone())
            .whatsapp(req.whatsapp())
            .role(Role.CLIENT)
            .active(true)
            .barbershop(shop)
            .build();
        userRepo.save(user);
        return ResponseEntity.ok("Registered successfully");
    }

    @GetMapping("/me")
    public ResponseEntity<?> me(@RequestHeader("Authorization") String header) {
        String token = header.substring(7);
        String username = jwtService.extractUsername(token);
        User user = userRepo.findByUsername(username).orElseThrow();
        return ResponseEntity.ok(new LoginResponse(token, user.getUsername(), user.getFullName(),
            user.getRole(), user.getBarbershop() != null ? user.getBarbershop().getId() : null));
    }
}