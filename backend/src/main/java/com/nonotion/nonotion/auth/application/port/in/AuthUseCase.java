package com.nonotion.nonotion.auth.application.port.in;

import com.nonotion.nonotion.auth.application.dto.AuthResponse;
import com.nonotion.nonotion.auth.application.dto.ForgotPasswordRequest;
import com.nonotion.nonotion.auth.application.dto.LoginRequest;
import com.nonotion.nonotion.auth.application.dto.RegisterRequest;
import com.nonotion.nonotion.auth.application.dto.ResetPasswordRequest;
import com.nonotion.nonotion.auth.application.dto.UserResponse;
import com.nonotion.nonotion.auth.application.dto.VerifyEmailRequest;

public interface AuthUseCase {

    AuthResponse register(RegisterRequest request);

    AuthResponse login(LoginRequest request);

    AuthResponse refresh(String rawRefreshToken);

    void logout(String email);

    void verifyEmail(VerifyEmailRequest request);

    void forgotPassword(ForgotPasswordRequest request);

    void resetPassword(ResetPasswordRequest request);

    UserResponse me(String email);
}
