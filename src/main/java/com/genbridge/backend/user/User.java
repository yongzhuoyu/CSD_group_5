package com.genbridge.backend.user;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDate;
import java.util.UUID;

@Entity
@Table(name = "users")
@Getter
@Setter
@NoArgsConstructor
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(length = 100)
    private String name;

    @Column(nullable = false, unique = true, length = 254)
    private String email;

    @Column(name = "password_hash", nullable = false, length = 100)
    private String passwordHash;

    @Column(nullable = false, length = 30)
    private String role = "LEARNER";

    /** Null-safe: returns 0 when no streak has been recorded yet. */
    @Getter(lombok.AccessLevel.NONE)
    @Column(name = "current_streak")
    private Integer currentStreak = 0;

    @Column(name = "last_active_date")
    private LocalDate lastActiveDate;

    @Column(name = "is_suspended", nullable = false)
    private boolean suspended = false;

    @Column(name = "suspension_reason", columnDefinition = "TEXT")
    private String suspensionReason;

    public User(String name, String email, String passwordHash, String role) {
        this.name = name;
        this.email = email;
        this.passwordHash = passwordHash;
        this.role = role;
    }

    /** Returns the current streak, defaulting to 0 if null. */
    public int getCurrentStreak() {
        return currentStreak == null ? 0 : currentStreak;
    }
}
