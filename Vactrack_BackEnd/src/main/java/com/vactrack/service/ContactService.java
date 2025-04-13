//package com.vactrack.service;
//
//import com.vactrack.dto.ContactRequest;
//import com.vactrack.dto.ContactResponse;
//import com.vactrack.dto.ContactStatusUpdateRequest;
//import com.vactrack.dto.PaginationResponse;
//import com.vactrack.exception.ApiException;
//import com.vactrack.model.Contact;
//import com.vactrack.repository.ContactRepository;
//import org.springframework.beans.factory.annotation.Autowired;
//import org.springframework.data.domain.Page;
//import org.springframework.data.domain.PageRequest;
//import org.springframework.data.domain.Pageable;
//import org.springframework.data.domain.Sort;
//import org.springframework.http.HttpStatus;
//import org.springframework.stereotype.Service;
//
//import java.time.LocalDateTime;
//import java.time.format.DateTimeFormatter;
//import java.util.List;
//import java.util.stream.Collectors;
//
//@Service
//public class ContactService {
//
//    @Autowired
//    private ContactRepository contactRepository;
//
//    private static final DateTimeFormatter formatter = DateTimeFormatter.ISO_DATE_TIME;
//
//    public void createContact(ContactRequest request) {
//        Contact contact = new Contact();
//        contact.setName(request.getName());
//        contact.setEmail(request.getEmail());
//        contact.setSubject(request.getSubject());
//        contact.setMessage(request.getMessage());
//        contact.setPhone(request.getPhone());
//        contact.setCreatedAt(LocalDateTime.now());
//        contact.setStatus("new");
//
//        contactRepository.save(contact);
//    }
//
//    public ContactResponse getContact(Long id) {
//        Contact contact = contactRepository.findById(id)
//                .orElseThrow(() -> new ApiException("Contact request not found", HttpStatus.NOT_FOUND));
//
//        return mapToContactResponse(contact);
//    }
//
//    public void updateContactStatus(Long id, ContactStatusUpdateRequest request) {
//        Contact contact = contactRepository.findById(id)
//                .orElseThrow(() -> new ApiException("Contact request not found", HttpStatus.NOT_FOUND));
//
//        if (!isValidStatus(request.getStatus())) {
//            throw new ApiException("Invalid status. Must be one of: new, in-progress, completed", HttpStatus.BAD_REQUEST);
//        }
//
//        contact.setStatus(request.getStatus());
//        contactRepository.save(contact);
//    }
//
//    public List<ContactResponse> getAllContacts(int page, int limit, String sortBy, String order, String status) {
//        Sort sort = "desc".equalsIgnoreCase(order) ?
//                Sort.by(sortBy).descending() :
//                Sort.by(sortBy).ascending();
//
//        Pageable pageable = PageRequest.of(page - 1, limit, sort);
//        Page<Contact> contactPage;
//
//        if (status != null && !status.isEmpty()) {
//            contactPage = contactRepository.findByStatus(status, pageable);
//        } else {
//            contactPage = contactRepository.findAll(pageable);
//        }
//
//        return contactPage.getContent()
//                .stream()
//                .map(this::mapToContactResponse)
//                .collect(Collectors.toList());
//    }
//
//    public PaginationResponse getPagination(int page, int limit, String status) {
//        Pageable pageable = PageRequest.of(page - 1, limit);
//        Page<Contact> contactPage;
//
//        if (status != null && !status.isEmpty()) {
//            contactPage = contactRepository.findByStatus(status, pageable);
//        } else {
//            contactPage = contactRepository.findAll(pageable);
//        }
//
//        return new PaginationResponse(
//                contactPage.getTotalElements(),
//                contactPage.getTotalPages(),
//                page,
//                limit
//        );
//    }
//
//    private ContactResponse mapToContactResponse(Contact contact) {
//        ContactResponse response = new ContactResponse();
//        response.setId(contact.getId());
//        response.setName(contact.getName());
//        response.setEmail(contact.getEmail());
//        response.setSubject(contact.getSubject());
//        response.setMessage(contact.getMessage());
//        response.setPhone(contact.getPhone());
//        response.setStatus(contact.getStatus());
//        response.setCreatedAt(contact.getCreatedAt().format(formatter));
//        return response;
//    }
//
//    private boolean isValidStatus(String status) {
//        return status.equals("new") || status.equals("in-progress") || status.equals("completed");
//    }
//}
