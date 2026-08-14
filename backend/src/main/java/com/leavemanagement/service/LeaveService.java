package com.leavemanagement.service;

import com.leavemanagement.dto.LeaveRequestDto;
import com.leavemanagement.entity.LeaveRequest;
import com.leavemanagement.entity.User;
import com.leavemanagement.exception.BadRequestException;
import com.leavemanagement.exception.ResourceNotFoundException;
import com.leavemanagement.repository.LeaveRequestRepository;
import com.leavemanagement.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class LeaveService {

    @Autowired
    private LeaveRequestRepository leaveRequestRepository;

    @Autowired
    private UserRepository userRepository;

    private User getUserByEmail(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with email: " + email));
    }

    private LeaveRequestDto mapToDto(LeaveRequest leave) {
        return new LeaveRequestDto(
                leave.getId(),
                leave.getUser().getId(),
                leave.getUser().getName(),
                leave.getUser().getEmail(),
                leave.getLeaveType(),
                leave.getFromDate(),
                leave.getToDate(),
                leave.getReason(),
                leave.getStatus(),
                leave.getCreatedAt()
        );
    }

    public List<LeaveRequestDto> getEmployeeLeaves(String userEmail) {
        User user = getUserByEmail(userEmail);
        return leaveRequestRepository.findByUserIdOrderByCreatedAtDesc(user.getId())
                .stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    public LeaveRequestDto applyLeave(String userEmail, LeaveRequestDto dto) {
        if (dto.getFromDate().isAfter(dto.getToDate())) {
            throw new BadRequestException("From date cannot be after To date");
        }

        User user = getUserByEmail(userEmail);

        LeaveRequest leave = new LeaveRequest();
        leave.setUser(user);
        leave.setLeaveType(dto.getLeaveType());
        leave.setFromDate(dto.getFromDate());
        leave.setToDate(dto.getToDate());
        leave.setReason(dto.getReason());
        leave.setStatus("PENDING");

        LeaveRequest savedLeave = leaveRequestRepository.save(leave);
        return mapToDto(savedLeave);
    }

    public LeaveRequestDto updateLeave(String userEmail, Long leaveId, LeaveRequestDto dto) {
        LeaveRequest leave = leaveRequestRepository.findById(leaveId)
                .orElseThrow(() -> new ResourceNotFoundException("Leave request not found with id: " + leaveId));

        User currentUser = getUserByEmail(userEmail);

        // Security check: Employee can only update their own leave request
        if (!leave.getUser().getId().equals(currentUser.getId())) {
            throw new BadRequestException("You can only update your own leave requests");
        }

        // Leave Rule check: Only PENDING leaves can be updated
        if (!"PENDING".equalsIgnoreCase(leave.getStatus())) {
            throw new BadRequestException("Only PENDING leave requests can be updated");
        }

        if (dto.getFromDate().isAfter(dto.getToDate())) {
            throw new BadRequestException("From date cannot be after To date");
        }

        leave.setLeaveType(dto.getLeaveType());
        leave.setFromDate(dto.getFromDate());
        leave.setToDate(dto.getToDate());
        leave.setReason(dto.getReason());

        LeaveRequest updatedLeave = leaveRequestRepository.save(leave);
        return mapToDto(updatedLeave);
    }

    public void deleteLeave(String userEmail, Long leaveId) {
        LeaveRequest leave = leaveRequestRepository.findById(leaveId)
                .orElseThrow(() -> new ResourceNotFoundException("Leave request not found with id: " + leaveId));

        User currentUser = getUserByEmail(userEmail);

        // Security check: Employee can only delete their own leave request
        if (!leave.getUser().getId().equals(currentUser.getId())) {
            throw new BadRequestException("You can only delete your own leave requests");
        }

        // Leave Rule check: Only PENDING leaves can be deleted
        if (!"PENDING".equalsIgnoreCase(leave.getStatus())) {
            throw new BadRequestException("Only PENDING leave requests can be deleted");
        }

        leaveRequestRepository.delete(leave);
    }

    public List<LeaveRequestDto> getAllLeavesForAdmin() {
        return leaveRequestRepository.findAllByOrderByCreatedAtDesc()
                .stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    public LeaveRequestDto updateLeaveStatusByAdmin(Long leaveId, String status) {
        LeaveRequest leave = leaveRequestRepository.findById(leaveId)
                .orElseThrow(() -> new ResourceNotFoundException("Leave request not found with id: " + leaveId));

        String upperStatus = status.toUpperCase().trim();
        if (!"APPROVED".equals(upperStatus) && !"REJECTED".equals(upperStatus)) {
            throw new BadRequestException("Invalid status value. Must be APPROVED or REJECTED");
        }

        leave.setStatus(upperStatus);
        LeaveRequest updatedLeave = leaveRequestRepository.save(leave);
        return mapToDto(updatedLeave);
    }
}
