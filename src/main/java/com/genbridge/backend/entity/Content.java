package com.genbridge.backend.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "content", uniqueConstraints = {
    @UniqueConstraint(columnNames = {"lesson_id", "order_index"})
})
public class Content {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "lesson_id", nullable = false)
    private Long lessonId;

    @Column(nullable = false, length = 200)
    private String term;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String description;

    @Column(columnDefinition = "TEXT")
    private String example;

    @Column(length = 300)
    private String source;

    @Column(name = "order_index", nullable = false)
    private int orderIndex;

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt = LocalDateTime.now();

    @Column(name = "updated_at", nullable = false)
    private LocalDateTime updatedAt = LocalDateTime.now();

    public Content() {}

    public Long getId() { return id; }
    public Long getLessonId() { return lessonId; }
    public void setLessonId(Long lessonId) { this.lessonId = lessonId; }
    public String getTerm() { return term; }
    public void setTerm(String term) { this.term = term; }
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    public String getExample() { return example; }
    public void setExample(String example) { this.example = example; }
    public String getSource() { return source; }
    public void setSource(String source) { this.source = source; }
    public int getOrderIndex() { return orderIndex; }
    public void setOrderIndex(int orderIndex) { this.orderIndex = orderIndex; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }
}
