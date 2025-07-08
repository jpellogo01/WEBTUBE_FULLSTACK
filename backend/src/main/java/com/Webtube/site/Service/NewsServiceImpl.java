package com.Webtube.site.Service.Impl;

import com.Webtube.site.Exception.NewsNotFoundException;
import com.Webtube.site.Model.News;
import com.Webtube.site.Repository.*;
import com.Webtube.site.Service.NewsService;
import jakarta.transaction.Transactional;
import org.apache.commons.text.similarity.LevenshteinDistance;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.multipart.MultipartFile;

import javax.imageio.ImageIO;
import java.awt.image.BufferedImage;
import java.io.IOException;
import java.util.*;
import java.util.regex.Matcher;
import java.util.regex.Pattern;
import java.util.stream.Collectors;

@Service
public class NewsServiceImpl implements NewsService {

    private final NewsRepository newsRepository;
    private final CommentRepository commentRepository;
    private final ViewRepository viewRepository;

    private static final Logger logger = LoggerFactory.getLogger(NewsServiceImpl.class);

    @Value("${openai.api.key}")
    private String openAiApiKey;

    public NewsServiceImpl(NewsRepository newsRepository,
                           CommentRepository commentRepository,
                           ViewRepository viewRepository) {
        this.newsRepository = newsRepository;
        this.commentRepository = commentRepository;
        this.viewRepository = viewRepository;
    }

    @Override
    public List<News> getAllNews() {
        return newsRepository.findAll();
    }

    @Override
    public News getNewsById(Long id) {
        return newsRepository.findById(id)
                .orElseThrow(() -> new NewsNotFoundException("News not found with id " + id));
    }

    @Override
    public News createNewsWithContentAndPhotos(String content, MultipartFile[] additionalPhotos) {
        try {
            News newNews = new News();
            if (content != null) newNews.setContent(content);
            if (additionalPhotos != null) {
                List<byte[]> photos = new ArrayList<>();
                for (MultipartFile photo : additionalPhotos) {
                    if (!photo.isEmpty()) {
                        photos.add(photo.getBytes());
                    }
                }
                newNews.setAdditionalPhotos(photos);
            }
            return newsRepository.save(newNews);
        } catch (IOException e) {
            throw new RuntimeException("Error while processing photos", e);
        }
    }

    @Override
    public News createOrUpdateNewsAi(String title, MultipartFile thumbnailUrl, String description, String author,
                                     String content, String category, String status, String thumbnaillink,
                                     MultipartFile[] additionalPhotos, String embedYoutubeUrl, String apiKey) {
        try {
            News newNews = new News();
            if (title == null || title.isBlank() || description == null || description.isBlank()) {
                String prompt = """
                        Generate a catchy news title and a short 10-15 words introductory summary for the following content.
                        The summary should sound like the first paragraph of a news article and must not use 5Ws formatting.

                        Content:
                        %s

                        Respond only in this format:
                        Title: <title>
                        Description: <description>
                        """.formatted(content.trim());

                String aiResult = callOpenAI(prompt);
                logger.info("AI Result: {}", aiResult);

                Pattern titlePattern = Pattern.compile("(?i)title:\s*(.*)");
                Pattern descriptionPattern = Pattern.compile("(?i)description:\s*(.*)");
                Matcher titleMatcher = titlePattern.matcher(aiResult);
                Matcher descriptionMatcher = descriptionPattern.matcher(aiResult);

                if ((title == null || title.isBlank()) && titleMatcher.find()) {
                    newNews.setTitle(titleMatcher.group(1).trim());
                }
                if ((description == null || description.isBlank()) && descriptionMatcher.find()) {
                    newNews.setDescription(descriptionMatcher.group(1).trim());
                }
            } else {
                newNews.setTitle(title);
                newNews.setDescription(description);
            }

            newNews.setContent(content);
            newNews.setAuthor(author);
            newNews.setCategory(category);
            newNews.setThumbnaillink(thumbnaillink);
            newNews.setStatus("Pending");
            newNews.setEmbedYouTubeUrl(embedYoutubeUrl);

            if (thumbnailUrl != null && !thumbnailUrl.isEmpty()) {
                newNews.setThumbnailUrl(thumbnailUrl.getBytes());
            }

            List<byte[]> photos = new ArrayList<>();
            if (additionalPhotos != null) {
                for (MultipartFile photo : additionalPhotos) {
                    if (!photo.isEmpty()) {
                        photos.add(photo.getBytes());
                    }
                }
            }
            newNews.setAdditionalPhotos(photos);

            return newsRepository.save(newNews);

        } catch (IOException e) {
            throw new RuntimeException("Error while creating AI news", e);
        }
    }

    @Override
    public News createOrUpdateNews(String title, MultipartFile thumbnailUrl, String description, String author,
                                   String content, String category, String status, String thumbnaillink,
                                   MultipartFile[] additionalPhotos, String embedYoutubeUrl) {
        try {
            News news = new News();
            news.setTitle(title);
            news.setDescription(description);
            news.setAuthor(author);
            news.setContent(content);
            news.setCategory(category);
            news.setStatus("Pending");
            news.setThumbnaillink(thumbnaillink);
            news.setEmbedYouTubeUrl(embedYoutubeUrl);

            if (thumbnailUrl != null && !thumbnailUrl.isEmpty()) {
                if (thumbnailUrl.getSize() > 5 * 1024 * 1024) throw new RuntimeException("Thumbnail exceeds 5MB limit");
                String type = thumbnailUrl.getContentType();
                if (!type.equals("image/jpeg") && !type.equals("image/png"))
                    throw new RuntimeException("Thumbnail must be JPEG or PNG");
                BufferedImage img = ImageIO.read(thumbnailUrl.getInputStream());
                if (img == null) throw new RuntimeException("Invalid thumbnail image file");
                news.setThumbnailUrl(thumbnailUrl.getBytes());
            }

            List<byte[]> photos = new ArrayList<>();
            if (additionalPhotos != null) {
                for (MultipartFile photo : additionalPhotos) {
                    if (!photo.isEmpty()) {
                        if (photo.getSize() > 5 * 1024 * 1024) continue;
                        photos.add(photo.getBytes());
                    }
                }
            }
            news.setAdditionalPhotos(photos);

            return newsRepository.save(news);

        } catch (IOException e) {
            throw new RuntimeException("Error while creating news", e);
        }
    }

