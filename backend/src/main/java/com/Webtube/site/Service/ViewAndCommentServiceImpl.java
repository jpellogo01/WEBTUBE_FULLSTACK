package com.Webtube.site.Service.Impl;

import com.Webtube.site.Model.Comment;
import com.Webtube.site.Model.View;
import com.Webtube.site.Repository.CommentRepository;
import com.Webtube.site.Repository.NewsRepository;
import com.Webtube.site.Repository.ViewRepository;
import com.Webtube.site.Service.ViewAndCommentService;
import com.Webtube.site.Security.services.ProfanityCheckerService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ViewAndCommentServiceImpl implements ViewAndCommentService {

    @Autowired
    private ViewRepository viewRepository;

    @Autowired
    private CommentRepository commentRepository;

    @Autowired
    private NewsRepository newsRepository;

    @Autowired
    private ProfanityCheckerService profanityCheckerService;

    @Override
    public ResponseEntity<List<Comment>> getComments(Long newsId) {
        var news = newsRepository.findById(newsId)
                .orElseThrow(() -> new RuntimeException("News not found"));

        List<Comment> comments = commentRepository.findByNewsIdAndStatus(newsId, "Approved");
        return ResponseEntity.ok(comments);
    }

    @Override
    public ResponseEntity<?> addComment(Long newsId, Long parentId, String visitorId, Comment comment) {
        var news = newsRepository.findById(newsId)
                .orElseThrow(() -> new RuntimeException("News not found"));

        String analysisResult = profanityCheckerService.checkCommentForProfanity(comment.getContent());

        if (analysisResult == null) {
            comment.setStatus("pending");
            news.setStatus("pending");
            newsRepository.save(news);
        } else {
            if (analysisResult.equalsIgnoreCase("no profanity") || analysisResult.trim().isEmpty()) {
                comment.setStatus("Approved");
            } else {
                String[] pairs = analysisResult.split(",");
                for (String pair : pairs) {
                    String[] parts = pair.split(":");
                    if (parts.length == 2) {
                        try {
                            double accuracy = Double.parseDouble(parts[1]);
                            if (accuracy >= 0.90) {
                                return ResponseEntity.badRequest().body("Comment contains bad words and was not saved.");
                            } else if (accuracy >= 0.70) {
                                comment.setStatus("pending");
                                break;
                            }
                        } catch (NumberFormatException ignored) {}
                    }
                }
                if (comment.getStatus() == null) {
                    comment.setStatus("Approved");
                }
            }
        }

        comment.setNews(news);
        comment.setVisitorId(visitorId);

        if (parentId != null) {
            Comment parentComment = commentRepository.findById(parentId)
                    .orElseThrow(() -> new RuntimeException("Parent comment not found"));
            comment.setParentComment(parentComment);
        }

        commentRepository.save(comment);
        return ResponseEntity.ok("Comment added with status: " + comment.getStatus());
    }

    @Override
    public ResponseEntity<?> deleteComment(Long commentId) {
        Comment comment = commentRepository.findById(commentId)
                .orElseThrow(() -> new RuntimeException("Comment not found"));

        commentRepository.delete(comment);
        return ResponseEntity.ok("Comment deleted successfully");
    }

    @Override
    public ResponseEntity<?> deleteOwnComment(Long commentId, String visitorId) {
        Comment comment = commentRepository.findById(commentId)
                .orElseThrow(() -> new RuntimeException("Comment not found"));

        if (!comment.getVisitorId().equals(visitorId)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                    .body("You are not allowed to delete this comment.");
        }

        commentRepository.delete(comment);
        return ResponseEntity.ok("Comment deleted successfully");
    }

    @Override
    public ResponseEntity<?> addView(Long newsId, String viewerIp) {
        var news = newsRepository.findById(newsId)
                .orElseThrow(() -> new RuntimeException("News not found"));

        View view = new View();
        view.setViewerIp(viewerIp);
        view.setNews(news);

        viewRepository.save(view);
        return ResponseEntity.ok("View added successfully");
    }

    @Override
    public ResponseEntity<Long> getViews(Long newsId) {
        var news = newsRepository.findById(newsId)
                .orElseThrow(() -> new RuntimeException("News not found"));

        Long viewCount = viewRepository.countByNews(news);
        return ResponseEntity.ok(viewCount);
    }
}
