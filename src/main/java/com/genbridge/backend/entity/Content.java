package com.genbridge.backend.entity;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import java.time.LocalDateTime;

@Entity
@Table(name = "contents")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Content {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(nullable = false)
    private String title;
    
    @Column(nullable = false, columnDefinition = "TEXT")
    private String description;
    
    @Column(nullable = false)
    private String term;
    
    @Column(nullable = false)
    private Long contributorId;  // FIXED: Use Long instead of User entity
    
    @Column(nullable = false)
    private boolean published = false;
    
    private LocalDateTime createdAt = LocalDateTime.now();
}
