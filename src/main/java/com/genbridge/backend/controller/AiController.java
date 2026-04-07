package com.genbridge.backend.controller;

import com.genbridge.backend.services.AiService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/ai")
@CrossOrigin(origins = "*")
public class AiController {

    @Autowired
    private AiService aiService;

    @PostMapping("/ask")
    public String askAI(@RequestBody Map<String, String> body) {
        return aiService.askAI(body.get("prompt"));
    }
}