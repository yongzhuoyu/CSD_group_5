package com.genbridge.backend.content;

import jakarta.persistence.*;
import java.util.UUID;

@Entity
@Table(name = "content")
public class Content {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(nullable = false, length = 100)
    private String title;

    @Column(nullable = false, length = 1000)
    private String description;

    @Column(nullable = false)
    private boolean approved = true; // set true for testing

    // optional: contributor id (UUID) if needed
    @Column(nullable = true)
    private UUID contributorId;

    public Content() {
    }

    public Content(String title, String description, boolean approved, UUID contributorId) {
        this.title = title;
        this.description = description;
        this.approved = approved;
        this.contributorId = contributorId;
    }

    // getters and setters
    public UUID getId() {
        return id;
    }

    // NEW: setter for ID so you can assign a fixed UUID in DataSeeder
    public void setId(UUID id) {
        this.id = id;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public boolean isApproved() {
        return approved;
    }

    public void setApproved(boolean approved) {
        this.approved = approved;
    }

    public UUID getContributorId() {
        return contributorId;
    }

    public void setContributorId(UUID contributorId) {
        this.contributorId = contributorId;
    }
}
