package com.nonotion.nonotion.shared.security;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import java.util.Optional;

@Component
public class CurrentUser {

    private Authentication getAuthentication() {
        return SecurityContextHolder.getContext().getAuthentication();
    }

    public Optional<String> getUserId(){

        Authentication authentication = getAuthentication();
        if (authentication == null) {
            return Optional.empty();
        }
        return Optional.ofNullable((String) authentication.getPrincipal());
    }

    public Optional<String> getEmail(){
        return getUserId();
    }

    public boolean isAutenticated(){
        Authentication authentication = getAuthentication();
        return authentication != null && !authentication.getAuthorities().isEmpty();
    }

}
