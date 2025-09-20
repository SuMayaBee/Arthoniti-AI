package com.aibusiness.auth.service;

import com.aibusiness.auth.dto.*;
import com.aibusiness.auth.entity.PasswordResetToken;
import com.aibusiness.auth.entity.User;
import com.aibusiness.auth.exception.UserNotFoundException;
import com.aibusiness.auth.repository.PasswordResetTokenRepository;
import com.aibusiness.auth.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.time.ZonedDateTime;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordResetTokenRepository tokenRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;
    private final EmailService emailService;
    private final StorageService storageService;

    @Transactional
    public UserDto signup(RegisterRequest request) {
        if (userRepository.findByEmail(request.getEmail()).isPresent()) {
            throw new IllegalStateException("Email is already registered");
        }
        User user = User.builder()
                .name(request.getName())
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .build();
        User savedUser = userRepository.save(user);
        return mapUserToDto(savedUser);
    }

    public AuthResponse signin(LoginRequest request) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword())
        );
        var user = userRepository.findByEmail(request.getEmail()).orElseThrow(() -> new BadCredentialsException("Incorrect email or password"));
        var jwtToken = jwtService.generateToken(user);
        return AuthResponse.builder().accessToken(jwtToken).build();
    }

    @Transactional
    public void forgotPassword(String email) {
        userRepository.findByEmail(email).ifPresent(user -> {
            tokenRepository.findByUser(user).ifPresent(tokenRepository::delete); // Invalidate old token
            String token = UUID.randomUUID().toString().substring(0, 6).toUpperCase();
            PasswordResetToken resetToken = new PasswordResetToken(token, user);
            tokenRepository.save(resetToken);
            emailService.sendPasswordResetEmail(user.getEmail(), user.getName(), token);
        });
    }

    public ValidateTokenResponse validateResetToken(String token) {
        PasswordResetToken resetToken = tokenRepository.findByToken(token)
                .orElseThrow(() -> new IllegalStateException("Invalid or expired reset token"));
        if (resetToken.getExpiryDate().isBefore(ZonedDateTime.now())) {
            tokenRepository.delete(resetToken);
            throw new IllegalStateException("Invalid or expired reset token");
        }
        return new ValidateTokenResponse(true, "Token is valid", mapUserToDto(resetToken.getUser()));
    }

    @Transactional
    public UserDto resetPassword(String token, String newPassword) {
        PasswordResetToken resetToken = tokenRepository.findByToken(token)
                .orElseThrow(() -> new IllegalStateException("Invalid or expired reset token"));
        if (resetToken.getExpiryDate().isBefore(ZonedDateTime.now())) {
            tokenRepository.delete(resetToken);
            throw new IllegalStateException("Invalid or expired reset token");
        }
        User user = resetToken.getUser();
        user.setPassword(passwordEncoder.encode(newPassword));
        userRepository.save(user);
        tokenRepository.delete(resetToken);
        return mapUserToDto(user);
    }

    public UserDto getCurrentUserProfile() {
        User user = (User) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        return userRepository.findByEmail(user.getEmail())
                .map(this::mapUserToDto)
                .orElseThrow(() -> new UserNotFoundException("User not found"));
    }
    
    @Transactional
    public UserDto updateProfile(UpdateProfileRequest request) {
        User currentUser = (User) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        User user = userRepository.findByEmail(currentUser.getEmail())
                .orElseThrow(() -> new UserNotFoundException("User not found"));
        user.setName(request.getName());
        user.setImageUrl(request.getImageUrl());
        return mapUserToDto(userRepository.save(user));
    }
    
    @Transactional
    public void changePassword(ChangePasswordRequest request) {
        User currentUser = (User) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        User user = userRepository.findByEmail(currentUser.getEmail())
                .orElseThrow(() -> new UserNotFoundException("User not found"));
        if (!passwordEncoder.matches(request.getCurrentPassword(), user.getPassword())) {
            throw new BadCredentialsException("Current password is incorrect");
        }
        user.setPassword(passwordEncoder.encode(request.getNewPassword()));
        userRepository.save(user);
    }

    @Transactional
    public UserDto uploadProfileImage(MultipartFile file) throws IOException {
        User currentUser = (User) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        User user = userRepository.findByEmail(currentUser.getEmail())
                .orElseThrow(() -> new UserNotFoundException("User not found"));
        
        String fileName = "user-images/" + user.getId() + "/" + file.getOriginalFilename();
        String imageUrl = storageService.uploadFile(fileName, file);

        user.setImageUrl(imageUrl);
        return mapUserToDto(userRepository.save(user));
    }

    private UserDto mapUserToDto(User user) {
        return new UserDto(user.getId(), user.getEmail(), user.getName(), user.getImageUrl(), user.isActive(), user.getCreatedAt(), user.getUpdatedAt());
    }
}

