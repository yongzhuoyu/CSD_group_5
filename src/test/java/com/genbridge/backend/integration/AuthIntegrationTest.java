package com.genbridge.backend.integration;

import io.restassured.module.mockmvc.RestAssuredMockMvc;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.test.annotation.DirtiesContext;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;

import static io.restassured.module.mockmvc.RestAssuredMockMvc.*;
import static org.hamcrest.Matchers.*;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
@DirtiesContext(classMode = DirtiesContext.ClassMode.AFTER_EACH_TEST_METHOD)
class AuthIntegrationTest {

    @Autowired
    private MockMvc mockMvc;

    @BeforeEach
    void setUp() {
        RestAssuredMockMvc.mockMvc(mockMvc);
    }

    @Test
    void register_validRequest_returns200() {
        given()
            .contentType(MediaType.APPLICATION_JSON_VALUE)
            .body("""
                {
                  "name": "Test User",
                  "email": "newuser@test.com",
                  "password": "Password@123"
                }
                """)
        .when()
            .post("/api/auth/register")
        .then()
            .statusCode(HttpStatus.OK.value());
    }

    @Test
    void register_duplicateEmail_returns400() {
        String body = """
            {
              "name": "Duplicate User",
              "email": "duplicate@test.com",
              "password": "Password@123"
            }
            """;

        // First registration
        given()
            .contentType(MediaType.APPLICATION_JSON_VALUE)
            .body(body)
        .when()
            .post("/api/auth/register")
        .then()
            .statusCode(HttpStatus.OK.value());

        // Second registration with same email
        given()
            .contentType(MediaType.APPLICATION_JSON_VALUE)
            .body(body)
        .when()
            .post("/api/auth/register")
        .then()
            .statusCode(HttpStatus.BAD_REQUEST.value());
    }

    @Test
    void login_validCredentials_returnsToken() {
        // Register first
        given()
            .contentType(MediaType.APPLICATION_JSON_VALUE)
            .body("""
                {
                  "name": "Login Test",
                  "email": "logintest@test.com",
                  "password": "Password@123"
                }
                """)
        .when()
            .post("/api/auth/register");

        // Then login
        given()
            .contentType(MediaType.APPLICATION_JSON_VALUE)
            .body("""
                {
                  "email": "logintest@test.com",
                  "password": "Password@123"
                }
                """)
        .when()
            .post("/api/auth/login")
        .then()
            .statusCode(HttpStatus.OK.value())
            .body("token", notNullValue())
            .body("role", equalTo("LEARNER"));
    }

    @Test
    void login_wrongPassword_returns401() {
        given()
            .contentType(MediaType.APPLICATION_JSON_VALUE)
            .body("""
                {
                  "email": "nonexistent@test.com",
                  "password": "WrongPassword@1"
                }
                """)
        .when()
            .post("/api/auth/login")
        .then()
            .statusCode(HttpStatus.UNAUTHORIZED.value());
    }

    @Test
    void protectedEndpoint_withoutToken_returns403() {
        given()
        .when()
            .get("/api/profile")
        .then()
            .statusCode(HttpStatus.FORBIDDEN.value());
    }
}
