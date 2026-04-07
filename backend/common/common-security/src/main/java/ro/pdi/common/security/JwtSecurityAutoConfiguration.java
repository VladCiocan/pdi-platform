package ro.pdi.common.security;

import org.springframework.boot.autoconfigure.AutoConfiguration;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.context.annotation.ComponentScan;

@AutoConfiguration
@ConditionalOnProperty(name = "app.jwt.secret")
@ComponentScan(basePackages = "ro.pdi.common.security")
public class JwtSecurityAutoConfiguration {
}
