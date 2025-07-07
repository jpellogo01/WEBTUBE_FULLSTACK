package com.Webtube.site.Controller;

import com.Webtube.site.Model.ContributedNews;
import com.Webtube.site.Service.ContributedNewsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@CrossOrigin(origins = "http://localhost:3000/")
@RequestMapping("/api/v1")
public class ContributedNewsController {

    @Autowired
    private ContributedNewsService contributedNewsService;

    @PostMapping(value = "/contribute-news", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<ContributedNews> createContribution(
            @RequestParam("author") String author,
            @RequestParam("authorEmail") String authorEmail,
            @RequestParam("content") String content,
            @RequestParam("category") String category,
            @RequestParam(value = "photos", required = false) List<MultipartFile> photos
    ) {
        return contributedNewsService.createContribution(author, authorEmail, content, category, photos);
    }

    @GetMapping("/contribute-news")
    public ResponseEntity<List<ContributedNews>> getAllContributions() {
        return contributedNewsService.getAllContributions();
    }

    @GetMapping("/contribute-news/{id}")
    public ResponseEntity<ContributedNews> getContribution(@PathVariable Long id) {
        return contributedNewsService.getContribution(id);
    }

    @DeleteMapping("/contribute-news/{id}")
    public ResponseEntity<Void> deleteContribution(@PathVariable Long id) {
        return contributedNewsService.deleteContribution(id);
    }
}
