package com.leavemanagement.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.time.LocalDate;
import java.time.LocalDateTime;

public class LeaveRequestDto {

    private Long id;
    private Long userId;
    private String userName;
    private String userEmail;

    @NotBlank(message = "Leave type is required")
    private String leaveType;

    @NotNull(message = "From date is required")
    private LocalDate fromDate;

    @NotNull(message = "To date is required")
    private LocalDate toDate;

    private LocalDate requestedFromDate;
    private LocalDate requestedToDate;

    @NotBlank(message = "Reason is required")
    private String reason;

    private String status;
    private LocalDateTime createdAt;

    public LeaveRequestDto() {
    }

    public LeaveRequestDto(Long id, Long userId, String userName, String userEmail, String leaveType, LocalDate fromDate, LocalDate toDate, String reason, String status, LocalDateTime createdAt) {
        this.id = id;
        this.userId = userId;
        this.userName = userName;
        this.userEmail = userEmail;
        this.leaveType = leaveType;
        this.fromDate = fromDate;
        this.toDate = toDate;
        this.requestedFromDate = fromDate;
        this.requestedToDate = toDate;
        this.reason = reason;
        this.status = status;
        this.createdAt = createdAt;
    }

    public LeaveRequestDto(Long id, Long userId, String userName, String userEmail, String leaveType, LocalDate fromDate, LocalDate toDate, LocalDate requestedFromDate, LocalDate requestedToDate, String reason, String status, LocalDateTime createdAt) {
        this.id = id;
        this.userId = userId;
        this.userName = userName;
        this.userEmail = userEmail;
        this.leaveType = leaveType;
        this.fromDate = fromDate;
        this.toDate = toDate;
        this.requestedFromDate = requestedFromDate;
        this.requestedToDate = requestedToDate;
        this.reason = reason;
        this.status = status;
        this.createdAt = createdAt;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getUserId() {
        return userId;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }

    public String getUserName() {
        return userName;
    }

    public void setUserName(String userName) {
        this.userName = userName;
    }

    public String getUserEmail() {
        return userEmail;
    }

    public void setUserEmail(String userEmail) {
        this.userEmail = userEmail;
    }

    public String getLeaveType() {
        return leaveType;
    }

    public void setLeaveType(String leaveType) {
        this.leaveType = leaveType;
    }

    public LocalDate getFromDate() {
        return fromDate;
    }

    public void setFromDate(LocalDate fromDate) {
        this.fromDate = fromDate;
    }

    public LocalDate getToDate() {
        return toDate;
    }

    public void setToDate(LocalDate toDate) {
        this.toDate = toDate;
    }

    public LocalDate getRequestedFromDate() {
        return requestedFromDate;
    }

    public void setRequestedFromDate(LocalDate requestedFromDate) {
        this.requestedFromDate = requestedFromDate;
    }

    public LocalDate getRequestedToDate() {
        return requestedToDate;
    }

    public void setRequestedToDate(LocalDate requestedToDate) {
        this.requestedToDate = requestedToDate;
    }

    public String getReason() {
        return reason;
    }

    public void setReason(String reason) {
        this.reason = reason;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
}
