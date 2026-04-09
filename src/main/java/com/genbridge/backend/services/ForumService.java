package com.genbridge.backend.services;

import com.genbridge.backend.entity.ForumComment;
import com.genbridge.backend.entity.ForumPost;
import com.genbridge.backend.user.User;

import java.util.List;
import java.util.Map;

/** Defines operations for forum posts and comments. */
public interface ForumService {
    List<Map<String, Object>> getAllPosts();
    ForumPost createPost(User user, String title, String body);
    Map<String, Object> getPostWithComments(Long postId);
    ForumComment addComment(User user, Long postId, String body);
    void deletePost(Long postId);
    void deleteComment(Long commentId);
}
