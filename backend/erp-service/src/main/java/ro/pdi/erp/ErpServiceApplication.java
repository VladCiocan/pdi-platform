package ro.pdi.erp;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;

@SpringBootApplication
@EnableJpaAuditing
public class ErpServiceApplication {
    public static void main(String[] args) {
        SpringApplication.run(ErpServiceApplication.class, args);
    }
}