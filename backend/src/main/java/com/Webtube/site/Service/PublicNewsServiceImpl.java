package com.Webtube.site.Service.ServiceImpl;

import com.Webtube.site.Exception.NewsNotFoundException;
import com.Webtube.site.Model.News;
import com.Webtube.site.Repository.NewsRepository;
import com.Webtube.site.Service.PublicNewsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.util.Date;
import java.util.List;
import java.util.Optional;

@Service
public class PublicNewsServiceImpl implements PublicNewsService {

    @Autowired
    private NewsRepository newsRepository;

    @Override
    public List<News> getAllApprovedNews() {
        return newsRepository.findByStatusAndPublicationDateBefore("Approved", new Date());
    }

    @Override
    public ResponseEntity<News> getApprovedNewsById(Long id) {
        Optional<News> news = newsRepository.findById(id);

        if (news.isPresent() && "Approved".equals(news.get().getStatus())) {
            return ResponseEntity.ok(news.get());
        } else {
            throw new NewsNotFoundException("News with ID " + id + " not found or not approved.");
        }
    }
}
