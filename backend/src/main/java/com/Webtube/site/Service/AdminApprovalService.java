package com.Webtube.site.Service;

import com.Webtube.site.Model.News;
import com.Webtube.site.payload.request.NewsApprovalRequest;
import com.Webtube.site.payload.response.CommentWithNewsDTO;
import org.springframework.http.ResponseEntity;

import java.util.List;

public interface AdminApprovalService {
    List<News> getAllPendingNews();
    List<News> getAllApprovedNews();
    List<News> getAllRejectedNews();
    News approveNews(Long id, NewsApprovalRequest request);
    News rejectNews(Long id);
    List<CommentWithNewsDTO> getAllVisibleComments();
    List<CommentWithNewsDTO> getAllPendingComments();
    ResponseEntity<CommentWithNewsDTO> getPendingCommentById(Long id);
    ResponseEntity<?> handleCommentAction(Long commentID, String action);
}
