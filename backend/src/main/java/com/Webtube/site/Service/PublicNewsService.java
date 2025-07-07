package com.Webtube.site.Service;

import com.Webtube.site.Model.News;
import org.springframework.http.ResponseEntity;

import java.util.List;

public interface PublicNewsService {
    List<News> getAllApprovedNews();

    ResponseEntity<News> getApprovedNewsById(Long id);
}
