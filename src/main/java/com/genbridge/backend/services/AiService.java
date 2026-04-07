package com.genbridge.backend.services;

import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.*;

@Service
public class AiService {

        private final RestTemplate restTemplate = new RestTemplate();

        private final String API_URL = "https://openrouter.ai/api/v1/chat/completions";

        private final String API_KEY = "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"; // 🔴
                                                                                                                    // put
                                                                                                                    // your
                                                                                                                    // real
                                                                                                                    // key

        public String askAI(String prompt) {

                // 🔹 Headers (MATCH DOC)
                HttpHeaders headers = new HttpHeaders();
                headers.setBearerAuth(API_KEY);
                headers.setContentType(MediaType.APPLICATION_JSON);

                // 🔴 DO NOT include HTTP-Referer for now (can break things)

                // 🔹 Messages (MATCH DOC)
                Map<String, Object> systemMessage = Map.of(
                                "role", "system",
                                "content", "You are a helpful assistant explaining Gen Alpha slang.");

                Map<String, Object> userMessage = Map.of(
                                "role", "user",
                                "content", prompt);

                Map<String, Object> body = new HashMap<>();
                body.put("model", "openrouter/auto"); // ✅ best option
                body.put("messages", List.of(systemMessage, userMessage));

                HttpEntity<Map<String, Object>> request = new HttpEntity<>(body, headers);

                try {
                        ResponseEntity<Map> response = restTemplate.postForEntity(
                                        API_URL,
                                        request,
                                        Map.class);

                        List choices = (List) response.getBody().get("choices");
                        Map firstChoice = (Map) choices.get(0);
                        Map message = (Map) firstChoice.get("message");

                        return message.get("content").toString();

                } catch (Exception e) {
                        e.printStackTrace();
                        return "Error calling AI: " + e.getMessage();
                }
        }
}