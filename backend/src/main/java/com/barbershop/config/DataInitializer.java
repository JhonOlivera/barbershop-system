package com.barbershop.config;

import com.barbershop.model.*;
import com.barbershop.repository.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;
import java.math.BigDecimal;
import java.time.LocalTime;

@Configuration
public class DataInitializer {

    private static final Logger log = LoggerFactory.getLogger(DataInitializer.class);

    @Value("${app.admin-password}")
    private String adminPassword;

    @Value("${app.seed-demo}")
    private boolean seedDemo;

    @Bean
    CommandLineRunner initData(BarbershopRepository shopRepo, UserRepository userRepo,
                               ServiceRepository serviceRepo, PasswordEncoder encoder) {
        return args -> {
            if (shopRepo.count() > 0) return;

            Barbershop shop = Barbershop.builder()
                .name("BarberBook Demo")
                .address("Calle 50 #20-30, Bogotá")
                .phone("3001234567")
                .email("info@barberbook.com")
                .description("La mejor barbería de la ciudad")
                .openTime(LocalTime.of(9, 0))
                .closeTime(LocalTime.of(20, 0))
                .slotDurationMinutes(30)
                .active(true)
                .build();
            shop = shopRepo.save(shop);

            if (adminPassword == null || adminPassword.isBlank()) {
                log.warn("ADMIN_PASSWORD no está configurada; no se creará el usuario admin.");
            } else {
                userRepo.save(User.builder().username("admin").password(encoder.encode(adminPassword))
                    .fullName("Administrador").email("admin@barberbook.com").role(Role.ADMIN)
                    .active(true).barbershop(shop).build());
            }

            if (!seedDemo) {
                log.info("SEED_DEMO=false; se omiten los barberos y servicios de demostración.");
                return;
            }

            userRepo.save(User.builder().username("carlos").password(encoder.encode("carlos123"))
                .fullName("Carlos Barbero").email("carlos@barberbook.com").phone("3009876543")
                .role(Role.BARBER).active(true).barbershop(shop).build());

            userRepo.save(User.builder().username("miguel").password(encoder.encode("miguel123"))
                .fullName("Miguel Estilista").email("miguel@barberbook.com").phone("3007654321")
                .role(Role.BARBER).active(true).barbershop(shop).build());

            serviceRepo.save(Service.builder().name("Corte de Cabello").description("Corte clásico o moderno")
                .price(new BigDecimal("25000")).durationMinutes(30).active(true).barbershop(shop).build());
            serviceRepo.save(Service.builder().name("Arreglo de Barba").description("Perfilado y arreglo")
                .price(new BigDecimal("15000")).durationMinutes(20).active(true).barbershop(shop).build());
            serviceRepo.save(Service.builder().name("Corte + Barba").description("Servicio completo")
                .price(new BigDecimal("35000")).durationMinutes(50).active(true).barbershop(shop).build());
            serviceRepo.save(Service.builder().name("Afeitado Clásico").description("Afeitado con navaja")
                .price(new BigDecimal("20000")).durationMinutes(30).active(true).barbershop(shop).build());

            log.info("Datos demo inicializados correctamente");
        };
    }
}
