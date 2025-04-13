//package com.vactrack.controller;
//
//import com.vactrack.dto.*;
//import com.vactrack.exception.ApiException;
//import com.vactrack.service.ContactService;
//import jakarta.validation.Valid;
//import org.springframework.beans.factory.annotation.Autowired;
//import org.springframework.http.HttpStatus;
//import org.springframework.http.ResponseEntity;
//import org.springframework.web.bind.annotation.*;
//
//import java.util.Collections;
//import java.util.HashMap;
//import java.util.List;
//import java.util.Map;
//
//@RestController
//@RequestMapping("/api/contact")
//public class ContactController {
//
//    @Autowired
//    private ContactService contactService;
//
//    @PostMapping
//    public ResponseEntity<ApiResponse> submitContact(@Valid @RequestBody ContactRequest request) {
//        try {
//            contactService.createContact(request);
//            return ResponseEntity.ok(
//                    new ApiResponse(true, "Contact request submitted successfully")
//            );
//        } catch (Exception e) {
//            // Use the two-argument constructor instead of passing the error string as third arg
//            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
//                    .body(new ApiResponse(false, "Server error: " + e.getMessage()));
//        }
//    }
//
//    @GetMapping
//    public ResponseEntity<Map<String, Object>> getAllContacts(
//            @RequestParam(defaultValue = "1") int page,
//            @RequestParam(defaultValue = "10") int limit,
//            @RequestParam(defaultValue = "createdAt") String sortBy,
//            @RequestParam(defaultValue = "desc") String order,
//            @RequestParam(required = false) String status) {
//
//        try {
//            List<ContactResponse> contacts = contactService.getAllContacts(page, limit, sortBy, order, status);
//            PaginationResponse pagination = contactService.getPagination(page, limit, status);
//
//            Map<String, Object> response = new HashMap<>();
//            response.put("success", true);
//            response.put("data", contacts);
//            response.put("pagination", pagination);
//
//            return ResponseEntity.ok(response);
//        } catch (Exception e) {
//            Map<String, Object> response = new HashMap<>();
//            response.put("success", false);
//            response.put("message", "Error retrieving contacts");
//
//            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
//        }
//    }
//
//    @PatchMapping("/{id}/status")
//    public ResponseEntity<ApiResponse> updateContactStatus(
//            @PathVariable Long id,
//            @Valid @RequestBody ContactStatusUpdateRequest request) {
//
//        try {
//            contactService.updateContactStatus(id, request);
//            return ResponseEntity.ok(
//                    new ApiResponse(true, "Status updated successfully")
//            );
//        } catch (ApiException e) {
//            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
//                    .body(new ApiResponse(false, e.getMessage()));
//        } catch (Exception e) {
//            // Use the two-argument constructor instead of passing the error string as third arg
//            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
//                    .body(new ApiResponse(false, "Server error: " + e.getMessage()));
//        }
//    }
//}
