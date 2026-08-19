package com.leavemanagement.repository;

import com.leavemanagement.entity.LeaveRequest;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface LeaveRequestRepository extends JpaRepository<LeaveRequest, Long> {
    List<LeaveRequest> findByUserIdOrderByCreatedAtDesc(Long userId);
    List<LeaveRequest> findAllByOrderByCreatedAtDesc();
    void deleteByUserId(Long userId);

    @Query("SELECT COUNT(l) > 0 FROM LeaveRequest l WHERE l.user.id = :userId AND l.status IN ('PENDING', 'APPROVED') AND l.fromDate <= :toDate AND l.toDate >= :fromDate")
    boolean existsOverlappingLeaveForUser(@Param("userId") Long userId, @Param("fromDate") LocalDate fromDate, @Param("toDate") LocalDate toDate);

    @Query("SELECT COUNT(l) > 0 FROM LeaveRequest l WHERE l.user.id = :userId AND l.id != :excludeLeaveId AND l.status IN ('PENDING', 'APPROVED') AND l.fromDate <= :toDate AND l.toDate >= :fromDate")
    boolean existsOverlappingLeaveForUserExcludingId(@Param("userId") Long userId, @Param("excludeLeaveId") Long excludeLeaveId, @Param("fromDate") LocalDate fromDate, @Param("toDate") LocalDate toDate);
}
