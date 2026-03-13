package com.barbershop.service;

import com.barbershop.model.Appointment;
import com.twilio.Twilio;
import com.twilio.rest.api.v2010.account.Message;
import com.twilio.type.PhoneNumber;
import jakarta.annotation.PostConstruct;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

@Service
public class WhatsAppService {

    @Value("${twilio.account-sid}") private String accountSid;
    @Value("${twilio.auth-token}") private String authToken;
    @Value("${twilio.whatsapp-from}") private String from;

    @PostConstruct
    public void init() {
        Twilio.init(accountSid, authToken);
    }

    public void sendConfirmation(Appointment a) {
        String to = a.getClientWhatsapp();
        if (to == null || to.isBlank()) return;
        String msg = String.format(
            "✅ *Cita Confirmada - BarberBook*\n\nHola %s!\nTu cita ha sido confirmada.\n\n📅 Fecha: %s\n⏰ Hora: %s\n✂️ Servicio: %s\n👨 Barbero: %s\n\n¡Te esperamos!",
            a.getClientName(), a.getDate(), a.getStartTime(),
            a.getService().getName(), a.getBarber().getFullName()
        );
        send(to, msg);
    }

    public void sendReminder(Appointment a) {
        String to = a.getClientWhatsapp();
        if (to == null || to.isBlank()) return;
        String msg = String.format(
            "⏰ *Recordatorio - BarberBook*\n\nHola %s!\nTe recordamos tu cita mañana.\n\n📅 Fecha: %s\n⏰ Hora: %s\n✂️ Servicio: %s\n👨 Barbero: %s",
            a.getClientName(), a.getDate(), a.getStartTime(),
            a.getService().getName(), a.getBarber().getFullName()
        );
        send(to, msg);
    }

    public void sendCancellation(Appointment a) {
        String to = a.getClientWhatsapp();
        if (to == null || to.isBlank()) return;
        String msg = String.format(
            "❌ *Cita Cancelada - BarberBook*\n\nHola %s!\nTu cita del %s a las %s ha sido cancelada.\n\nPuedes reagendar cuando gustes.",
            a.getClientName(), a.getDate(), a.getStartTime()
        );
        send(to, msg);
    }

    private void send(String to, String body) {
        try {
            if (!to.startsWith("whatsapp:")) to = "whatsapp:+" + to.replaceAll("[^0-9]", "");
            Message.creator(new PhoneNumber(to), new PhoneNumber(from), body).create();
        } catch (Exception e) {
            System.err.println("WhatsApp error: " + e.getMessage());
        }
    }
}