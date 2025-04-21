package com.vactrack.controller;

import java.util.ArrayList;
import java.util.List;

import com.vactrack.dto.ChatGPTRequest;
import com.vactrack.dto.ClientChatRequest;
import com.vactrack.model.Message;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.RestTemplate;

@RestController
@RequestMapping("/api/chat")
public class ChatController {

    @Value("${openai.api.key}")
    private String openAiApiKey; // Lấy API key từ file application.properties

    @PostMapping("/ask")
    public ResponseEntity<?> askChatGPT(@RequestBody ClientChatRequest clientRequest) {
        String openAiUrl = "https://api.openai.com/v1/chat/completions";

        // Khởi tạo danh sách messages và tích hợp system prompt
        List<Message> messages = new ArrayList<>();

        // System message: thiết lập vai trò trợ lí của VacTrack
        messages.add(new Message("system", "Bạn là trợ lí ảo của VacTrack, chuyên cung cấp thông tin và tư vấn liên quan đến vaccine, lịch tiêm chủng và các hướng dẫn sơ cứu cơ bản. Trả lời ngắn gọn, rõ ràng và chuyên nghiệp. Luôn khuyến khích người dùng đến bác sĩ nếu tình trạng vượt quá khả năng tư vấn."));

        // (Tùy chọn) Few-shot examples: nếu cần bạn có thể thêm vài ví dụ mẫu vào đây
        messages.add(new Message("user", "Khi nào nên tiêm vaccine cho trẻ em?"));
        messages.add(new Message("assistant", "Trẻ em thường bắt đầu tiêm chủng từ 2 tháng tuổi, tuy nhiên bạn nên tham khảo ý kiến của bác sĩ để có lịch tiêm chủng chính xác."));

        // Message từ người dùng
        messages.add(new Message("user", clientRequest.getMessage()));

        // Tạo đối tượng request gửi đến OpenAI
        ChatGPTRequest chatRequest = new ChatGPTRequest();
        chatRequest.setModel("gpt-3.5-turbo");
        chatRequest.setMessages(messages);
        chatRequest.setTemperature(0.7);
        chatRequest.setMax_tokens(150);

        // Thiết lập header với API key và content-type
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.setBearerAuth(openAiApiKey);
        HttpEntity<ChatGPTRequest> entity = new HttpEntity<>(chatRequest, headers);

        // Gọi API OpenAI
        RestTemplate restTemplate = new RestTemplate();
        ResponseEntity<String> response = restTemplate.postForEntity(openAiUrl, entity, String.class);

        return ResponseEntity.ok(response.getBody());
    }
}

