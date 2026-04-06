package ro.pdi.auth;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.domain.EntityScan;
import org.springframework.cache.annotation.EnableCaching;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;
import org.springframework.scheduling.annotation.EnableAsync;

/**
 * Main application class for the PDI Auth Service.
 * 
 * This service handles all authentication and authorization operations
 * including user management, roles, permissions, and JWT token generation.
 * 
 * @author PDI Team
 * @version 1.0.0
 */
@SpringBootApplication
@EntityScan(basePackages = "ro.pdi.auth.model")
@EnableJpaAuditing
@EnableCaching
@EnableAsync
public class AuthServiceApplication {

    public static void main(String[] args) {
        SpringApplication.run(AuthServiceApplication.class, args);
    }
}