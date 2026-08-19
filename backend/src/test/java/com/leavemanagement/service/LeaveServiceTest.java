package com.leavemanagement.service;

import com.leavemanagement.dto.LeaveRequestDto;
import com.leavemanagement.dto.StatusUpdateRequest;
import com.leavemanagement.entity.LeaveRequest;
import com.leavemanagement.entity.User;
import com.leavemanagement.exception.BadRequestException;
import com.leavemanagement.repository.LeaveRequestRepository;
import com.leavemanagement.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDate;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class LeaveServiceTest {

    @Mock
    private LeaveRequestRepository leaveRequestRepository;

    @Mock
    private UserRepository userRepository;

    @InjectMocks
    private LeaveService leaveService;

    private User employee;

    @BeforeEach
    void setUp() {
        employee = new User();
        employee.setId(1L);
        employee.setName("John Doe");
        employee.setEmail("john@example.com");
        employee.setRole("ROLE_EMPLOYEE");
    }

    @Test
    void testApplyLeave_Success() {
        when(userRepository.findByEmail("john@example.com")).thenReturn(Optional.of(employee));
        when(leaveRequestRepository.existsOverlappingLeaveForUser(eq(1L), any(), any())).thenReturn(false);

        LeaveRequest savedLeave = new LeaveRequest();
        savedLeave.setId(10L);
        savedLeave.setUser(employee);
        savedLeave.setLeaveType("Casual Leave");
        savedLeave.setFromDate(LocalDate.of(2026, 8, 20));
        savedLeave.setToDate(LocalDate.of(2026, 8, 20));
        savedLeave.setRequestedFromDate(LocalDate.of(2026, 8, 20));
        savedLeave.setRequestedToDate(LocalDate.of(2026, 8, 20));
        savedLeave.setReason("Personal");
        savedLeave.setStatus("PENDING");

        when(leaveRequestRepository.save(any(LeaveRequest.class))).thenReturn(savedLeave);

        LeaveRequestDto dto = new LeaveRequestDto();
        dto.setLeaveType("Casual Leave");
        dto.setFromDate(LocalDate.of(2026, 8, 20));
        dto.setToDate(LocalDate.of(2026, 8, 20));
        dto.setReason("Personal");

        LeaveRequestDto result = leaveService.applyLeave("john@example.com", dto);

        assertNotNull(result);
        assertEquals("PENDING", result.getStatus());
        assertEquals(LocalDate.of(2026, 8, 20), result.getFromDate());
        assertEquals(LocalDate.of(2026, 8, 20), result.getRequestedFromDate());
    }

    @Test
    void testApplyLeave_Overlap_Rejected() {
        when(userRepository.findByEmail("john@example.com")).thenReturn(Optional.of(employee));
        when(leaveRequestRepository.existsOverlappingLeaveForUser(eq(1L), eq(LocalDate.of(2026, 8, 20)), eq(LocalDate.of(2026, 8, 20)))).thenReturn(true);

        LeaveRequestDto dto = new LeaveRequestDto();
        dto.setLeaveType("Casual Leave");
        dto.setFromDate(LocalDate.of(2026, 8, 20));
        dto.setToDate(LocalDate.of(2026, 8, 20));
        dto.setReason("Second request on same day");

        BadRequestException ex = assertThrows(BadRequestException.class, () ->
                leaveService.applyLeave("john@example.com", dto)
        );

        assertEquals("Employee already has a leave request covering one or more of these dates.", ex.getMessage());
    }

    @Test
    void testApplyLeave_OverlapRange_Rejected() {
        when(userRepository.findByEmail("john@example.com")).thenReturn(Optional.of(employee));
        when(leaveRequestRepository.existsOverlappingLeaveForUser(eq(1L), eq(LocalDate.of(2026, 8, 21)), eq(LocalDate.of(2026, 8, 21)))).thenReturn(true);

        LeaveRequestDto dto = new LeaveRequestDto();
        dto.setLeaveType("Sick Leave");
        dto.setFromDate(LocalDate.of(2026, 8, 21));
        dto.setToDate(LocalDate.of(2026, 8, 21));
        dto.setReason("Fever");

        BadRequestException ex = assertThrows(BadRequestException.class, () ->
                leaveService.applyLeave("john@example.com", dto)
        );

        assertEquals("Employee already has a leave request covering one or more of these dates.", ex.getMessage());
    }

    @Test
    void testApplyLeave_NonOverlapping_Allowed() {
        when(userRepository.findByEmail("john@example.com")).thenReturn(Optional.of(employee));
        when(leaveRequestRepository.existsOverlappingLeaveForUser(eq(1L), eq(LocalDate.of(2026, 8, 23)), eq(LocalDate.of(2026, 8, 25)))).thenReturn(false);

        LeaveRequest savedLeave = new LeaveRequest();
        savedLeave.setId(11L);
        savedLeave.setUser(employee);
        savedLeave.setLeaveType("Casual Leave");
        savedLeave.setFromDate(LocalDate.of(2026, 8, 23));
        savedLeave.setToDate(LocalDate.of(2026, 8, 25));
        savedLeave.setReason("Vacation");
        savedLeave.setStatus("PENDING");

        when(leaveRequestRepository.save(any(LeaveRequest.class))).thenReturn(savedLeave);

        LeaveRequestDto dto = new LeaveRequestDto();
        dto.setLeaveType("Casual Leave");
        dto.setFromDate(LocalDate.of(2026, 8, 23));
        dto.setToDate(LocalDate.of(2026, 8, 25));
        dto.setReason("Vacation");

        LeaveRequestDto result = leaveService.applyLeave("john@example.com", dto);
        assertNotNull(result);
        assertEquals(LocalDate.of(2026, 8, 23), result.getFromDate());
    }

    @Test
    void testAdminApprovePartial_Success() {
        LeaveRequest existingRequest = new LeaveRequest();
        existingRequest.setId(100L);
        existingRequest.setUser(employee);
        existingRequest.setLeaveType("Annual Leave");
        existingRequest.setFromDate(LocalDate.of(2026, 8, 20));
        existingRequest.setToDate(LocalDate.of(2026, 8, 25));
        existingRequest.setRequestedFromDate(LocalDate.of(2026, 8, 20));
        existingRequest.setRequestedToDate(LocalDate.of(2026, 8, 25));
        existingRequest.setStatus("PENDING");

        when(leaveRequestRepository.findById(100L)).thenReturn(Optional.of(existingRequest));
        when(leaveRequestRepository.existsOverlappingLeaveForUserExcludingId(eq(1L), eq(100L), eq(LocalDate.of(2026, 8, 20)), eq(LocalDate.of(2026, 8, 22)))).thenReturn(false);
        when(leaveRequestRepository.save(any(LeaveRequest.class))).thenAnswer(invocation -> invocation.getArgument(0));

        StatusUpdateRequest updateReq = new StatusUpdateRequest();
        updateReq.setStatus("APPROVED");
        updateReq.setFromDate(LocalDate.of(2026, 8, 20));
        updateReq.setToDate(LocalDate.of(2026, 8, 22));

        LeaveRequestDto approvedDto = leaveService.updateLeaveStatusByAdmin(100L, updateReq);

        assertEquals("APPROVED", approvedDto.getStatus());
        assertEquals(LocalDate.of(2026, 8, 20), approvedDto.getFromDate());
        assertEquals(LocalDate.of(2026, 8, 22), approvedDto.getToDate());
        assertEquals(LocalDate.of(2026, 8, 20), approvedDto.getRequestedFromDate());
        assertEquals(LocalDate.of(2026, 8, 25), approvedDto.getRequestedToDate());
    }

    @Test
    void testAdminApprove_Overlap_Rejected() {
        LeaveRequest existingRequest = new LeaveRequest();
        existingRequest.setId(100L);
        existingRequest.setUser(employee);
        existingRequest.setFromDate(LocalDate.of(2026, 8, 20));
        existingRequest.setToDate(LocalDate.of(2026, 8, 25));
        existingRequest.setStatus("PENDING");

        when(leaveRequestRepository.findById(100L)).thenReturn(Optional.of(existingRequest));
        when(leaveRequestRepository.existsOverlappingLeaveForUserExcludingId(eq(1L), eq(100L), eq(LocalDate.of(2026, 8, 20)), eq(LocalDate.of(2026, 8, 24)))).thenReturn(true);

        StatusUpdateRequest updateReq = new StatusUpdateRequest();
        updateReq.setStatus("APPROVED");
        updateReq.setFromDate(LocalDate.of(2026, 8, 20));
        updateReq.setToDate(LocalDate.of(2026, 8, 24));

        BadRequestException ex = assertThrows(BadRequestException.class, () ->
                leaveService.updateLeaveStatusByAdmin(100L, updateReq)
        );

        assertEquals("Employee already has a leave request covering one or more of these dates.", ex.getMessage());
    }

    @Test
    void testInvalidDateRange_FromAfterTo() {
        LeaveRequestDto dto = new LeaveRequestDto();
        dto.setFromDate(LocalDate.of(2026, 8, 25));
        dto.setToDate(LocalDate.of(2026, 8, 20));

        BadRequestException ex = assertThrows(BadRequestException.class, () ->
                leaveService.applyLeave("john@example.com", dto)
        );

        assertEquals("From date cannot be after To date", ex.getMessage());
    }
}
