-- Employee Leave Management System - SQL Assessment Queries

USE leave_management_db;

-- 1. Display all users
SELECT id, name, email, role, created_at
FROM users;

-- 2. Display leave requests for a specific user (e.g., user_id = 1)
SELECT id, leave_type, from_date, to_date, reason, status, created_at
FROM leave_requests
WHERE user_id = 1;

-- 3. Count requests by status
SELECT status, COUNT(*) AS request_count
FROM leave_requests
GROUP BY status;

-- 4. Find pending requests
SELECT *
FROM leave_requests
WHERE status = 'PENDING';

-- 5. Find approved requests ordered by date (from_date descending)
SELECT *
FROM leave_requests
WHERE status = 'APPROVED'
ORDER BY from_date DESC;

-- 6. Join users with leave requests
SELECT 
    u.id AS user_id,
    u.name AS employee_name,
    u.email AS employee_email,
    lr.id AS leave_id,
    lr.leave_type,
    lr.from_date,
    lr.to_date,
    lr.reason,
    lr.status,
    lr.created_at AS requested_at
FROM users u
INNER JOIN leave_requests lr ON u.id = lr.user_id
ORDER BY lr.created_at DESC;

-- 7. Update request status (e.g., approve request #1)
UPDATE leave_requests
SET status = 'APPROVED'
WHERE id = 1;

-- 8. Delete a pending request (e.g., delete pending request #2)
DELETE FROM leave_requests
WHERE id = 2 AND status = 'PENDING';
