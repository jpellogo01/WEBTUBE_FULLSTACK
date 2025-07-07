package com.Webtube.site.Controller;

import com.Webtube.site.Model.Comment;
import com.Webtube.site.Model.News;
import com.Webtube.site.payload.request.NewsApprovalRequest;
import com.Webtube.site.payload.response.CommentWithNewsDTO;
import com.Webtube.site.Service.AdminApprovalService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin(origins = "http://localhost:3000/")
@RestController
@RequestMapping("/api/v1")
public class AdminApprovalController {

    @Autowired
    private AdminApprovalService adminApprovalService;

    @GetMapping("pending/news")
    public ResponseEntity<List<News>> getAllPendingNews() {
        return ResponseEntity.ok(adminApprovalService.getAllPendingNews());
    }

    @GetMapping("news/approved")
    public ResponseEntity<List<News>> getAllApprovedNews() {
        return ResponseEntity.ok(adminApprovalService.getAllApprovedNews());
    }

    @GetMapping("news/rejected")
    public ResponseEntity<List<News>> getAllRejectedNews() {
        return ResponseEntity.ok(adminApprovalService.getAllRejectedNews());
    }

    @PostMapping("approve/news/{id}")
    public ResponseEntity<News> approveNews(@PathVariable Long id,
                                            @RequestBody NewsApprovalRequest request) {
        return ResponseEntity.ok(adminApprovalService.approveNews(id, request));
    }

    @PostMapping("reject/news/{id}")
    public ResponseEntity<News> rejectNews(@PathVariable Long id) {
        return ResponseEntity.ok(adminApprovalService.rejectNews(id));
    }

    @GetMapping("news/comments/visible")
    public ResponseEntity<List<CommentWithNewsDTO>> getAllVisibleComments() {
        return ResponseEntity.ok(adminApprovalService.getAllVisibleComments());
    }

    @GetMapping("news/comments/pending")
    public ResponseEntity<List<CommentWithNewsDTO>> getAllPendingComments() {
        return ResponseEntity.ok(adminApprovalService.getAllPendingComments());
    }

    @GetMapping("news/comments/pending/{id}")
    public ResponseEntity<CommentWithNewsDTO> getPendingCommentById(@PathVariable Long id) {
        return adminApprovalService.getPendingCommentById(id);
    }

    @PostMapping("news/comment/{action}/{commentID}")
    public ResponseEntity<?> handleCommentAction(@PathVariable Long commentID,
                                                 @PathVariable String action) {
        return adminApprovalService.handleCommentAction(commentID, action);
    }
}
