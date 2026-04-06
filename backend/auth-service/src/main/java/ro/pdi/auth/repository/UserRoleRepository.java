package ro.pdi.auth.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import ro.pdi.auth.model.UserRole;
import ro.pdi.auth.model.User;
import ro.pdi.auth.model.Role;
import java.util.List;
import java.util.UUID;

@Repository
public interface UserRoleRepository extends JpaRepository<UserRole, UserRole.UserRoleId> {
    List<UserRole> findByUser(User user);
    List<UserRole> findByUserId(UUID userId);
    void deleteByUserAndRole(User user, Role role);
}