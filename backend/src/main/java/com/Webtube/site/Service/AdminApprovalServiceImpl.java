package com.Webtube.site.Service.Impl;

import com.Webtube.site.Model.Comment;
import com.Webtube.site.Model.News;
import com.Webtube.site.Model.Notification;
import com.Webtube.site.Repository.CommentRepository;
import com.Webtube.site.Repository.NewsRepository;
import com.Webtube.site.Repository.NotificationRepository;
import com.Webtube.site.Service.AdminApprovalService;
import com.Webtube.site.payload.request.NewsApprovalRequest;
import com.Webtube.site.payload.response.CommentWithNewsDTO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.time.ZoneId;
import java.time.ZonedDateTime;
import java.util.*;

@Service
public class AdminApprovalServiceImpl implements AdminApprovalService {

    @Autowired
    private NewsRepository newsRepository;

    @Autowired
    private NotificationRepository notificationRepository;

    @Autowired
    private CommentRepository commentRepository;

    @Override
    public List<News> getAllPendingNews() {
        return newsRepository.findByStatus("Pending");
    }

    @Override
    public List<News> getAllApprovedNews() {
        return newsRepository.findByStatus("Approved");
    }

    @Override
    public List<News> getAllRejectedNews() {
        return newsRepository.findByStatus("Rejected");
    }

    @Override
    public News approveNews(Long id, NewsApprovalRequest request) {
        News news = newsRepository.findById(id).orElseThrow(() -> new RuntimeException("News not found"));

        if ("Approved".equals(news.getStatus())) {
            throw new RuntimeException("News is already approved.");
        }

        if (request.getPublicationDate() != null) {
            ZonedDateTime requestedPublicationDate = request.getPublicationDate();
            ZonedDateTime currentTime = ZonedDateTime.now(ZoneId.of("Asia/Manila"));

            if (requestedPublicationDate.isBefore(currentTime)) {
                throw new IllegalArgumentException("The publication date must be in the future.");
            }

            news.setPublicationDate(Date.from(requestedPublicationDate.toInstant()));
        } else {
            ZonedDateTime zdt = ZonedDateTime.now(ZoneId.of("Asia/Manila"));
            news.setPublicationDate(Date.from(zdt.toInstant()));
        }

        news.setStatus("Approved");
        newsRepository.save(news);

        Notification notification = new Notification();
        notification.setAuthor(news.getAuthor());
        notification.setMessage("Your content titled '" + news.getTitle() + "' has been approved and will be published at "
                + (request.getPublicationDate() != null ? request.getPublicationDate() : "immediately") + ".");
        notificationRepository.save(notification);

        return news;
    }

    @Override
    public News rejectNews(Long id) {
        News news = newsRepository.findById(id).orElseThrow(() -> new RuntimeException("News not found"));
        news.setStatus("Rejected");
        newsRepository.save(news);

        Notification notification = new Notification();
        notification.setAuthor(news.getAuthor());
        notification.setMessage("Your content titled '" + news.getTitle() + "' has been rejected.");
        notificationRepository.save(notification);

        return news;
    }

    @Override
    public List<CommentWithNewsDTO> getAllVisibleComments() {
        List<String> allowedStatuses = List.of("pending", "Approved");
        List<Comment> comments = commentRepository.findByStatusIn(allowedStatuses);
        return convertToDTOList(comments);
    }

    @Override
    public List<CommentWithNewsDTO> getAllPendingComments() {
        List<Comment> comments = commentRepository.findByStatus("pending");
        return convertToDTOList(comments);
    }

    @Override
    public ResponseEntity<CommentWithNewsDTO> getPendingCommentById(Long id) {
        Optional<Comment> commentOptional = commentRepository.findByIdAndStatus(id, "pending");

        if (commentOptional.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        Comment comment = commentOptional.get();
        return ResponseEntity.ok(convertToDTO(comment));
    }

    @Override
    public ResponseEntity<?> handleCommentAction(Long commentID, String action) {
        try {
            Comment comment = commentRepository.findById(commentID)
                    .orElseThrow(() -> new RuntimeException("Comment not found"));

            switch (action.toLowerCase()) {
                case "approve":
                    comment.setStatus("approved");
                    commentRepository.save(comment);
                    return ResponseEntity.ok("Comment approved successfully");

                case "reject":
                case "delete":
                    commentRepository.delete(comment);
                    return ResponseEntity.ok("Comment deleted successfully");

                default:
                    return ResponseEntity.badRequest().body("Invalid action specified");
            }
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body("Error while processing comment action: " + e.getMessage());
        }
    }

    // --- PRIVATE HELPER METHODS ---

    private CommentWithNewsDTO convertToDTO(Comment comment) {
        String newsTitle = comment.getNews() != null ? comment.getNews().getTitle() : null;
        Long newsId = comment.getNews() != null ? comment.getNews().getId() : null;

        return new CommentWithNewsDTO(
                comment.getId(),
                comment.getContent(),
                comment.getStatus(),
                newsTitle,
                newsId
        );
    }

    private List<CommentWithNewsDTO> convertToDTOList(List<Comment> comments) {
        List<CommentWithNewsDTO> result = new ArrayList<>();
        for (Comment comment : comments) {
            result.add(convertToDTO(comment));
        }
        return result;
    }
}
