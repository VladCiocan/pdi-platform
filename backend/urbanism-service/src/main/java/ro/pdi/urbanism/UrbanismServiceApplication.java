package ro.pdi.urbanism;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;

@SpringBootApplication
@EnableJpaAuditing
public class UrbanismServiceApplication {
    public static void main(String[] args) {
        SpringApplication.run(UrbanismServiceApplication.class, args);
    }
}