package ro.pdi.auth.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import ro.pdi.auth.model.User;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

/**
 * Repository for User entity operations.
 */
@Repository
public interface UserRepository extends JpaRepository<User, UUID> {

    /**
     * Find user by email.
     */
    Optional<User> findByEmail(String email);

    /**
     * Find user by CNP (Personal Numerical Code).
     */
    Optional<User> findByCnp(String cnp);

    /**
     * Check if user exists by email.
     */
    boolean existsByEmail(String email);

    /**
     * Check if user exists by CNP.
     */
    boolean existsByCnp(String cnp);

    /**
     * Find active user by email.
     */
    @Query("SELECT u FROM User u WHERE u.email = :email AND u.isActive = true")
    Optional<User> findActiveUserByEmail(@Param("email") String email);

    /**
     * Find all active users.
     */
    List<User> findByIsActiveTrue();

    /**
     * Count active users.
     */
    long countByIsActiveTrue();

    /**
     * Count inactive users.
     */
    long countByIsActiveFalse();

    /**
     * Count users by user type.
     */
    long countByUserType(User.UserType userType);

    /**
     * Search users by name or email.
     */
    @Query("SELECT u FROM User u WHERE LOWER(u.firstName) LIKE LOWER(CONCAT('%', :query, '%')) " +
           "OR LOWER(u.lastName) LIKE LOWER(CONCAT('%', :query, '%')) " +
           "OR LOWER(u.email) LIKE LOWER(CONCAT('%', :query, '%'))")
    java.util.List<User> searchUsers(@Param("query") String query);
}