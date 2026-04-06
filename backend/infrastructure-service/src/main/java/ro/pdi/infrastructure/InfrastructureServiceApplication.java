package ro.pdi.infrastructure;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;

@SpringBootApplication
@EnableJpaAuditing
public class InfrastructureServiceApplication {
    public static void main(String[] args) {
        SpringApplication.run(InfrastructureServiceApplication.class, args);
    }
}