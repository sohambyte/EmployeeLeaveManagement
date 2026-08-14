package com.leavemanagement.controller;

import com.leavemanagement.dto.LeaveRequestDto;
import com.leavemanagement.dto.StatusUpdateRequest;
import com.leavemanagement.service.LeaveService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin/leaves")
public class AdminLeaveController {

    @Autowired
    private LeaveService leaveService;

    @GetMapping
    public ResponseEntity<List<LeaveRequestDto>> getAllLeaves() {
        List<LeaveRequestDto> leaves = leaveService.getAllLeavesForAdmin();
        return ResponseEntity.ok(leaves);
    }

    @PutMapping("/{id}/status")
    public ResponseEntity<LeaveRequestDto> updateStatus(@PathVariable Long id,
                                                         @Valid @RequestBody StatusUpdateRequest request) {
        LeaveRequestDto updatedLeave = leaveService.updateLeaveStatusByAdmin(id, request.getStatus());
        return ResponseEntity.ok(updatedLeave);
    }
}
