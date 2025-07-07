package com.Webtube.site.Controller;

import com.Webtube.site.Service.SummarizeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@CrossOrigin(origins = {"http://localhost:3000", "http://192.168.254.144:3000"})
public class SummarizeController {

    @Autowired
    private SummarizeService summarizeService;

    @PostMapping("/hitOpenaiApi/{id}")
    public String getOpenaiResponse(@PathVariable Long id) {
        return summarizeService.summarizeNewsById(id);
    }
}
