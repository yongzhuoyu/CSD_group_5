package com.genbridge.backend.services;

import com.genbridge.backend.entity.ForumComment;
import com.genbridge.backend.entity.ForumPost;
import com.genbridge.backend.repository.ForumCommentRepository;
import com.genbridge.backend.repository.ForumPostRepository;
import com.genbridge.backend.user.User;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.UUID;

import static org.assertj.core.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class ForumServiceTest {

    @Mock
    private ForumPostRepository postRepository;

    @Mock
    private ForumCommentRepository commentRepository;

    @InjectMocks
    private ForumServiceImpl forumService;

    private User activeUser;
    private User suspendedUser;
    private ForumPost post;

    @BeforeEach
    void setUp() {
        activeUser = new User("Alice", "alice@test.com", "hash", "LEARNER");

        suspendedUser = new User("Bob", "bob@test.com", "hash", "LEARNER");
        suspendedUser.setSuspended(true);
        suspendedUser.setSuspensionReason("Spam");

        post = new ForumPost();
        post.setId(1L);
        post.setTitle("Hello");
        post.setBody("World");
        post.setUserId(UUID.randomUUID());
        post.setUserName("Alice");
    }

    @Test
    void createPost_activeUser_succeeds() {
        when(postRepository.save(any(ForumPost.class))).thenAnswer(inv -> inv.getArgument(0));
        ForumPost result = forumService.createPost(activeUser, "Title", "Body");
        assertThat(result.getTitle()).isEqualTo("Title");
        assertThat(result.getBody()).isEqualTo("Body");
    }

    @Test
    void createPost_suspendedUser_throwsForbidden() {
        assertThatThrownBy(() -> forumService.createPost(suspendedUser, "Title", "Body"))
                .isInstanceOf(ResponseStatusException.class)
                .hasMessageContaining("suspended");
    }

    @Test
    void addComment_activeUser_succeeds() {
        when(postRepository.findById(1L)).thenReturn(Optional.of(post));
        when(commentRepository.save(any(ForumComment.class))).thenAnswer(inv -> inv.getArgument(0));

        ForumComment result = forumService.addComment(activeUser, 1L, "My comment");
        assertThat(result.getBody()).isEqualTo("My comment");
    }

    @Test
    void addComment_suspendedUser_throwsForbidden() {
        assertThatThrownBy(() -> forumService.addComment(suspendedUser, 1L, "Comment"))
                .isInstanceOf(ResponseStatusException.class)
                .hasMessageContaining("suspended");
    }

    @Test
    void addComment_postNotFound_throws404() {
        when(postRepository.findById(99L)).thenReturn(Optional.empty());
        assertThatThrownBy(() -> forumService.addComment(activeUser, 99L, "Comment"))
                .isInstanceOf(ResponseStatusException.class)
                .hasMessageContaining("Post not found");
    }

    @Test
    void getAllPosts_returnsMappedList() {
        when(postRepository.findAllByOrderByCreatedAtDesc()).thenReturn(List.of(post));
        List<Map<String, Object>> result = forumService.getAllPosts();
        assertThat(result).hasSize(1);
        assertThat(result.get(0).get("title")).isEqualTo("Hello");
    }

    @Test
    void deletePost_notFound_throws404() {
        when(postRepository.findById(99L)).thenReturn(Optional.empty());
        assertThatThrownBy(() -> forumService.deletePost(99L))
                .isInstanceOf(ResponseStatusException.class)
                .hasMessageContaining("Post not found");
    }

    @Test
    void deletePost_found_deletesPostAndComments() {
        when(postRepository.findById(1L)).thenReturn(Optional.of(post));
        forumService.deletePost(1L);
        verify(commentRepository).deleteByPostId(1L);
        verify(postRepository).deleteById(1L);
    }

    @Test
    void deleteComment_notFound_throws404() {
        when(commentRepository.findById(99L)).thenReturn(Optional.empty());
        assertThatThrownBy(() -> forumService.deleteComment(99L))
                .isInstanceOf(ResponseStatusException.class)
                .hasMessageContaining("Comment not found");
    }
}
