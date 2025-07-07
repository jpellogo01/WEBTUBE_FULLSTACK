package com.Webtube.site.Service;

import com.Webtube.site.Model.ContributedNews;
import org.springframework.http.ResponseEntity;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

public interface ContributedNewsService {
    ResponseEntity<ContributedNews> createContribution(
            String author,
            String authorEmail,
            String content,
            String category,
            List<MultipartFile> photos
    );

    ResponseEntity<List<ContributedNews>> getAllContributions();

    ResponseEntity<ContributedNews> getContribution(Long id);

    ResponseEntity<Void> deleteContribution(Long id);
}
