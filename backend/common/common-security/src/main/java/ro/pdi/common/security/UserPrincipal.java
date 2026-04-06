package ro.pdi.common.security;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Set;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UserPrincipal {
    private String id;
    private String email;
    private String firstName;
    private String lastName;
    private String cnp;
    private UserType userType;
    private Set<String> roles;
    private Set<String> permissions;
    private boolean twoFactorEnabled;
}

enum UserType {
    PERSON, COMPANY, EMPLOYEE
}