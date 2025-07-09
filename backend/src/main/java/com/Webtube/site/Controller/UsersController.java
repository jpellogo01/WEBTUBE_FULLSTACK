package com.Webtube.site.Controller;

import com.Webtube.site.Exception.UsersNotFoundException;
import com.Webtube.site.Model.ERole;
import com.Webtube.site.Model.Role;
import com.Webtube.site.Model.Users;
import com.Webtube.site.Repository.RoleRepository;
import com.Webtube.site.Repository.UsersRepository;
import com.Webtube.site.Security.services.EmailService;
import com.Webtube.site.Service.UserService;
import com.Webtube.site.payload.request.SignupRequest;
import com.Webtube.site.payload.response.MessageResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;


import javax.validation.Valid;
import java.util.*;
import java.util.stream.Collectors;
@RestController
@CrossOrigin(origins = "http://localhost:3000", allowCredentials = "true")
@RequestMapping("/api/v1")
public class UsersController {

    @Autowired
    private UserService userService;

    @GetMapping("/user")
    public ResponseEntity<?> getAllUsers() {
        return userService.getAllUsersResponse();
    }

    @PostMapping("/user")
    public ResponseEntity<?> registerUser(@Valid @RequestBody SignupRequest signUpRequest) {
        return userService.registerUser(signUpRequest);
    }

    @GetMapping("/user/{id}")
    public ResponseEntity<?> getUserById(@PathVariable Long id) {
        return userService.getUserById(id);
    }

    @PutMapping("/user/{id}")
    public ResponseEntity<?> updateUser(
            @PathVariable Long id,
            @Valid @RequestBody SignupRequest updateRequest) {
        return userService.updateUser(id, updateRequest);
    }

    @DeleteMapping("/user/{id}")
    public ResponseEntity<?> deleteUser(@PathVariable Long id) {
        return userService.deleteUser(id);
    }
    @GetMapping("/user/search")
    public ResponseEntity<?> searchUsers(@RequestParam String query) {
        return userService.searchUsers(query);
    }
}
