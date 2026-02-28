package com.genbridge.backend.config;

import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.info.Contact;
import io.swagger.v3.oas.models.security.SecurityScheme;
import io.swagger.v3.oas.models.security.SecurityRequirement;
import io.swagger.v3.oas.models.Components;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

/**
 * OpenAPI/Swagger Configuration for GenBridge API Documentation
 * Access at: http://localhost:8080/swagger-ui.html
 */
@Configuration
public class OpenApiConfig {

        @Bean
        public OpenAPI genBridgeOpenAPI() {
                return new OpenAPI()
                                .info(new Info()
                                                .title("GenBridge API")
                                                .description("Self-Learning Platform for Gen-Alpha Culture - RESTful API Documentation")
                                                .version("v1.0")
                                                .contact(new Contact()
                                                                .name("GenBridge Team")
                                                                .email("team@genbridge.com")))
                                .addSecurityItem(new SecurityRequirement().addList("Bearer Authentication"))
                                .components(new Components()
                                                .addSecuritySchemes("Bearer Authentication",
                                                                new SecurityScheme()
                                                                                .type(SecurityScheme.Type.HTTP)
                                                                                .scheme("bearer")
                                                                                .bearerFormat("JWT")
                                                                                .description("Enter JWT token")));
        }
}
