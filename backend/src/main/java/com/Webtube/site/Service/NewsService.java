// File: NewsService.java
package com.Webtube.site.Service;

import com.Webtube.site.Model.News;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

public interface NewsService {
    List<News> getAllNews();

    News getNewsById(Long id);

    News createNewsWithContentAndPhotos(String content, MultipartFile[] additionalPhotos);

    News createOrUpdateNewsAi(String title, MultipartFile thumbnailUrl, String description, String author,
                              String content, String category, String status, String thumbnaillink,
                              MultipartFile[] additionalPhotos, String embedYoutubeUrl, String apiKey);

    News createOrUpdateNews(String title, MultipartFile thumbnailUrl, String description, String author,
                            String content, String category, String status, String thumbnaillink,
                            MultipartFile[] additionalPhotos, String embedYoutubeUrl);

    News updateNews(Long newsId, String title, MultipartFile thumbnailUrl, String description,
                    String author, String content, String category, String status,
                    String embedYoutubeUrl, MultipartFile[] additionalPhotos, List<String> removedPhotos);

    void deleteNews(Long newsId);
    public List<News> searchNews(String query);
    List<News> fuzzySearchNews(String query);




}
