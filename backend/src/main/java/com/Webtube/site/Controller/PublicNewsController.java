package com.Webtube.site.Controller;

import com.Webtube.site.Model.News;
import com.Webtube.site.Service.PublicNewsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin(origins = {"http://localhost:3000", "http://192.168.254.144:3000"})
@RestController
@RequestMapping("/api/v1")
public class PublicNewsController {

    @Autowired
    private PublicNewsService publicNewsService;

    @GetMapping("/public-news")
    public List<News> getAllNews() {
        return publicNewsService.getAllApprovedNews();
    }

    @GetMapping("/public-news/{id}")
    public ResponseEntity<News> getNewsById(@PathVariable Long id) {
        return publicNewsService.getApprovedNewsById(id);
    }
}
