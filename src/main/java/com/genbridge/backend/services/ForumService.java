package com.genbridge.backend.services;

import com.genbridge.backend.entity.ForumComment;
import com.genbridge.backend.entity.ForumPost;
import com.genbridge.backend.repository.ForumCommentRepository;
import com.genbridge.backend.repository.ForumPostRepository;
import com.genbridge.backend.user.User;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class ForumService {

    private final ForumPostRepository postRepository;
    private final ForumCommentRepository commentRepository;

    public ForumService(ForumPostRepository postRepository, ForumCommentRepository commentRepository) {
        this.postRepository = postRepository;
        this.commentRepository = commentRepository;
    }

    public List<Map<String, Object>> getAllPosts() {
        return postRepository.findAllByOrderByCreatedAtDesc().stream()
                .map(this::postToMap)
                .collect(Collectors.toList());
    }

    private void checkNotSuspended(User user) {
        if (user.isSuspended()) {
            String reason = user.getSuspensionReason() != null ? user.getSuspensionReason() : "Contact support.";
            throw new ResponseStatusException(HttpStatus.FORBIDDEN,
                    "Your account has been suspended. Reason: " + reason);
        }
    }

    public ForumPost createPost(User user, String title, String body) {
        checkNotSuspended(user);
        ForumPost post = new ForumPost();
        post.setUserId(user.getId());
        post.setUserName(user.getName() != null ? user.getName() : user.getEmail());
        post.setTitle(title);
        post.setBody(body);
        return postRepository.save(post);
    }

    public Map<String, Object> getPostWithComments(Long postId) {
        ForumPost post = postRepository.findById(postId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Post not found"));
        List<ForumComment> comments = commentRepository.findByPostIdOrderByCreatedAtAsc(postId);

        Map<String, Object> result = postToMap(post);
        result.put("comments", comments.stream().map(this::commentToMap).collect(Collectors.toList()));
        return result;
    }

    public ForumComment addComment(User user, Long postId, String body) {
        checkNotSuspended(user);
        postRepository.findById(postId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Post not found"));
        ForumComment comment = new ForumComment();
        comment.setPostId(postId);
        comment.setUserId(user.getId());
        comment.setUserName(user.getName() != null ? user.getName() : user.getEmail());
        comment.setBody(body);
        return commentRepository.save(comment);
    }

    @Transactional
    public void deletePost(Long postId) {
        postRepository.findById(postId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Post not found"));
        commentRepository.deleteByPostId(postId);
        postRepository.deleteById(postId);
    }

    public void deleteComment(Long commentId) {
        commentRepository.findById(commentId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Comment not found"));
        commentRepository.deleteById(commentId);
    }

    private Map<String, Object> postToMap(ForumPost post) {
        Map<String, Object> map = new HashMap<>();
        map.put("id", post.getId());
        map.put("userId", post.getUserId());
        map.put("userName", post.getUserName());
        map.put("title", post.getTitle());
        map.put("body", post.getBody());
        map.put("createdAt", post.getCreatedAt());
        map.put("updatedAt", post.getUpdatedAt());
        return map;
    }

    private Map<String, Object> commentToMap(ForumComment comment) {
        Map<String, Object> map = new HashMap<>();
        map.put("id", comment.getId());
        map.put("postId", comment.getPostId());
        map.put("userId", comment.getUserId());
        map.put("userName", comment.getUserName());
        map.put("body", comment.getBody());
        map.put("createdAt", comment.getCreatedAt());
        return map;
    }
}
