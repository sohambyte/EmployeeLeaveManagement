package com.leavemanagement.controller;

import com.leavemanagement.dto.LeaveRequestDto;
import com.leavemanagement.service.LeaveService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/leaves")
public class LeaveController {

    @Autowired
    private LeaveService leaveService;

    @GetMapping
    public ResponseEntity<List<LeaveRequestDto>> getMyLeaves(Principal principal) {
        List<LeaveRequestDto> leaves = leaveService.getEmployeeLeaves(principal.getName());
        return ResponseEntity.ok(leaves);
    }

    @PostMapping
    public ResponseEntity<LeaveRequestDto> applyLeave(@Valid @RequestBody LeaveRequestDto dto, Principal principal) {
        LeaveRequestDto createdLeave = leaveService.applyLeave(principal.getName(), dto);
        return ResponseEntity.status(HttpStatus.CREATED).body(createdLeave);
    }

    @PutMapping("/{id}")
    public ResponseEntity<LeaveRequestDto> updateLeave(@PathVariable Long id,
                                                       @Valid @RequestBody LeaveRequestDto dto,Principal principal) {
        LeaveRequestDto updatedLeave = leaveService.updateLeave(principal.getName(), id, dto);
        return ResponseEntity.ok(updatedLeave);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Map<String, String>> deleteLeave(@PathVariable Long id, Principal principal) {
        leaveService.deleteLeave(principal.getName(), id);
        return ResponseEntity.ok(Map.of("message", "Leave request cancelled/deleted successfully"));
    }
}
