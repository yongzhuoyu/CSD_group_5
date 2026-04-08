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
import static org.hamcrest.Matchers.anyOf;
import static org.hamcrest.Matchers.equalTo;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
@DirtiesContext(classMode = DirtiesContext.ClassMode.AFTER_EACH_TEST_METHOD)
class LessonIntegrationTest {

    @Autowired
    private MockMvc mockMvc;

    private String learnerToken;
    private String adminToken;

    @BeforeEach
    void setUp() {
        RestAssuredMockMvc.mockMvc(mockMvc);

        // Register learner then login to get token
        given()
            .contentType(MediaType.APPLICATION_JSON_VALUE)
            .body("""
                {"name":"Learner","email":"learner@test.com","password":"Password@123"}
                """)
            .post("/api/auth/register");

        learnerToken = given()
            .contentType(MediaType.APPLICATION_JSON_VALUE)
            .body("""
                {"email":"learner@test.com","password":"Password@123"}
                """)
            .post("/api/auth/login")
            .then().extract().path("token");

        // Get admin token using seeded admin credentials
        adminToken = given()
            .contentType(MediaType.APPLICATION_JSON_VALUE)
            .body("""
                {"email":"admin@test.com","password":"Admin@12345"}
                """)
            .post("/api/auth/login")
            .then().extract().path("token");
    }

    @Test
    void getLessons_unauthenticated_returns200() {
        given()
        .when()
            .get("/api/lessons")
        .then()
            .statusCode(HttpStatus.OK.value())
            .body("$", instanceOf(java.util.List.class));
    }

    @Test
    void getLessons_authenticated_returns200() {
        given()
            .header("Authorization", "Bearer " + learnerToken)
        .when()
            .get("/api/lessons")
        .then()
            .statusCode(HttpStatus.OK.value())
            .body("$", instanceOf(java.util.List.class));
    }

    @Test
    void createLesson_asAdmin_returns200() {
        given()
            .header("Authorization", "Bearer " + adminToken)
            .contentType(MediaType.APPLICATION_JSON_VALUE)
            .body("""
                {
                  "title": "Integration Test Lesson",
                  "description": "Created in test",
                  "difficulty": "BEGINNER",
                  "objective": "Test objective"
                }
                """)
        .when()
            .post("/api/lessons")
        .then()
            .statusCode(anyOf(equalTo(200), equalTo(201)))
            .body("title", equalTo("Integration Test Lesson"))
            .body("difficulty", equalTo("BEGINNER"));
    }

    @Test
    void createLesson_asLearner_returns403() {
        given()
            .header("Authorization", "Bearer " + learnerToken)
            .contentType(MediaType.APPLICATION_JSON_VALUE)
            .body("""
                {
                  "title": "Unauthorized Lesson",
                  "description": "Should fail",
                  "difficulty": "BEGINNER",
                  "objective": "Test"
                }
                """)
        .when()
            .post("/api/lessons")
        .then()
            .statusCode(HttpStatus.FORBIDDEN.value());
    }

    @Test
    void getLesson_notFound_returns404() {
        given()
            .header("Authorization", "Bearer " + learnerToken)
        .when()
            .get("/api/lessons/999999")
        .then()
            .statusCode(HttpStatus.NOT_FOUND.value());
    }
}
