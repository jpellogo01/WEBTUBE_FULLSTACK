package com.Webtube.site.Controller;

import com.Webtube.site.Model.Notification;
import com.Webtube.site.Security.services.UserDetailsImpl;
import com.Webtube.site.Service.NotificationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin(origins = "http://localhost:3000/")
@RestController
@RequestMapping("/api/v1")
public class NotificationController {

    @Autowired
    private NotificationService notificationService;

    @GetMapping("news/notifications")
    public List<Notification> getNotifications() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication != null && authentication.getPrincipal() instanceof UserDetailsImpl) {
            UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
            String loggedInFullName = userDetails.getFullname();
            return notificationService.getUserNotifications(loggedInFullName);
        } else {
            throw new AccessDeniedException("Authentication details not found.");
        }
    }

    @PostMapping("news/notifications/mark-read/{id}")
    public Notification markNotificationAsRead(@PathVariable Long id) {
        return notificationService.markAsRead(id);
    }

    @DeleteMapping("news/notification/{id}")
    public ResponseEntity<?> deleteNotification(@PathVariable Long id) {
        try {
            notificationService.deleteNotification(id);
            return ResponseEntity.ok("Deleted");
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body("Error while processing the action: " + e.getMessage());
        }
    }
}
