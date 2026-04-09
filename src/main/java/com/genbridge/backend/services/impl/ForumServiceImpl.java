package com.genbridge.backend.services.impl;

import com.genbridge.backend.entity.ForumComment;
import com.genbridge.backend.entity.ForumPost;
import com.genbridge.backend.repository.ForumCommentRepository;
import com.genbridge.backend.repository.ForumPostRepository;
import com.genbridge.backend.services.ForumService;
import com.genbridge.backend.user.User;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

/**
 * Implementation of {@link ForumService}.
 * Admins can delete any post or comment; learners can create posts and add comments.
 * Suspended users are blocked from posting or commenting.
 * Deleting a post cascades to delete all its comments.
 */
@Service
public class ForumServiceImpl implements ForumService {

    private final ForumPostRepository postRepository;
    private final ForumCommentRepository commentRepository;

    public ForumServiceImpl(ForumPostRepository postRepository, ForumCommentRepository commentRepository) {
        this.postRepository = postRepository;
        this.commentRepository = commentRepository;
    }

    @Override
    public List<Map<String, Object>> getAllPosts() {
        return postRepository.findAllByOrderByCreatedAtDesc().stream()
                .map(this::postToMap)
                .collect(Collectors.toList());
    }

    @Override
    public ForumPost createPost(User user, String title, String body) {
        checkNotSuspended(user);
        ForumPost post = new ForumPost();
        post.setUserId(user.getId());
        post.setUserName(user.getName() != null ? user.getName() : user.getEmail());
        post.setTitle(title);
        post.setBody(body);
        return postRepository.save(post);
    }

    @Override
    public Map<String, Object> getPostWithComments(Long postId) {
        ForumPost post = postRepository.findById(postId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Post not found"));
        List<ForumComment> comments = commentRepository.findByPostIdOrderByCreatedAtAsc(postId);

        Map<String, Object> result = postToMap(post);
        result.put("comments", comments.stream().map(this::commentToMap).collect(Collectors.toList()));
        return result;
    }

    @Override
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

    @Override
    @Transactional
    public void deletePost(Long postId) {
        postRepository.findById(postId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Post not found"));
        commentRepository.deleteByPostId(postId);
        postRepository.deleteById(postId);
    }

    @Override
    public void deleteComment(Long commentId) {
        commentRepository.findById(commentId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Comment not found"));
        commentRepository.deleteById(commentId);
    }

    /** Throws 403 if the user's account has been suspended. */
    private void checkNotSuspended(User user) {
        if (user.isSuspended()) {
            String reason = user.getSuspensionReason() != null ? user.getSuspensionReason() : "Contact support.";
            throw new ResponseStatusException(HttpStatus.FORBIDDEN,
                    "Your account has been suspended. Reason: " + reason);
        }
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
