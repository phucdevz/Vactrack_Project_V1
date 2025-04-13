package com.vactrack.controller;

import com.vactrack.dto.ChildRequest;
import com.vactrack.dto.ChildResponse;
import com.vactrack.service.ChildService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/children")
public class ChildController {

    private final ChildService childService;

    @Autowired
    public ChildController(ChildService childService) {
        this.childService = childService;
    }

    @GetMapping
    public ResponseEntity<List<ChildResponse>> getAllChildren() {
        return ResponseEntity.ok(childService.getAllChildren());
    }

    @GetMapping("/{id}")
    public ResponseEntity<ChildResponse> getChildById(@PathVariable Long id) {
        return ResponseEntity.ok(childService.getChildById(id));
    }

    @PostMapping
    public ResponseEntity<ChildResponse> createChild(@RequestBody ChildRequest childRequest) {
        return new ResponseEntity<>(childService.createChild(childRequest), HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    public ResponseEntity<ChildResponse> updateChild(@PathVariable Long id, @RequestBody ChildRequest childRequest) {
        return ResponseEntity.ok(childService.updateChild(id, childRequest));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteChild(@PathVariable Long id) {
        childService.deleteChild(id);
        return ResponseEntity.noContent().build();
    }
}
