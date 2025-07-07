// File: AuthController.java
package com.Webtube.site.Controller;

import com.Webtube.site.Service.AuthService;
import com.Webtube.site.payload.request.LoginRequest;
import com.Webtube.site.payload.response.JwtResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;

@CrossOrigin(origins = "http://localhost:3000/")
@RestController
@RequestMapping("/api/v1")
public class AuthController {

  @Autowired
  private AuthService authService;

  @PostMapping("/login")
  public ResponseEntity<JwtResponse> authenticateUser(@Valid @RequestBody LoginRequest loginRequest) {
    JwtResponse jwtResponse = authService.authenticateUser(loginRequest);
    return ResponseEntity.ok(jwtResponse);
  }
}
