package com.aibusiness.auth.service;

import lombok.RequiredArgsConstructor;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class EmailService {

    private final JavaMailSender mailSender;

    public void sendPasswordResetEmail(String to, String name, String token) {
        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setTo(to);
            message.setSubject("Your Password Reset Code");
            message.setText("Hi " + name + ",\n\n"
                    + "Your password reset code is: " + token + "\n\n"
                    + "This code will expire in 1 hour.\n\n"
                    + "If you did not request a password reset, please ignore this email.\n\n"
                    + "Thanks,\n"
                    + "The AI Business Suite Team");
            mailSender.send(message);
        } catch (Exception e) {
            // In a real application, you'd have more robust error handling/logging
            throw new RuntimeException("Failed to send email", e);
        }
    }
}

