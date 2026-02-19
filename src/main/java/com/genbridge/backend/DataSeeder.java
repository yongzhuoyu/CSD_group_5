package com.genbridge.backend;

import com.genbridge.backend.content.Content;
import com.genbridge.backend.content.ContentRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;
import java.util.UUID;

@Component
public class DataSeeder implements CommandLineRunner {

    private final ContentRepository contentRepository;

    public DataSeeder(ContentRepository contentRepository) {
        this.contentRepository = contentRepository;
    }

    @Override
    public void run(String... args) throws Exception {
        // Clear previous data
        contentRepository.deleteAll();

        // Approved content with fixed UUID for testing
        UUID fixedUuid = UUID.fromString("550e8400-e29b-41d4-a716-446655440000");
        Content content = new Content("Gen-Alpha Slang", "Intro to Gen-Alpha slang", true, UUID.randomUUID());
        content.setId(fixedUuid); // assign fixed ID
        contentRepository.save(content);

        // Other approved content
        contentRepository.save(new Content(
                "Social Media Trends",
                "Popular Gen-Alpha platforms and behaviors",
                true,
                UUID.randomUUID()));

        // Draft content (not approved)
        contentRepository.save(new Content(
                "Gaming Culture",
                "How Gen-Alpha interacts with games",
                false, // draft
                UUID.randomUUID()));
    }

}
