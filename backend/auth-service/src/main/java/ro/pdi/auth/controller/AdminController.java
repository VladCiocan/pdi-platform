package ro.pdi.auth.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import ro.pdi.auth.dto.ChangePasswordRequest;
import ro.pdi.auth.dto.UpdateProfileRequest;
import ro.pdi.auth.dto.UpdateUserRequest;
import ro.pdi.auth.model.User;
import ro.pdi.auth.service.SettingsService;
import ro.pdi.auth.service.UserService;

import java.util.List;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/auth")
@RequiredArgsConstructor
@Tag(name = "Administrare", description = "Operatii de administrare utilizatori, profil si setari")
public class AdminController {

    private final UserService userService;
    private final SettingsService settingsService;
    private final ro.pdi.auth.repository.UserRepository userRepository;

    private UUID getCurrentUserId() {
        String principal = SecurityContextHolder.getContext().getAuthentication().getName();
        try {
            return UUID.fromString(principal);
        } catch (IllegalArgumentException e) {
            // principal is email, not UUID - look up user
            return userRepository.findByEmail(principal)
                    .orElseThrow(() -> new RuntimeException("User not found"))
                    .getId();
        }
    }

    @Operation(summary = "Lista toti utilizatorii activi")
    @GetMapping("/users")
    public ResponseEntity<List<User>> getAllUsers() {
        return ResponseEntity.ok(userService.getAllUsers());
    }

    @Operation(summary = "Obtine utilizator dupa ID")
    @GetMapping("/users/{id}")
    public ResponseEntity<User> getUserById(@PathVariable UUID id) {
        return ResponseEntity.ok(userService.getUserById(id));
    }

    @Operation(summary = "Actualizare utilizator de catre admin")
    @PutMapping("/users/{id}")
    public ResponseEntity<User> updateUser(@PathVariable UUID id, @RequestBody UpdateUserRequest request) {
        return ResponseEntity.ok(userService.updateUser(id, request));
    }

    @Operation(summary = "Dezactivare utilizator (soft delete)")
    @DeleteMapping("/users/{id}")
    public ResponseEntity<Void> deactivateUser(@PathVariable UUID id) {
        userService.deactivateUser(id);
        return ResponseEntity.noContent().build();
    }

    @Operation(summary = "Actualizare profil propriu")
    @PutMapping("/profile")
    public ResponseEntity<User> updateProfile(@RequestBody UpdateProfileRequest request) {
        UUID userId = getCurrentUserId();
        return ResponseEntity.ok(userService.updateProfile(userId, request));
    }

    @Operation(summary = "Schimbare parola proprie")
    @PostMapping("/change-password")
    public ResponseEntity<Void> changePassword(@RequestBody ChangePasswordRequest request) {
        UUID userId = getCurrentUserId();
        userService.changePassword(userId, request.getCurrentPassword(), request.getNewPassword());
        return ResponseEntity.ok().build();
    }

    @Operation(summary = "Statistici sistem")
    @GetMapping("/stats")
    public ResponseEntity<Map<String, Object>> getStats() {
        return ResponseEntity.ok(userService.getStats());
    }

    @Operation(summary = "Obtine setari pentru o categorie")
    @GetMapping("/settings/{category}")
    public ResponseEntity<Map<String, String>> getSettings(@PathVariable String category) {
        return ResponseEntity.ok(settingsService.getSettings(category));
    }

    @Operation(summary = "Salveaza setari pentru o categorie")
    @PutMapping("/settings/{category}")
    public ResponseEntity<Void> saveSettings(@PathVariable String category, @RequestBody Map<String, String> settings) {
        settingsService.saveSettings(category, settings);
        return ResponseEntity.ok().build();
    }
}
