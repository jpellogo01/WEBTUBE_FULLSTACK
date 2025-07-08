// File: NewsController.java
package com.Webtube.site.Controller;

import com.Webtube.site.Exception.NewsNotFoundException;
import com.Webtube.site.Model.News;
import com.Webtube.site.Service.NewsService;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@CrossOrigin(origins = {"http://localhost:3000", "http://192.168.254.144:3000"})
@RestController
@RequestMapping("/api/v1")
public class NewsController {

    @Autowired
    private NewsService newsService;

    @Value("${openai.api.key}")
    private String openAiApiKey;

    @GetMapping("/news")
    public ResponseEntity<List<News>> getAllNews() {
        List<News> newsList = newsService.getAllNews();
        return ResponseEntity.ok(newsList);
    }

    @GetMapping("/news/{id}")
    public ResponseEntity<News> getNewsById(@PathVariable Long id) {
        News news = newsService.getNewsById(id);
        return ResponseEntity.ok(news);
    }

    @PostMapping("/news-contribute")
    public ResponseEntity<String> createNewsWithContentAndPhotos(
            @RequestParam(value = "content", required = false) String content,
            @RequestParam(value = "additionalPhotos", required = false) MultipartFile[] additionalPhotos) {

        newsService.createNewsWithContentAndPhotos(content, additionalPhotos);
        return ResponseEntity.status(201).body("News content and photos saved successfully.");
    }

    @PostMapping("/AInews")
    public ResponseEntity<String> createOrUpdateNewsAi(
            @RequestParam(value = "title", required = false) String title,
            @RequestParam(value = "thumbnailUrl", required = false) MultipartFile thumbnailUrl,
            @RequestParam(value = "description", required = false) String description,
            @RequestParam(value = "author", required = false) String author,
            @RequestParam(value = "content") String content,
            @RequestParam(value = "category", required = false) String category,
            @RequestParam(value = "status", required = false) String status,
            @RequestParam(value = "thumbnaillink", required = false) String thumbnaillink,
            @RequestParam(value = "additionalPhotos", required = false) MultipartFile[] additionalPhotos,
            @RequestParam(value = "embedYoutubeUrl", required = false) String embedYoutubeUrl) {

        newsService.createOrUpdateNewsAi(title, thumbnailUrl, description, author, content, category, status,
                thumbnaillink, additionalPhotos, embedYoutubeUrl, openAiApiKey);
        return ResponseEntity.status(201).body("News created successfully.");
    }

    @PostMapping("/news")
    public ResponseEntity<String> createOrUpdateNews(
            @RequestParam(value = "title", required = false) String title,
            @RequestParam(value = "thumbnailUrl", required = false) MultipartFile thumbnailUrl,
            @RequestParam(value = "description", required = false) String description,
            @RequestParam(value = "author", required = false) String author,
            @RequestParam(value = "content", required = false) String content,
            @RequestParam(value = "category", required = false) String category,
            @RequestParam(value = "status", required = false) String status,
            @RequestParam(value = "thumbnaillink", required = false) String thumbnaillink,
            @RequestParam(value = "additionalPhotos", required = false) MultipartFile[] additionalPhotos,
            @RequestParam(value = "embedYoutubeUrl", required = false) String embedYoutubeUrl) {

        newsService.createOrUpdateNews(title, thumbnailUrl, description, author, content, category, status,
                thumbnaillink, additionalPhotos, embedYoutubeUrl);
        return ResponseEntity.status(201).body("News created successfully.");
    }

    @PutMapping("/news/{id}")
    public ResponseEntity<String> updateNews(
            @PathVariable("id") long newsId,
            @RequestParam(value = "title", required = false) String title,
            @RequestParam(value = "thumbnailUrl", required = false) MultipartFile thumbnailUrl,
            @RequestParam(value = "description", required = false) String description,
            @RequestParam(value = "author", required = false) String author,
            @RequestParam(value = "content", required = false) String content,
            @RequestParam(value = "category", required = false) String category,
            @RequestParam(value = "status", required = false) String status,
            @RequestParam(value = "embedYoutubeUrl", required = false) String embedYoutubeUrl,
            @RequestParam(value = "additionalPhotos", required = false) MultipartFile[] additionalPhotos,
            @RequestParam(value = "removedPhotos", required = false) List<String> removedPhotos) {

        newsService.updateNews(newsId, title, thumbnailUrl, description, author, content, category, status,
                embedYoutubeUrl, additionalPhotos, removedPhotos);
        return ResponseEntity.ok("News updated successfully.");
    }

    @Transactional
    @DeleteMapping("/news/{id}")
    public ResponseEntity<String> deleteNews(@PathVariable("id") long newsId) {
        newsService.deleteNews(newsId);
        return ResponseEntity.ok("News, along with its comments and views, has been deleted successfully.");
    }
    @GetMapping("/news/search")
    public ResponseEntity<List<News>> searchNews(@RequestParam("query") String query) {
        List<News> results = newsService.searchNews(query);
        return ResponseEntity.ok(results);
    }

    @GetMapping("/news/fuzzy-search")
    public ResponseEntity<List<News>> fuzzySearch(@RequestParam("query") String query) {
        List<News> results = newsService.fuzzySearchNews(query);
        return ResponseEntity.ok(results);
    }


}
