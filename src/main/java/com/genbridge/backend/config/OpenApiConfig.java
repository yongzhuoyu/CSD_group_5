package com.genbridge.backend.config;

import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.info.Contact;
import io.swagger.v3.oas.models.info.License;
import io.swagger.v3.oas.models.security.SecurityScheme;
import io.swagger.v3.oas.models.security.SecurityRequirement;
import io.swagger.v3.oas.models.Components;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

/**
 * OpenAPI/Swagger Configuration for GenBridge API Documentation
 * Access at: http://localhost:8080/swagger-ui/index.html
 */
@Configuration
public class OpenApiConfig {

    @Bean
    public OpenAPI genBridgeOpenAPI() {
        return new OpenAPI()
                .info(new Info()
                        .title("GenBridge API")
                        .description("Self-Learning Platform for Gen-Alpha Culture - RESTful API Documentation\n\n" +
                                "**Two Role System:**\n\n" +
                                "1. **USER** - Can view approved content and upload content for admin approval\n" +
                                "   - POST /api/content/draft - Save content as draft\n" +
                                "   - POST /api/content/submit - Submit content for admin review\n" +
                                "   - GET /api/content/approved - View all approved content\n\n" +
                                "2. **ADMIN** - Can approve/reject content and delete content\n" +
                                "   - GET /api/content/pending - View pending content awaiting approval\n" +
                                "   - PUT /api/content/{id}/approve - Approve content\n" +
                                "   - PUT /api/content/{id}/reject - Reject content\n" +
                                "   - DELETE /api/content/{id} - Delete content")
                        .version("v1.0")
                        .contact(new Contact()
                                .name("GenBridge Team")
                                .email("team@genbridge.com"))
                        .license(new License()
                                .name("MIT License")
                                .url("https://opensource.org/licenses/MIT")))
                .addSecurityItem(new SecurityRequirement().addList("Bearer Authentication"))
                .components(new Components()
                        .addSecuritySchemes("Bearer Authentication",
                                new SecurityScheme()
                                        .type(SecurityScheme.Type.HTTP)
                                        .scheme("bearer")
                                        .bearerFormat("JWT")
                                        .description("Enter JWT token obtained from login endpoint")));
    }
}
