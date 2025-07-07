package com.Webtube.site.Service;

import com.Webtube.site.Model.Notification;

import java.util.List;

public interface NotificationService {
    List<Notification> getUserNotifications(String fullname);

    Notification markAsRead(Long id);

    void deleteNotification(Long id);
}
