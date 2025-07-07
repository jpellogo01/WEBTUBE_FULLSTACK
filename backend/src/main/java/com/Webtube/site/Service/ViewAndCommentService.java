package com.Webtube.site.Service;

import com.Webtube.site.Model.Comment;
import org.springframework.http.ResponseEntity;

import java.util.List;

public interface ViewAndCommentService {
    ResponseEntity<List<Comment>> getComments(Long newsId);
    ResponseEntity<?> addComment(Long newsId, Long parentId, String visitorId, Comment comment);
    ResponseEntity<?> deleteComment(Long commentId);
    ResponseEntity<?> deleteOwnComment(Long commentId, String visitorId);
    ResponseEntity<?> addView(Long newsId, String viewerIp);
    ResponseEntity<Long> getViews(Long newsId);
}
