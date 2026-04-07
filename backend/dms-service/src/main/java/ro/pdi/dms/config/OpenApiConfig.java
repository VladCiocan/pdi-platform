package ro.pdi.dms.config;

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
                        .title("DMS Service API")
                        .version("1.0.0")
                        .description("Serviciu de management documente - foldere, documente, versiuni, metadate")
                        .contact(new Contact()
                                .name("PDI Platform")
                                .email("contact@pdi-nucet.ro")));
    }
}
