package com.Webtube.site.Service;

import com.Webtube.site.Exception.UsersNotFoundException;
import com.Webtube.site.Model.ERole;
import com.Webtube.site.Model.Role;
import com.Webtube.site.Model.Users;
import com.Webtube.site.Repository.RoleRepository;
import com.Webtube.site.Repository.UsersRepository;
import com.Webtube.site.Security.services.EmailService;
import com.Webtube.site.payload.request.SignupRequest;
import com.Webtube.site.payload.response.MessageResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.stream.Collectors;

@Service
public class UserServiceImpl implements UserService {

    @Autowired
    private UsersRepository usersRepository;

    @Autowired
    private RoleRepository roleRepository;

    @Autowired
    private PasswordEncoder encoder;

    @Autowired
    private EmailService emailService;

    @Override
    public List<Map<String, Object>> getAllUsers() {
        List<Users> usersList = usersRepository.findAll();

        return usersList.stream().map(user -> {
            Map<String, Object> userDetails = new HashMap<>();
            userDetails.put("id", user.getId());
            userDetails.put("fullname", user.getFullname());
            userDetails.put("username", user.getUsername());
            userDetails.put("email", user.getEmail());

            Set<String> roleNames = user.getRoles().stream()
                    .map(role -> role.getName().name())
                    .collect(Collectors.toSet());
            userDetails.put("roles", roleNames);

            return userDetails;
        }).collect(Collectors.toList());
    }

    @Override
    public ResponseEntity<?> getAllUsersResponse() {
        List<Map<String, Object>> users = getAllUsers();
        if (users.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NO_CONTENT)
                    .body(new MessageResponse("No users found."));
        }
        return ResponseEntity.ok(users);
    }

    @Override
    public ResponseEntity<?> registerUser(SignupRequest signUpRequest) {
        Users user = new Users(
                signUpRequest.getFullname(),
                signUpRequest.getUsername(),
                signUpRequest.getEmail(),
                encoder.encode(signUpRequest.getPassword())
        );

        Set<Role> roles = resolveRoles(signUpRequest.getRole());
        user.setRoles(roles);
        usersRepository.save(user);

        String emailBody = "Hello " + signUpRequest.getFullname() + ",\n\n"
                + "Your account has been successfully created.\n"
                + "Username: " + signUpRequest.getUsername() + "\n"
                + "Password: " + signUpRequest.getPassword() + "\n\n"
                + "Please log in and change your password as soon as possible.";

        emailService.sendEmail(signUpRequest.getEmail(), "Account Registration", emailBody);

        return ResponseEntity.ok(new MessageResponse("User registered successfully!"));
    }

    @Override
    public ResponseEntity<?> getUserById(Long id) {
        Users user = usersRepository.findById(id)
                .orElseThrow(() -> new UsersNotFoundException("Error: User with ID " + id + " not found."));
        return ResponseEntity.ok().body(user);
    }

    @Override
    public ResponseEntity<?> updateUser(Long id, SignupRequest updateRequest) {
        return usersRepository.findById(id).map(user -> {
            user.setUsername(updateRequest.getUsername());
            user.setEmail(updateRequest.getEmail());
            user.setFullname(updateRequest.getFullname());

            if (updateRequest.getPassword() != null && !updateRequest.getPassword().trim().isEmpty()) {
                user.setPassword(encoder.encode(updateRequest.getPassword()));
            }

            Set<Role> roles = resolveRoles(updateRequest.getRole());
            user.setRoles(roles);

            usersRepository.save(user);

            String emailBody = "Hello " + updateRequest.getFullname() + ",\n\n"
                    + "Your account has been successfully updated.\n"
                    + "Username: " + updateRequest.getUsername() + "\n"
                    + "Password: " + updateRequest.getPassword() + "\n\n"
                    + "Please don't forget your password again.";

            emailService.sendEmail(updateRequest.getEmail(), "Account Update", emailBody);

            return ResponseEntity.ok(new MessageResponse("User updated successfully!"));
        }).orElse(ResponseEntity.status(HttpStatus.NOT_FOUND)
                .body(new MessageResponse("Error: User not found.")));
    }

    @Override
    public ResponseEntity<?> deleteUser(Long id) {
        return usersRepository.findById(id).map(user -> {
            if ("defaultUser".equals(user.getUsername())) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN)
                        .body(new MessageResponse("Error: Default user cannot be deleted."));
            }
            usersRepository.delete(user);
            return ResponseEntity.ok(new MessageResponse("User deleted successfully!"));
        }).orElse(ResponseEntity.status(HttpStatus.NOT_FOUND)
                .body(new MessageResponse("Error: User not found.")));
    }

    private Set<Role> resolveRoles(Set<String> strRoles) {
        Set<Role> roles = new HashSet<>();
        if (strRoles == null || strRoles.isEmpty()) {
            Role authorRole = roleRepository.findByName(ERole.ROLE_AUTHOR)
                    .orElseThrow(() -> new RuntimeException("Error: Role is not found."));
            roles.add(authorRole);
        } else {
            for (String role : strRoles) {
                if (role.equalsIgnoreCase("admin")) {
                    Role adminRole = roleRepository.findByName(ERole.ROLE_ADMIN)
                            .orElseThrow(() -> new RuntimeException("Error: Role is not found."));
                    roles.add(adminRole);
                } else {
                    Role authorRole = roleRepository.findByName(ERole.ROLE_AUTHOR)
                            .orElseThrow(() -> new RuntimeException("Error: Role is not found."));
                    roles.add(authorRole);
                }
            }
        }
        return roles;
    }
}

