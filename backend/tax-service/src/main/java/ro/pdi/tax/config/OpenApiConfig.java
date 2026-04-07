package ro.pdi.tax.config;

import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.info.Contact;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class OpenApiConfig {

    @Bean
    public OpenAPI customOpenAPI() {
        return new OpenAPI()
                .info(new Info()
                        .title("Tax Service API")
                        .version("1.0.0")
                        .description("Serviciu de taxe si impozite locale - proprietati, declaratii, obligatii, plati")
                        .contact(new Contact()
                                .name("PDI Platform")
                                .email("contact@pdi-nucet.ro")));
    }
}
