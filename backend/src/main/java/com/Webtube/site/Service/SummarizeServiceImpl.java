package com.Webtube.site.Service.ServiceImpl;

import com.Webtube.site.Model.ChatCompletionRequest;
import com.Webtube.site.Model.ChatCompletionResponse;
import com.Webtube.site.Model.News;
import com.Webtube.site.Repository.NewsRepository;
import com.Webtube.site.Service.SummarizeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.client.HttpClientErrorException;
import org.springframework.web.client.RestTemplate;

@Service
public class SummarizeServiceImpl implements SummarizeService {

    @Autowired
    private NewsRepository newsRepository;

    @Autowired
    private RestTemplate restTemplate;

    @Override
    public String summarizeNewsById(Long id) {
        try {
            News news = newsRepository.findByIdAndStatus(id, "Approved")
                    .orElseThrow(() -> new RuntimeException("Approved news not found"));

            String prompt = "Summarize this content (make it short but easy to get the context) using the What, When, Who, Where, Why and additional information structure: "
                    + news.getContent();

            ChatCompletionRequest chatCompletionRequest = new ChatCompletionRequest(
                    "gpt-4o-mini", prompt
            );

            ChatCompletionResponse response = restTemplate.postForObject(
                    "https://api.openai.com/v1/chat/completions",
                    chatCompletionRequest,
                    ChatCompletionResponse.class
            );

            if (response != null && !response.getChoices().isEmpty()) {
                return response.getChoices().get(0).getMessage().getContent();
            } else {
                return "No summary received from OpenAI.";
            }

        } catch (HttpClientErrorException e) {
            if (e.getStatusCode() == HttpStatus.UNAUTHORIZED) {
                return "Error: Unauthorized access. Please check your API key.";
            } else if (e.getStatusCode() == HttpStatus.PAYMENT_REQUIRED) {
                return "Error: Your API credits have been exhausted. Please top up your credits to continue.";
            } else {
                return "Error: Unable to process the request. " + e.getMessage();
            }
        } catch (Exception e) {
            return "An unexpected error occurred: " + e.getMessage();
        }
    }
}
