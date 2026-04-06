package ro.pdi.dms;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;

@SpringBootApplication
@EnableJpaAuditing
public class DmsServiceApplication {
    public static void main(String[] args) {
        SpringApplication.run(DmsServiceApplication.class, args);
    }
}