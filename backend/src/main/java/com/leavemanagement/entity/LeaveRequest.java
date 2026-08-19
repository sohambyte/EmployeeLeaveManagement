package com.leavemanagement.entity;

import jakarta.persistence.*;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "leave_requests")
public class LeaveRequest {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(name = "leave_type", nullable = false)
    private String leaveType;

    @Column(name = "from_date", nullable = false)
    private LocalDate fromDate;

    @Column(name = "to_date", nullable = false)
    private LocalDate toDate;

    @Column(name = "requested_from_date")
    private LocalDate requestedFromDate;

    @Column(name = "requested_to_date")
    private LocalDate requestedToDate;

    @Column(nullable = false)
    private String reason;

    @Column(nullable = false)
    private String status; // PENDING, APPROVED, REJECTED

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    public LeaveRequest() {
    }

    public LeaveRequest(Long id, User user, String leaveType, LocalDate fromDate, LocalDate toDate, String reason, String status, LocalDateTime createdAt) {
        this.id = id;
        this.user = user;
        this.leaveType = leaveType;
        this.fromDate = fromDate;
        this.toDate = toDate;
        this.requestedFromDate = fromDate;
        this.requestedToDate = toDate;
        this.reason = reason;
        this.status = status;
        this.createdAt = createdAt;
    }

    public LeaveRequest(Long id, User user, String leaveType, LocalDate fromDate, LocalDate toDate, LocalDate requestedFromDate, LocalDate requestedToDate, String reason, String status, LocalDateTime createdAt) {
        this.id = id;
        this.user = user;
        this.leaveType = leaveType;
        this.fromDate = fromDate;
        this.toDate = toDate;
        this.requestedFromDate = requestedFromDate;
        this.requestedToDate = requestedToDate;
        this.reason = reason;
        this.status = status;
        this.createdAt = createdAt;
    }

    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
        if (this.status == null) {
            this.status = "PENDING";
        }
        if (this.requestedFromDate == null) {
            this.requestedFromDate = this.fromDate;
        }
        if (this.requestedToDate == null) {
            this.requestedToDate = this.toDate;
        }
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
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
        return requestedFromDate != null ? requestedFromDate : fromDate;
    }

    public void setRequestedFromDate(LocalDate requestedFromDate) {
        this.requestedFromDate = requestedFromDate;
    }

    public LocalDate getRequestedToDate() {
        return requestedToDate != null ? requestedToDate : toDate;
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
