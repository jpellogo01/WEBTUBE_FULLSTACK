package com.Webtube.site.Controller;

import com.Webtube.site.Model.Comment;
import com.Webtube.site.Service.ViewAndCommentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin(origins = "http://localhost:3000")
@RestController
@RequestMapping("/api/v1")
public class ViewAndCommentController {

    @Autowired
    private ViewAndCommentService viewAndCommentService;

    // ✅ Get all approved comments for a specific news
    @GetMapping("news/approved/comments/{newsId}")
    public ResponseEntity<List<Comment>> getComments(@PathVariable Long newsId) {
        return viewAndCommentService.getComments(newsId);
    }

    // ✅ Add a new comment to a news
    @PostMapping("/comment-news/{newsId}")
    public ResponseEntity<?> addComment(
            @PathVariable Long newsId,
            @RequestParam(value = "parentId", required = false) Long parentId,
            @RequestHeader("Visitor-Id") String visitorId,
            @RequestBody Comment comment) {
        return viewAndCommentService.addComment(newsId, parentId, visitorId, comment);
    }


    // ✅ Delete a comment (admin use)
    @DeleteMapping("/delete-comment/{commentId}")
    public ResponseEntity<?> deleteComment(@PathVariable Long commentId) {
        return viewAndCommentService.deleteComment(commentId);
    }

    // ✅ Delete own comment (by visitor)
    @DeleteMapping("/user-delete-comment/{commentId}")
    public ResponseEntity<?> deleteOwnComment(
            @PathVariable Long commentId,
            @RequestHeader("Visitor-Id") String visitorId) {
        return viewAndCommentService.deleteOwnComment(commentId, visitorId);
    }

    // ✅ Add a view to a specific news
    @PostMapping("view-news/{newsId}")
    public ResponseEntity<?> addView(
            @PathVariable Long newsId,
            @RequestParam String viewerIp) {
        return viewAndCommentService.addView(newsId, viewerIp);
    }

    // ✅ Get view count of a specific news
    @GetMapping("news/views/{newsId}")
    public ResponseEntity<Long> getViews(@PathVariable Long newsId) {
        return viewAndCommentService.getViews(newsId);
    }
}
