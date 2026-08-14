package com.leavemanagement.repository;

import com.leavemanagement.entity.LeaveRequest;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface LeaveRequestRepository extends JpaRepository<LeaveRequest, Long> {
    List<LeaveRequest> findByUserIdOrderByCreatedAtDesc(Long userId);
    List<LeaveRequest> findAllByOrderByCreatedAtDesc();
    void deleteByUserId(Long userId);
}
