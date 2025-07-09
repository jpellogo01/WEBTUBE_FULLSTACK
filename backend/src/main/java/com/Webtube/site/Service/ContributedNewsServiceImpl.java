package com.Webtube.site.Service.ServiceImpl;

import com.Webtube.site.Model.ContributedNews;
import com.Webtube.site.Repository.ContributedNewsRepository;
import com.Webtube.site.Service.ContributedNewsService;
import org.apache.commons.text.similarity.LevenshteinDistance;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.util.Date;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class ContributedNewsServiceImpl implements ContributedNewsService {

    @Autowired
    private ContributedNewsRepository contributedNewsRepository;

    @Override
    public ResponseEntity<ContributedNews> createContribution(
            String author,
            String authorEmail,
            String content,
            String category,
            List<MultipartFile> photos
    ) {
        if (author == null || author.trim().isEmpty()
                || authorEmail == null || !authorEmail.matches("^[\\w.-]+@[\\w.-]+\\.\\w+$")
                || content == null || content.trim().isEmpty()) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
        }

        ContributedNews news = new ContributedNews();
        news.setAuthor(author);
        news.setAuthorEmail(authorEmail);
        news.setContent(content);
        news.setCategory(category);
        news.setPublicationDate(new Date());
        news.setReviewStatus("Pending");

        // Process and store photos
        if (photos != null && !photos.isEmpty()) {
            List<byte[]> photoBytes = photos.stream().map(photo -> {
                try {
                    return photo.getBytes();
                } catch (Exception e) {
                    throw new RuntimeException("Failed to read photo", e);
                }
            }).toList();

            news.setAdditionalPhotos(photoBytes);
        }

        ContributedNews saved = contributedNewsRepository.save(news);
        return ResponseEntity.status(HttpStatus.CREATED).body(saved);
    }

    @Override
    public ResponseEntity<List<ContributedNews>> getAllContributions() {
        List<ContributedNews> contributions = contributedNewsRepository.findAll();
        return ResponseEntity.ok(contributions);
    }

    @Override
    public ResponseEntity<ContributedNews> getContribution(Long id) {
        Optional<ContributedNews> news = contributedNewsRepository.findById(id);
        return news.map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @Override
    public ResponseEntity<Void> deleteContribution(Long id) {
        if (contributedNewsRepository.existsById(id)) {
            contributedNewsRepository.deleteById(id);
            return ResponseEntity.noContent().build();
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @Override
    public List<ContributedNews> fuzzySearchContributions(String query) {
        List<ContributedNews> allNews = contributedNewsRepository.findAll();
        LevenshteinDistance distance = new LevenshteinDistance();

        String lowerQuery = query.toLowerCase();

        return allNews.stream()
                .filter(news -> {
                    String content = news.getContent() != null ? news.getContent().toLowerCase() : "";
                    String author = news.getAuthor() != null ? news.getAuthor().toLowerCase() : "";
                    String category = news.getCategory() != null ? news.getCategory().toLowerCase() : "";

                    // Split into words for fuzzy matching
                    String[] contentWords = content.split("\\s+");
                    String[] authorWords = author.split("\\s+");
                    String[] categoryWords = category.split("\\s+");

                    return containsFuzzyMatch(contentWords, lowerQuery, distance)
                            || containsFuzzyMatch(authorWords, lowerQuery, distance)
                            || containsFuzzyMatch(categoryWords, lowerQuery, distance);
                })
                .collect(Collectors.toList());
    }

    private boolean containsFuzzyMatch(String[] words, String query, LevenshteinDistance distance) {
        for (String word : words) {
            if (distance.apply(word, query) <= 2) { // tolerance of 2
                return true;
            }
        }
        return false;
    }

}
