package com.Webtube.site.Service;

import com.Webtube.site.payload.request.SignupRequest;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;

public interface UserService {
    List<Map<String, Object>> getAllUsers();
    ResponseEntity<?> getAllUsersResponse();
    ResponseEntity<?> registerUser(SignupRequest signUpRequest);
    ResponseEntity<?> getUserById(Long id);
    ResponseEntity<?> updateUser(Long id, SignupRequest updateRequest);
    ResponseEntity<?> deleteUser(Long id);

    ResponseEntity<?> searchUsers(String query);

}

