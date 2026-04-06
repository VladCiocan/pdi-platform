package ro.pdi.auth.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import ro.pdi.auth.model.Role;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

/**
 * Repository for Role entity operations.
 */
@Repository
public interface RoleRepository extends JpaRepository<Role, UUID> {

    /**
     * Find role by name.
     */
    Optional<Role> findByName(String name);

    /**
     * Find all active roles.
     */
    List<Role> findByIsActiveTrue();

    /**
     * Find system roles.
     */
    @Query("SELECT r FROM Role r WHERE r.isSystem = true")
    List<Role> findSystemRoles();

    /**
     * Check if role exists by name.
     */
    boolean existsByName(String name);
}