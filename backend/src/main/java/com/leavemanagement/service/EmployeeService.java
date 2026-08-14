package com.leavemanagement.service;

import com.leavemanagement.dto.EmployeeDto;
import com.leavemanagement.exception.ResourceNotFoundException;
import com.leavemanagement.repository.LeaveRequestRepository;
import com.leavemanagement.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class EmployeeService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private LeaveRequestRepository leaveRequestRepository;

    public List<EmployeeDto> getAllEmployees() {
        return userRepository.findAll()
                .stream()
                .map(user -> new EmployeeDto(
                        user.getId(),
                        user.getName(),
                        user.getEmail(),
                        user.getRole(),
                        user.getCreatedAt()
                ))
                .collect(Collectors.toList());
    }

    @Transactional
    public void deleteEmployee(Long id) {
        if (!userRepository.existsById(id)) {
            throw new ResourceNotFoundException("Employee not found with id: " + id);
        }

        leaveRequestRepository.deleteByUserId(id);
        userRepository.deleteById(id);
    }
}