    @Override
    public News updateNews(Long newsId, String title, MultipartFile thumbnailUrl, String description, String author,
                           String content, String category, String status, String embedYoutubeUrl,
                           MultipartFile[] additionalPhotos, List<String> removedPhotos) {
        try {
            News existingNews = newsRepository.findById(newsId)
                    .orElseThrow(() -> new NewsNotFoundException("News not found for ID: " + newsId));

            if (title != null) existingNews.setTitle(title);
            if (description != null) existingNews.setDescription(description);
            if (author != null) existingNews.setAuthor(author);
            if (content != null) existingNews.setContent(content);
            if (category != null) existingNews.setCategory(category);
            if (status != null) existingNews.setStatus(status);
            if (embedYoutubeUrl != null) existingNews.setEmbedYouTubeUrl(embedYoutubeUrl);

            if (thumbnailUrl != null && !thumbnailUrl.isEmpty()) {
                if (thumbnailUrl.getSize() > 5 * 1024 * 1024) throw new RuntimeException("Thumbnail too large");
                existingNews.setThumbnailUrl(thumbnailUrl.getBytes());
            }

            List<byte[]> updatedPhotos = new ArrayList<>();
            if (removedPhotos != null && !removedPhotos.isEmpty()) {
                for (byte[] existingPhoto : existingNews.getAdditionalPhotos()) {
                    String encoded = Base64.getEncoder().encodeToString(existingPhoto);
                    if (!removedPhotos.contains(encoded)) {
                        updatedPhotos.add(existingPhoto);
                    }
                }
            } else {
                updatedPhotos.addAll(existingNews.getAdditionalPhotos());
            }

            if (additionalPhotos != null) {
                for (MultipartFile photo : additionalPhotos) {
                    if (!photo.isEmpty()) {
                        updatedPhotos.add(photo.getBytes());
                    }
                }
            }

            existingNews.setAdditionalPhotos(updatedPhotos);
            return newsRepository.save(existingNews);

        } catch (IOException e) {
            throw new RuntimeException("Error updating news", e);
        }
    }

    @Override
    @Transactional
    public void deleteNews(Long newsId) {
        News news = newsRepository.findById(newsId)
                .orElseThrow(() -> new NewsNotFoundException("News not found for ID: " + newsId));

        commentRepository.deleteByNewsId(newsId);
        viewRepository.deleteByNewsId(newsId);
        newsRepository.delete(news);
    }

    @Override
    public List<News> searchNews(String query) {
        return newsRepository.findByTitleContainingIgnoreCaseOrContentContainingIgnoreCase(query, query);
    }

    @Override
    public List<News> fuzzySearchNews(String query) {
        List<News> allNews = newsRepository.findAll();
        LevenshteinDistance distance = new LevenshteinDistance();
        String q = query.toLowerCase();

        return allNews.stream()
                .filter(news -> {
                    return fuzzyMatch(news.getTitle(), q, distance)
                            || fuzzyMatch(news.getContent(), q, distance)
                            || fuzzyMatch(news.getAuthor(), q, distance);
                })
                .collect(Collectors.toList());
    }

    // Helper method
    private boolean fuzzyMatch(String text, String query, LevenshteinDistance distance) {
        if (text == null) return false;

        text = text.toLowerCase();
        String[] words = text.split("\\s+");

        for (String word : words) {
            // Strip punctuation like periods, commas, etc.
            word = word.replaceAll("[^a-zA-Z0-9]", "");
            if (distance.apply(word, query) <= 2) {
                return true;
            }
        }

        return false;
    }




    private String callOpenAI(String prompt) {
        String apiUrl = "https://api.openai.com/v1/chat/completions";
        RestTemplate restTemplate = new RestTemplate();

        Map<String, Object> headers = new HashMap<>();
        headers.put("Authorization", "Bearer " + openAiApiKey);
        headers.put("Content-Type", "application/json");

        Map<String, Object> message = new HashMap<>();
        message.put("role", "user");
        message.put("content", prompt);

        Map<String, Object> body = new HashMap<>();
        body.put("model", "gpt-4o");
        body.put("messages", List.of(message));

        Map response = restTemplate.postForObject(apiUrl, new org.springframework.http.HttpEntity<>(body, new org.springframework.http.HttpHeaders() {{
            setBearerAuth(openAiApiKey);
            setContentType(org.springframework.http.MediaType.APPLICATION_JSON);
        }}), Map.class);

        List choices = (List) response.get("choices");
        if (!choices.isEmpty()) {
            Map firstChoice = (Map) choices.get(0);
            Map messageMap = (Map) firstChoice.get("message");
            return messageMap.get("content").toString();
        }

        return "No response from OpenAI.";
    }
}
