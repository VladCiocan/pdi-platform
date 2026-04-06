package ro.pdi.auth.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;
import java.util.UUID;

/**
 * Authentication response DTO.
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AuthResponse {

    private TokensDTO tokens;

    private UserDTO user;

    private boolean requiresTwoFactor;

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class TokensDTO {
        private String accessToken;
        private String refreshToken;
        private long expiresIn;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class UserDTO {
        private UUID id;
        private String email;
        private String firstName;
        private String lastName;
        private String userType;
        private boolean isActive;
        private boolean twoFactorEnabled;
        private List<RoleDTO> roles;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class RoleDTO {
        private UUID id;
        private String name;
        private String description;
        private List<PermissionDTO> permissions;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class PermissionDTO {
        private String code;
        private String name;
        private String module;
    }
}
