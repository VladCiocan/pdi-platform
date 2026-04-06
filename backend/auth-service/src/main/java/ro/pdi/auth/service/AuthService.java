package ro.pdi.auth.service;

import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import ro.pdi.auth.dto.*;
import ro.pdi.auth.model.User;
import ro.pdi.auth.model.Role;
import ro.pdi.auth.model.UserRole;
import ro.pdi.auth.repository.UserRepository;
import ro.pdi.auth.repository.RoleRepository;
import ro.pdi.auth.repository.UserRoleRepository;
import ro.pdi.auth.security.JwtTokenProvider;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class AuthService {

    private final AuthenticationManager authenticationManager;
    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final UserRoleRepository userRoleRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtTokenProvider tokenProvider;

    public AuthService(
            AuthenticationManager authenticationManager,
            UserRepository userRepository,
            RoleRepository roleRepository,
            UserRoleRepository userRoleRepository,
            PasswordEncoder passwordEncoder,
            JwtTokenProvider tokenProvider) {
        this.authenticationManager = authenticationManager;
        this.userRepository = userRepository;
        this.roleRepository = roleRepository;
        this.userRoleRepository = userRoleRepository;
        this.passwordEncoder = passwordEncoder;
        this.tokenProvider = tokenProvider;
    }

    @Transactional
    public AuthResponse login(LoginRequest request) {
        Authentication authentication;
        try {
            authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(
                            request.getEmail(),
                            request.getPassword()
                    )
            );
        } catch (AuthenticationException ex) {
            throw new RuntimeException("Invalid email or password");
        }

        SecurityContextHolder.getContext().setAuthentication(authentication);

        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new RuntimeException("User not found"));

        user.setLastLogin(LocalDateTime.now());
        userRepository.save(user);

        String accessToken = tokenProvider.generateAccessToken(authentication);
        String refreshToken = tokenProvider.generateRefreshToken(user.getId().toString());

        List<AuthResponse.RoleDTO> roles = userRoleRepository.findByUserId(user.getId()).stream()
                .map(ur -> AuthResponse.RoleDTO.builder()
                        .id(ur.getRole().getId())
                        .name(ur.getRole().getName())
                        .description(ur.getRole().getDescription())
                        .permissions(List.of())
                        .build())
                .collect(Collectors.toList());

        return AuthResponse.builder()
                .tokens(AuthResponse.TokensDTO.builder()
                        .accessToken(accessToken)
                        .refreshToken(refreshToken)
                        .expiresIn(3600)
                        .build())
                .user(AuthResponse.UserDTO.builder()
                        .id(user.getId())
                        .email(user.getEmail())
                        .firstName(user.getFirstName())
                        .lastName(user.getLastName())
                        .userType(user.getUserType().name())
                        .isActive(user.getIsActive())
                        .twoFactorEnabled(user.getTwoFactorEnabled())
                        .roles(roles)
                        .build())
                .requiresTwoFactor(false)
                .build();
    }

    @Transactional
    public AuthResponse register(RegisterRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("Email already in use");
        }

        if (request.getCnp() != null && userRepository.existsByCnp(request.getCnp())) {
            throw new RuntimeException("CNP already registered");
        }

        User user = User.builder()
                .email(request.getEmail())
                .passwordHash(passwordEncoder.encode(request.getPassword()))
                .firstName(request.getFirstName())
                .lastName(request.getLastName())
                .phone(request.getPhone())
                .cnp(request.getCnp())
                .userType(request.getUserType() != null ? request.getUserType() : User.UserType.PERSON)
                .isActive(true)
                .emailVerified(false)
                .phoneVerified(false)
                .twoFactorEnabled(false)
                .build();

        user = userRepository.save(user);

        Role defaultRole = roleRepository.findByName("CITIZEN")
                .orElseGet(() -> roleRepository.save(Role.builder()
                        .name("CITIZEN")
                        .description("Standard citizen role")
                        .isSystem(true)
                        .isActive(true)
                        .build()));

        UserRole userRole = UserRole.builder()
                .user(user)
                .role(defaultRole)
                .build();
        userRoleRepository.save(userRole);

        String accessToken = tokenProvider.generateAccessToken(
                user.getId().toString(),
                user.getEmail(),
                defaultRole.getName()
        );
        String refreshToken = tokenProvider.generateRefreshToken(user.getId().toString());

        return AuthResponse.builder()
                .tokens(AuthResponse.TokensDTO.builder()
                        .accessToken(accessToken)
                        .refreshToken(refreshToken)
                        .expiresIn(3600)
                        .build())
                .user(AuthResponse.UserDTO.builder()
                        .id(user.getId())
                        .email(user.getEmail())
                        .firstName(user.getFirstName())
                        .lastName(user.getLastName())
                        .userType(user.getUserType().name())
                        .isActive(user.getIsActive())
                        .twoFactorEnabled(user.getTwoFactorEnabled())
                        .roles(List.of(AuthResponse.RoleDTO.builder()
                                .id(defaultRole.getId())
                                .name(defaultRole.getName())
                                .description(defaultRole.getDescription())
                                .permissions(List.of())
                                .build()))
                        .build())
                .requiresTwoFactor(false)
                .build();
    }

    @Transactional
    public AuthResponse refreshToken(RefreshTokenRequest request) {
        String refreshToken = request.getRefreshToken();

        if (!tokenProvider.validateToken(refreshToken) || !tokenProvider.isRefreshToken(refreshToken)) {
            throw new RuntimeException("Invalid refresh token");
        }

        String userId = tokenProvider.getUserIdFromToken(refreshToken);
        User user = userRepository.findById(UUID.fromString(userId))
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (!user.getIsActive()) {
            throw new RuntimeException("User account is disabled");
        }

        List<UserRole> userRoles = userRoleRepository.findByUserId(user.getId());
        List<String> roleNames = userRoles.stream()
                .map(ur -> ur.getRole().getName())
                .collect(Collectors.toList());

        String newAccessToken = tokenProvider.generateAccessToken(
                user.getId().toString(),
                user.getEmail(),
                String.join(",", roleNames)
        );
        String newRefreshToken = tokenProvider.generateRefreshToken(user.getId().toString());

        List<AuthResponse.RoleDTO> roleDtos = userRoles.stream()
                .map(ur -> AuthResponse.RoleDTO.builder()
                        .id(ur.getRole().getId())
                        .name(ur.getRole().getName())
                        .description(ur.getRole().getDescription())
                        .permissions(List.of())
                        .build())
                .collect(Collectors.toList());

        return AuthResponse.builder()
                .tokens(AuthResponse.TokensDTO.builder()
                        .accessToken(newAccessToken)
                        .refreshToken(newRefreshToken)
                        .expiresIn(3600)
                        .build())
                .user(AuthResponse.UserDTO.builder()
                        .id(user.getId())
                        .email(user.getEmail())
                        .firstName(user.getFirstName())
                        .lastName(user.getLastName())
                        .userType(user.getUserType().name())
                        .isActive(user.getIsActive())
                        .twoFactorEnabled(user.getTwoFactorEnabled())
                        .roles(roleDtos)
                        .build())
                .requiresTwoFactor(false)
                .build();
    }

    public String extractUserIdFromToken(String token) {
        return tokenProvider.getUserIdFromToken(token);
    }

    public void logout(String userId) {
    }
}