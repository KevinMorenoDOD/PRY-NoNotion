package com.nonotion.nonotion.auth.interfaces;

import com.nonotion.nonotion.auth.application.port.in.AuthUseCase;
import com.nonotion.nonotion.auth.application.dto.AuthResponse;
import com.nonotion.nonotion.auth.application.dto.ForgotPasswordRequest;
import com.nonotion.nonotion.auth.application.dto.LoginRequest;
import com.nonotion.nonotion.auth.application.dto.RefreshTokenRequest;
import com.nonotion.nonotion.auth.application.dto.RegisterRequest;
import com.nonotion.nonotion.auth.application.dto.ResetPasswordRequest;
import com.nonotion.nonotion.auth.application.dto.UserResponse;
import com.nonotion.nonotion.auth.application.dto.VerifyEmailRequest;
import com.nonotion.nonotion.shared.security.CurrentUser;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import java.util.Optional;

@RestController
@RequestMapping("/api/v1/auth")
public class AuthController {

    private final AuthUseCase authUseCase;
    private final CurrentUser currentUser;

    public AuthController(AuthUseCase authUseCase, CurrentUser currentUser) {
        this.authUseCase = authUseCase;
        this.currentUser = currentUser;
    }

    @PostMapping("/register")
    @ResponseStatus(HttpStatus.CREATED)
    public AuthResponse register(@Valid @RequestBody RegisterRequest request) {
        return authUseCase.register(request);
    }

    @PostMapping("/login")
    public AuthResponse login(@Valid @RequestBody LoginRequest request) {
        return authUseCase.login(request);
    }

    @PostMapping("/refresh")
    public AuthResponse refresh(@Valid @RequestBody RefreshTokenRequest request) {
        return authUseCase.refresh(request.refreshToken());
    }

    @PostMapping("/logout")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void logout() {
        currentUser.getEmail().ifPresent(authUseCase::logout);
    }

    @PostMapping("/verify-email")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void verifyEmail(@Valid @RequestBody VerifyEmailRequest request) {
        authUseCase.verifyEmail(request);
    }

    @PostMapping("/forgot-password")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void forgotPassword(@Valid @RequestBody ForgotPasswordRequest request) {
        authUseCase.forgotPassword(request);
    }

    @PostMapping("/reset-password")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void resetPassword(@Valid @RequestBody ResetPasswordRequest request) {
        authUseCase.resetPassword(request);
    }

    @GetMapping("/me")
    public UserResponse me() {
        Optional<String> email = currentUser.getEmail();
        return email.map(authUseCase::me)
                .orElseThrow(() -> new IllegalArgumentException("Not authenticated"));
    }
}
