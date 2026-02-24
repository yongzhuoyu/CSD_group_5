package com.genbridge.backend.entity;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.genbridge.backend.user.User;
import jakarta.persistence.*;
import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "content")
public class Content {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(nullable = false)
    private String title;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String description;

    @Column(nullable = false)
    private String term;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "contributor_id", nullable = false)
    @JsonIgnoreProperties({"hibernateLazyInitializer", "handler", "passwordHash"})
    private User contributor;

    @Column(nullable = false)
    private String status = "DRAFT"; // DRAFT, PENDING, APPROVED, REJECTED

    private LocalDateTime createdAt = LocalDateTime.now();

    public Content() {}

    public Content(String title, String description, String term, User contributor) {
        this.title = title;
        this.description = description;
        this.term = term;
        this.contributor = contributor;
        this.status = "DRAFT";
        this.createdAt = LocalDateTime.now();
    }

    public UUID getId() { return id; }
    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    public String getTerm() { return term; }
    public void setTerm(String term) { this.term = term; }
    public User getContributor() { return contributor; }
    public void setContributor(User contributor) { this.contributor = contributor; }
    public UUID getContributorId() { return contributor != null ? contributor.getId() : null; }
    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
    public LocalDateTime getCreatedAt() { return createdAt; }
}
