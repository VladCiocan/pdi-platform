package ro.pdi.auth.security;

import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import ro.pdi.auth.model.User;
import ro.pdi.auth.model.UserRole;
import ro.pdi.auth.repository.UserRepository;
import ro.pdi.auth.repository.UserRoleRepository;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class CustomUserDetailsService implements UserDetailsService {

    private final UserRepository userRepository;
    private final UserRoleRepository userRoleRepository;

    public CustomUserDetailsService(UserRepository userRepository, UserRoleRepository userRoleRepository) {
        this.userRepository = userRepository;
        this.userRoleRepository = userRoleRepository;
    }

    @Override
    @Transactional(readOnly = true)
    public UserDetails loadUserByUsername(String usernameOrId) throws UsernameNotFoundException {
        User user;

        try {
            UUID userId = UUID.fromString(usernameOrId);
            user = userRepository.findById(userId)
                    .orElseThrow(() -> new UsernameNotFoundException("User not found with id: " + usernameOrId));
        } catch (IllegalArgumentException e) {
            user = userRepository.findByEmail(usernameOrId)
                    .orElseThrow(() -> new UsernameNotFoundException("User not found with email: " + usernameOrId));
        }

        List<SimpleGrantedAuthority> authorities = userRoleRepository.findByUserId(user.getId()).stream()
                .map(ur -> new SimpleGrantedAuthority("ROLE_" + ur.getRole().getName()))
                .collect(Collectors.toList());

        return UserPrincipal.builder()
                .id(user.getId())
                .email(user.getEmail())
                .password(user.getPasswordHash())
                .firstName(user.getFirstName())
                .lastName(user.getLastName())
                .isActive(user.getIsActive())
                .isEmailVerified(user.getEmailVerified())
                .isTwoFactorEnabled(user.getTwoFactorEnabled())
                .enabled(user.getIsActive())
                .authorities(authorities)
                .build();
    }
}