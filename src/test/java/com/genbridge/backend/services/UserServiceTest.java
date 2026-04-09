package com.genbridge.backend.services;

import com.genbridge.backend.config.JwtUtil;
import com.genbridge.backend.user.User;
import com.genbridge.backend.user.UserRepository;
import com.genbridge.backend.user.UserServiceImpl;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.time.LocalDate;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.verify;

@ExtendWith(MockitoExtension.class)
class UserServiceTest {

    @Mock private UserRepository userRepository;
    @Mock private PasswordEncoder passwordEncoder;
    @Mock private JwtUtil jwtUtil;

    @InjectMocks
    private UserServiceImpl userService;

    private User user;

    @BeforeEach
    void setUp() {
        user = new User("Alice", "alice@example.com", "hashedpw", "LEARNER");
    }

    @Test
    void updateStreak_firstActivity_setsStreakToOne() {
        user.setLastActiveDate(null);
        user.setCurrentStreak(0);

        userService.updateStreak(user);

        assertThat(user.getCurrentStreak()).isEqualTo(1);
        assertThat(user.getLastActiveDate()).isEqualTo(LocalDate.now());
        verify(userRepository).save(user);
    }

    @Test
    void updateStreak_activeYesterday_incrementsStreak() {
        user.setLastActiveDate(LocalDate.now().minusDays(1));
        user.setCurrentStreak(3);

        userService.updateStreak(user);

        assertThat(user.getCurrentStreak()).isEqualTo(4);
    }

    @Test
    void updateStreak_alreadyActiveToday_doesNotChangeStreak() {
        user.setLastActiveDate(LocalDate.now());
        user.setCurrentStreak(5);

        userService.updateStreak(user);

        assertThat(user.getCurrentStreak()).isEqualTo(5);
    }

    @Test
    void updateStreak_missedADay_resetsStreakToOne() {
        user.setLastActiveDate(LocalDate.now().minusDays(2));
        user.setCurrentStreak(10);

        userService.updateStreak(user);

        assertThat(user.getCurrentStreak()).isEqualTo(1);
    }

    @Test
    void updateStreak_alwaysUpdatesLastActiveDate() {
        user.setLastActiveDate(LocalDate.now().minusDays(1));

        userService.updateStreak(user);

        assertThat(user.getLastActiveDate()).isEqualTo(LocalDate.now());
    }

    @Test
    void updateStreak_afterLongGap_savesUser() {
        user.setLastActiveDate(LocalDate.now().minusDays(30));
        user.setCurrentStreak(20);

        userService.updateStreak(user);

        assertThat(user.getCurrentStreak()).isEqualTo(1);
        verify(userRepository).save(any(User.class));
    }
}
