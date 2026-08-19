package com.leavemanagement.dto;

import jakarta.validation.constraints.NotBlank;
import java.time.LocalDate;

public class StatusUpdateRequest {

    @NotBlank(message = "Status is required")
    private String status;

    private LocalDate fromDate;
    private LocalDate toDate;
    private String leaveType;
    private String reason;

    public StatusUpdateRequest() {
    }

    public StatusUpdateRequest(String status) {
        this.status = status;
    }

    public StatusUpdateRequest(String status, LocalDate fromDate, LocalDate toDate, String leaveType, String reason) {
        this.status = status;
        this.fromDate = fromDate;
        this.toDate = toDate;
        this.leaveType = leaveType;
        this.reason = reason;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
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

    public String getLeaveType() {
        return leaveType;
    }

    public void setLeaveType(String leaveType) {
        this.leaveType = leaveType;
    }

    public String getReason() {
        return reason;
    }

    public void setReason(String reason) {
        this.reason = reason;
    }
}
