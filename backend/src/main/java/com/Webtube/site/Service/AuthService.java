// File: AuthService.java
package com.Webtube.site.Service;

import com.Webtube.site.payload.request.LoginRequest;
import com.Webtube.site.payload.response.JwtResponse;

public interface AuthService {
    JwtResponse authenticateUser(LoginRequest loginRequest);
}
