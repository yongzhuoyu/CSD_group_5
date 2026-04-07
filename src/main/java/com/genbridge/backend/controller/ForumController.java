package com.genbridge.backend.controller;

import com.genbridge.backend.services.ForumService;
import com.genbridge.backend.user.User;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/forum")
public class ForumController {

    private final ForumService forumService;

    public ForumController(ForumService forumService) {
        this.forumService = forumService;
    }

    // GET /api/forum/posts — list all posts
    @GetMapping("/posts")
    public ResponseEntity<List<Map<String, Object>>> getAllPosts() {
        return ResponseEntity.ok(forumService.getAllPosts());
    }

    // POST /api/forum/posts — create post
    @PostMapping("/posts")
    public ResponseEntity<Object> createPost(@RequestBody Map<String, String> body, Authentication authentication) {
        User user = (User) authentication.getPrincipal();
        String title = body.get("title");
        String postBody = body.get("body");
        if (title == null || title.isBlank() || postBody == null || postBody.isBlank()) {
            return ResponseEntity.badRequest().body(Map.of("message", "title and body are required"));
        }
        return ResponseEntity.status(HttpStatus.CREATED).body(forumService.createPost(user, title, postBody));
    }

    // GET /api/forum/posts/{id} — get post + comments
    @GetMapping("/posts/{id}")
    public ResponseEntity<Map<String, Object>> getPost(@PathVariable Long id) {
        return ResponseEntity.ok(forumService.getPostWithComments(id));
    }

    // POST /api/forum/posts/{id}/comments — add comment
    @PostMapping("/posts/{id}/comments")
    public ResponseEntity<Object> addComment(@PathVariable Long id, @RequestBody Map<String, String> body, Authentication authentication) {
        User user = (User) authentication.getPrincipal();
        String commentBody = body.get("body");
        if (commentBody == null || commentBody.isBlank()) {
            return ResponseEntity.badRequest().body(Map.of("message", "body is required"));
        }
        return ResponseEntity.status(HttpStatus.CREATED).body(forumService.addComment(user, id, commentBody));
    }

    // DELETE /api/forum/posts/{id} — admin only
    @DeleteMapping("/posts/{id}")
    public ResponseEntity<Void> deletePost(@PathVariable Long id) {
        forumService.deletePost(id);
        return ResponseEntity.noContent().build();
    }

    // DELETE /api/forum/comments/{id} — admin only
    @DeleteMapping("/comments/{id}")
    public ResponseEntity<Void> deleteComment(@PathVariable Long id) {
        forumService.deleteComment(id);
        return ResponseEntity.noContent().build();
    }
}
